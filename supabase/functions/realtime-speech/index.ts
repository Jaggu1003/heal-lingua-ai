import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    socket.close(1000, 'OpenAI API key not configured');
    return response;
  }

  // Connect to OpenAI Realtime API
  const openAIUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
  let openAISocket: WebSocket;

  try {
    openAISocket = new WebSocket(openAIUrl, [], {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1",
      },
    });
  } catch (error) {
    console.error('Failed to connect to OpenAI:', error);
    socket.close(1000, 'Failed to connect to OpenAI');
    return response;
  }

  let sessionCreated = false;

  // Handle OpenAI WebSocket events
  openAISocket.onopen = () => {
    console.log('Connected to OpenAI Realtime API');
  };

  openAISocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('OpenAI message:', data.type);

      // Configure session after connection
      if (data.type === 'session.created' && !sessionCreated) {
        sessionCreated = true;
        const sessionUpdate = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `You are a helpful healthcare AI assistant. Provide accurate, safe, and medically sensible home remedies and health advice. Always include appropriate disclaimers about consulting healthcare professionals. Keep responses conversational and brief. IMPORTANT DISCLAIMER: This advice is for informational purposes only and should not replace professional medical consultation.`,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.7,
            max_response_output_tokens: 1000
          }
        };
        
        openAISocket.send(JSON.stringify(sessionUpdate));
        console.log('Session updated with healthcare instructions');
      }

      // Forward all messages to client
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    } catch (error) {
      console.error('Error processing OpenAI message:', error);
    }
  };

  openAISocket.onerror = (error) => {
    console.error('OpenAI WebSocket error:', error);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'error',
        error: 'OpenAI connection error'
      }));
    }
  };

  openAISocket.onclose = (event) => {
    console.log('OpenAI WebSocket closed:', event.code, event.reason);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close(event.code, event.reason);
    }
  };

  // Handle client WebSocket events
  socket.onopen = () => {
    console.log('Client connected to edge function');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Client message:', data.type);
      
      // Forward client messages to OpenAI
      if (openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      } else {
        console.error('OpenAI socket not ready, message dropped');
      }
    } catch (error) {
      console.error('Error processing client message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error);
  };

  socket.onclose = (event) => {
    console.log('Client disconnected:', event.code, event.reason);
    if (openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close();
    }
  };

  return response;
});