// "use server"
// import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
// import { PassThrough } from "stream";
// const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_APIKEY });
// const voiceId= "eA8FmgNe2rjMWPK5PQQZ";



// export async function synthesizeSpeechStream(message:string): Promise<Result<ReadableStream<Uint8Array>,string>> {
//   try {
    
  
//     const audioStream = await client.textToSpeech.stream(
//         voiceId,
//         {
//             text :message,
//             modelId :"eleven_multilingual_v2",
//         },
//     );
//         const passThrough = new PassThrough();

// (async () => {
//       try {
//         //@ts-ignore
//         for await (const chunk of audioStream) {
//           const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
//           passThrough.write(buffer);
//         }
//         passThrough.end();
//       } catch (err) {
//         passThrough.destroy(err instanceof Error ? err : new Error(String(err)));
//       }
//     })();

//     const webStream = new ReadableStream<Uint8Array>({
//       start(controller) {
//         passThrough.on('data', (chunk: Buffer) => {
//           controller.enqueue(new Uint8Array(chunk));
//         });
//         passThrough.on('end', () => {
//           controller.close();
//         });
//         passThrough.on('error', (err) => {
//           controller.error(err);
//         });
//       },
//       cancel() {
//         passThrough.destroy();
//       },
//     });

//     return Ok(webStream);
//     } catch (error) {
//      return Err("error aaya ha : "+error);
//   }
// }
// export async function transcribeAudio(formData: FormData) {
//   const file = formData.get("file") as File;
//   if (!file) throw new Error("No audio file found");
 
//  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
//   method: "POST",
//   headers: {
//     "xi-api-key":  ""
//   },
//   body: formData,
// });

  
//   if (!response.ok) {
//     throw new Error(`Failed to transcribe audio: ${await response.text()}`);
//   }

//   const result = await response.json();
//   return result;
// }
