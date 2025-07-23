import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


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

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const audioChunksRef = useRef<Blob[]>([])
  // const toggleRecording = async () => {
  //   if (isRecording) {
  //     mediaRecorderRef.current?.stop()
  //     setIsRecording(false)
  //   } else {
  //     try {
  //    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     audioChunksRef.current = [];

  //     mediaRecorder.ondataavailable = (event) => {
  //       if (event.data.size > 0) {
  //         audioChunksRef.current.push(event.data);
  //       }
  //     };

  //     mediaRecorder.onstop = async () => {
  //       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
  //       console.log("HELLO");
  //       const formData = new FormData();
  //       formData.append("file", audioBlob); 
  //       formData.append("model_id", "scribe_v1"); 

  //       const res = await transcribeAudio(formData);
  //       setIsRecording(false);
  //       setisBlock(true);
  //         const text = res?.text?.trim();
  //         if (text) {
  //       setFromTranscription(true);
  //       setMessage(text);
  //     }
  //       console.log(res.text);
  //       console.log(message);
  //       await sendMessage();
  //     };

  //     mediaRecorder.start();
  //     setIsRecording(true);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }