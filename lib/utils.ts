import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_APIKEY });
await client.speechToText.convert({
    modelId: "model_id"
});

export function getStatus(score: number): { status: string} {
    if (score >= 85 && score <= 100) {
        return { status: "Excellent"}
    } else if (score >= 70 && score < 85) {
        return { status: "Good"}
    } else if (score >= 50 && score < 70) {
        return { status: "Average"}
    } else if (score >= 30 && score < 50) {
        return { status: "Below Average"}
    } else {
        return { status: "Poor"}
    }
}
export function textToSpeech(message:string){

}
export function speechtoText(){

}