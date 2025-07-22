"use server"
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_APIKEY });
const voiceId= "eA8FmgNe2rjMWPK5PQQZ";

export async function synthesizeSpeechStream(message:string) {
    
    const audioStream = client.textToSpeech.stream(
        voiceId,
        {
            text :message,
            modelId :"eleven_multilingual_v2",
        },
    );
      const stream = await audioStream; 

 return stream
}
export async function transcribeAudio(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No audio file found");
 
 const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
  method: "POST",
  headers: {
    "xi-api-key":  "sk_91f13f06a1799aefcc7c6bea75f4583a6ab1ae10180bb3a1"
  },
  body: formData,
});

  
  if (!response.ok) {
    throw new Error(`Failed to transcribe audio: ${await response.text()}`);
  }

  const result = await response.json();
  return result;
}