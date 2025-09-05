import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Request method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Creating WebSocket connection to OpenAI...');
    const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    let sessionCreated = false;

    // Handle OpenAI WebSocket connection
    openaiWs.onopen = () => {
      console.log('✅ Connected to OpenAI Realtime API');
    };

    openaiWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📥 OpenAI message type:', data.type);
        
        if (data.type === 'session.created') {
          sessionCreated = true;
          console.log('✅ Session created, session ID:', data.session?.id);
        }
        
        // Forward all messages to client
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      } catch (error) {
        console.error('❌ Error processing OpenAI message:', error);
      }
    };

    openaiWs.onerror = (error) => {
      console.error('❌ OpenAI WebSocket error:', error);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ 
          type: 'error', 
          error: 'OpenAI connection error' 
        }));
      }
    };

    openaiWs.onclose = (event) => {
      console.log('🔴 OpenAI WebSocket closed:', event.code, event.reason);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

    // Handle client messages
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📤 Client message type:', data.type);
        
        if (openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.send(event.data);
        } else {
          console.warn('⚠️ OpenAI WebSocket not ready, state:', openaiWs.readyState);
        }
      } catch (error) {
        console.error('❌ Error processing client message:', error);
      }
    };

    socket.onopen = () => {
      console.log('✅ Client connected');
    };

    socket.onclose = (event) => {
      console.log('🔴 Client disconnected:', event.code, event.reason);
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error('❌ Client socket error:', error);
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close();
      }
    };

  } catch (error) {
    console.error('❌ Error in WebSocket handler:', error);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ 
        type: 'error', 
        error: error.message 
      }));
      socket.close();
    }
  }

  return response;
});