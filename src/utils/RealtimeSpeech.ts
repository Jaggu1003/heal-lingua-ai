export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
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
      console.error('Error playing audio:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    // Convert bytes to 16-bit samples
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    // Create WAV header
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // WAV header parameters
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    // Write WAV header
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

    // Combine header and data
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
  private sessionCreated = false;
  private currentLanguage = 'en';

  constructor() {
    // Don't create AudioContext here - wait for user interaction
  }

  async connect(onMessage: (message: any) => void, onStatusChange: (status: string) => void, language = 'en') {
    this.onMessageCallback = onMessage;
    this.onStatusChangeCallback = onStatusChange;
    this.currentLanguage = language;
    this.sessionCreated = false;

    try {
      // Create AudioContext with user gesture
      if (!this.audioContext) {
        this.audioContext = new AudioContext({ sampleRate: 24000 });
        this.audioQueue = new AudioQueue(this.audioContext);
      }

      // Resume AudioContext if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('AudioContext resumed');
      }

      const wsUrl = `wss://qvoxdwzjbcprfhpykidx.functions.supabase.co/realtime-speech`;
      console.log('Connecting to:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected - waiting for session.created');
        this.onStatusChangeCallback?.('connecting');
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data.type, data);
          
          if (data.type === 'session.created') {
            console.log('Session created, sending session.update');
            this.sessionCreated = true;
            this.sendSessionUpdate(this.currentLanguage);
          } else if (data.type === 'session.updated') {
            console.log('Session updated, starting audio recording');
            this.onStatusChangeCallback?.('connected');
            await this.startRecording();
          } else if (data.type === 'response.audio.delta') {
            // Play audio chunk
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            await this.audioQueue?.addToQueue(bytes);
            this.onStatusChangeCallback?.('speaking');
          } else if (data.type === 'response.audio_transcript.delta') {
            // Handle transcript
            this.onMessageCallback?.(data);
          } else if (data.type === 'input_audio_buffer.speech_started') {
            console.log('Speech started detected');
            this.onStatusChangeCallback?.('listening');
          } else if (data.type === 'input_audio_buffer.speech_stopped') {
            console.log('Speech stopped detected');
            this.onStatusChangeCallback?.('processing');
          } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
            console.log('User transcript:', data.transcript);
            this.onMessageCallback?.(data);
          } else if (data.type === 'response.audio_transcript.done') {
            this.onMessageCallback?.(data);
          } else if (data.type === 'response.done') {
            console.log('Response done');
            this.onStatusChangeCallback?.('connected');
          } else if (data.type === 'error') {
            console.error('OpenAI error:', data.error);
            this.onStatusChangeCallback?.('error');
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onStatusChangeCallback?.('error');
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.onStatusChangeCallback?.('disconnected');
      };
      
    } catch (error) {
      console.error('Error connecting:', error);
      this.onStatusChangeCallback?.('error');
      throw error;
    }
  }

  private sendSessionUpdate(language: string) {
    if (this.ws?.readyState === WebSocket.OPEN && this.sessionCreated) {
      console.log('Sending session.update for language:', language);
      this.ws.send(JSON.stringify({
        type: 'session.update',
        session: {
          instructions: `You are a helpful healthcare assistant. Always respond in ${language === 'en' ? 'English' : this.getLanguageName(language)}. Provide brief, practical home remedies and health advice. Include appropriate medical disclaimers. Keep responses concise and under 30 seconds when speaking.`,
          modalities: ['text', 'audio'],
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
            silence_duration_ms: 1500
          },
          temperature: 0.8,
          max_response_output_tokens: 1000
        }
      }));
    }
  }

  private async startRecording() {
    try {
      console.log('Starting audio recording...');
      this.recorder = new AudioRecorder((audioData) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          this.ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await this.recorder.start();
      console.log('Audio recording started successfully');
    } catch (error) {
      console.error('Error starting recording:', error);
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
    this.currentLanguage = language;
    if (this.sessionCreated) {
      this.sendSessionUpdate(language);
    }
  }

  disconnect() {
    console.log('Disconnecting RealtimeSpeechChat');
    this.recorder?.stop();
    this.ws?.close();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.sessionCreated = false;
    this.onStatusChangeCallback?.('disconnected');
  }
}