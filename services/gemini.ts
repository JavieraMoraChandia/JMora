
import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Removed separate API_KEY constant and use process.env.API_KEY directly as per guidelines.

export const translatePictograms = async (pictograms: string[]): Promise<string> => {
  // Fix: Always use process.env.API_KEY directly when initializing the client instance.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a language assistant for a teenager with ASD. 
  I will give you a sequence of words/labels from pictograms. 
  Your task is to transform them into a natural, grammatically correct, and simple Spanish sentence that the teenager would say to communicate.
  
  Input labels: ${pictograms.join(", ")}
  Output: Return ONLY the Spanish sentence. No explanations.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.1,
    }
  });

  // Fix: Access .text property directly (it is a getter, not a method).
  return response.text || "No se pudo generar la frase.";
};

export const generateSpeech = async (text: string): Promise<Uint8Array> => {
  // Fix: Always use process.env.API_KEY directly when initializing the client instance.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data returned");
  
  return decode(base64Audio);
};

// Utils for audio
// Fix: Implement manual decode function following the provided @google/genai examples.
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Fix: Implement decodeAudioData following the provided @google/genai examples for raw PCM data.
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
