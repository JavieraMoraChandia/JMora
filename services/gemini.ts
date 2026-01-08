
import { GoogleGenAI, Modality } from "@google/genai";

export const translatePictograms = async (pictograms: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Eres un asistente de comunicación para un adolescente con TEA (Trastorno del Espectro Autista). 
  Tu objetivo es convertir una lista de etiquetas de pictogramas en una frase en español natural, sencilla y propia de un chico de 13-17 años.
  
  Reglas:
  1. Usa un lenguaje natural (ej. en vez de "Yo querer comer manzana", usa "Me apetece una manzana" o "Quiero comer una manzana").
  2. Mantén la frase corta y directa.
  3. Evita sonar infantil o demasiado robótico.
  
  Etiquetas de entrada: ${pictograms.join(", ")}
  Resultado (SOLO la frase en español):`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    });
    return response.text?.trim() || "No sé qué decir.";
  } catch (error) {
    console.error("Error translation:", error);
    return "Error al generar la frase.";
  }
};

export const generateSpeech = async (text: string): Promise<Uint8Array> => {
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
  if (!base64Audio) throw new Error("No audio data");
  
  return decode(base64Audio);
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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
