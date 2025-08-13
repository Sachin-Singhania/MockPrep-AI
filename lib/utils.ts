import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
export function getStatus(score: number): { status: string } {
  if (score >= 85 && score <= 100) {
    return { status: "Excellent" }
  } else if (score >= 70 && score < 85) {
    return { status: "Good" }
  } else if (score >= 50 && score < 70) {
    return { status: "Average" }
  } else if (score >= 30 && score < 50) {
    return { status: "Below Average" }
  } else {
    return { status: "Poor" }
  }
}

export function getTimeDiffInMins(startTime: Date, EndTime: Date) {
  const min = Math.floor((EndTime.getMinutes() - startTime.getMinutes()));
  return min;
}
export const transformApiData = (apiData: any, userName: string): InterviewData => {
  const {
    InterviewSummary,
    GrowthAreas,
    HRInsight,
    CommunicationScore,
    ProblemSolvingScore,
    RelevanceScore,
    TechnicalScore,
    VocabularyScore,
    overallScore,
    questions,
    KeyStrengths,
    TechnicalKeywords,
    Interview,
  } = apiData;

  const durationMs = Interview.endTime
    ? new Date(Interview.endTime).getTime() - new Date(Interview.startTime).getTime()
    : 0;
  const totalMinutes = Math.floor(durationMs / 60000);

  return {
    aiNotes: InterviewSummary,
    areasForImprovement: GrowthAreas,
    candidateName: userName,
    date: new Date(Interview.startTime),
    duration: durationMs > 0
      ? `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`
      : "N/A",
    hrInsights: {
      culturalFit: HRInsight?.CulturalFit,
      experienceLevel: HRInsight?.ExperienceLevel,
      interviewReadiness: HRInsight?.InterviewReadlineScore,
      learningPotential: HRInsight?.LearningPotential,
      technicalCompetency: HRInsight?.TechnicalCompetency,
    },
    InterviewScores: {
      communication: CommunicationScore,
      problemSolving: ProblemSolvingScore,
      relevance: RelevanceScore,
      technicalKnowledge: TechnicalScore,
      vocabulary: VocabularyScore,
    },
    overallScore,
    position: Interview.Jobtitle,
    questionPerformance: questions.map((val: any, index: number) => ({
      question: `Q${index + 1}`,
      score: val.score,
      topic: val.question,
      status: getStatus(val.score).status,
    })),
    strengths: KeyStrengths,
    technicalKeywords: TechnicalKeywords,
  };
};
export function timeAgo(date: Date) {
  const now = new Date().getTime();
  const diffMs = now - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
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