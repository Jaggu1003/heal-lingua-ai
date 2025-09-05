export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      console.log('🎤 Requesting microphone access...');
      
      // Request microphone with specific constraints
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      console.log('✅ Microphone access granted');
      console.log('📊 Audio tracks:', this.stream.getAudioTracks().map(track => ({
        label: track.label,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState
      })));
      
      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      // Resume if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('🔄 AudioContext resumed');
      }
      
      console.log('🎵 AudioContext state:', this.audioContext.state);
      
      // Create audio processing chain
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Check if there's actual audio data (not just silence)
        const hasAudio = Array.from(inputData).some(sample => Math.abs(sample) > 0.001);
        
        if (hasAudio) {
          this.onAudioData(new Float32Array(inputData));
        }
      };
      
      // Connect the audio processing chain
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      this.isRecording = true;
      console.log('🔴 Audio recording started');
      
    } catch (error) {
      console.error('❌ Error starting audio recorder:', error);
      throw error;
    }
  }

  stop() {
    console.log('⏹️ Stopping audio recorder');
    this.isRecording = false;
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Stopped audio track:', track.label);
      });
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = this.createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      this.playNext();
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

export class RealtimeSpeechChat {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioQueue | null = null;
  private recorder: AudioRecorder | null = null;
  private onMessageCallback: ((message: any) => void) | null = null;
  private onStatusChangeCallback: ((status: string) => void) | null = null;
  private sessionReady = false;
  private currentLanguage = 'en';
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    console.log('🔧 Initializing RealtimeSpeechChat');
  }

  async connect(onMessage: (message: any) => void, onStatusChange: (status: string) => void, language = 'en') {
    console.log('🚀 Starting connection process...');
    this.onMessageCallback = onMessage;
    this.onStatusChangeCallback = onStatusChange;
    this.currentLanguage = language;
    this.sessionReady = false;

    try {
      // Create AudioContext with user interaction
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      console.log('🎵 AudioContext created, state:', this.audioContext.state);
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('🔄 AudioContext resumed');
      }
      
      this.audioQueue = new AudioQueue(this.audioContext);

      // Connect to WebSocket
      const wsUrl = `wss://qvoxdwzjbcprfhpykidx.functions.supabase.co/realtime-speech`;
      console.log('🔌 Connecting to:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        console.error('⏰ Connection timeout');
        this.onStatusChangeCallback?.('error');
      }, 10000);

      this.setupWebSocketHandlers();
      
    } catch (error) {
      console.error('❌ Error in connect:', error);
      this.onStatusChangeCallback?.('error');
      throw error;
    }
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      this.onStatusChangeCallback?.('connecting');
    };

    this.ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Received:', data.type);
        
        switch (data.type) {
          case 'session.created':
            console.log('🎯 Session created, configuring...');
            this.configureSession();
            break;
            
          case 'session.updated':
            console.log('✅ Session configured, ready for audio');
            this.sessionReady = true;
            this.onStatusChangeCallback?.('connected');
            await this.startMicrophoneCapture();
            break;
            
          case 'input_audio_buffer.speech_started':
            console.log('🗣️ User started speaking');
            this.onStatusChangeCallback?.('listening');
            break;
            
          case 'input_audio_buffer.speech_stopped':
            console.log('🤫 User stopped speaking');
            this.onStatusChangeCallback?.('processing');
            break;
            
          case 'response.audio.delta':
            // Play AI audio response
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            await this.audioQueue?.addToQueue(bytes);
            this.onStatusChangeCallback?.('speaking');
            break;
            
          case 'response.audio_transcript.delta':
          case 'conversation.item.input_audio_transcription.completed':
          case 'response.audio_transcript.done':
            this.onMessageCallback?.(data);
            break;
            
          case 'response.done':
            console.log('✅ AI response complete');
            this.onStatusChangeCallback?.('connected');
            break;
            
          case 'error':
            console.error('❌ OpenAI error:', data.error);
            this.onStatusChangeCallback?.('error');
            break;
            
          default:
            console.log('📋 Other message:', data.type);
        }
      } catch (error) {
        console.error('❌ Error processing message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      this.onStatusChangeCallback?.('error');
    };

    this.ws.onclose = (event) => {
      console.log('🔌 WebSocket closed:', event.code, event.reason);
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      this.onStatusChangeCallback?.('disconnected');
    };
  }

  private configureSession() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: `You are a helpful healthcare assistant. Always respond in ${this.currentLanguage === 'en' ? 'English' : this.getLanguageName(this.currentLanguage)}. Provide brief, practical home remedies and health advice. Include appropriate medical disclaimers. Keep responses concise and under 20 seconds.`,
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.6, // Higher threshold to reduce false positives
          prefix_padding_ms: 300,
          silence_duration_ms: 2000 // Longer silence to avoid cutting off
        },
        temperature: 0.7,
        max_response_output_tokens: 500
      }
    };
    
    console.log('⚙️ Sending session configuration');
    this.ws.send(JSON.stringify(sessionConfig));
  }

  private async startMicrophoneCapture() {
    try {
      console.log('🎤 Starting microphone capture...');
      
      this.recorder = new AudioRecorder((audioData) => {
        if (this.ws?.readyState === WebSocket.OPEN && this.sessionReady) {
          // Only send audio if there's actual content
          const hasContent = Array.from(audioData).some(sample => Math.abs(sample) > 0.01);
          if (hasContent) {
            const encoded = encodeAudioForAPI(audioData);
            this.ws.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encoded
            }));
          }
        }
      });

      await this.recorder.start();
      console.log('✅ Microphone capture started');
      
    } catch (error) {
      console.error('❌ Failed to start microphone:', error);
      this.onStatusChangeCallback?.('error');
      throw error;
    }
  }

  private getLanguageName(code: string): string {
    const languages: Record<string, string> = {
      'hi': 'Hindi',
      'en': 'English',
      'ta': 'Tamil',
      'te': 'Telugu',
      'bn': 'Bengali',
      'mr': 'Marathi',
      'gu': 'Gujarati',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'pa': 'Punjabi',
      'or': 'Odia',
      'as': 'Assamese'
    };
    return languages[code] || 'English';
  }

  updateLanguage(language: string) {
    console.log('🌍 Updating language to:', language);
    this.currentLanguage = language;
    if (this.sessionReady) {
      this.configureSession();
    }
  }

  disconnect() {
    console.log('🔌 Disconnecting RealtimeSpeechChat');
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    this.recorder?.stop();
    this.ws?.close();
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    this.sessionReady = false;
    this.onStatusChangeCallback?.('disconnected');
  }
}