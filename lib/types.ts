interface UserDetails {
    userTagline: string;
    userSkills: string[];
    userExperience: number;
}
interface JobDescription {
    jobTitle: string;
    jobDescription: string;
    skills: string;
    experience: number;
    difficulty : "EASY" | "MEDIUM" | "HARD";
}
type Project = {
    projectName: string;
    projectDescription: string;
}
interface Resume {
    Skills: string[];
    WorkExperience: Experience[],
    Projects: Project[]
}
interface interviewDetails {
    id? : string;
    JobDescription: JobDescription,
    InterviewChatHistory: InterviewChat[]
    name: string,
    timeLeft: string,
    startTime: Date,
}
interface Experience {
  title: string
  company: string
  startYear : number
  endYear?: number
}
type InterviewChat =
    | {
        Sender: "USER" | "ASSISTANT";
        Content: string;
        ContentType: "VALIDATION";
        score: number;
    }
    | {
        Sender: "USER" | "ASSISTANT";
        Content: string;
        ContentType: "ANSWER" | "FORMALCHAT" | "QUESTION" | "END";
    };
    interface InterviewData extends InterviewInsights {
    candidateName: string;
    position: string;
    duration: string;
    overallScore: number;
    questionPerformance: questionPerformance[]
}
type questionPerformance = {
    question: string;
    score: number;
    topic: string;
    status: string;
}
interface InterviewInsights {
    InterviewScores: {
        communication: number;
        technicalKnowledge: number;
        problemSolving: number;
        vocabulary: number;
        relevance: number;
    };
    technicalKeywords: string[];
    strengths: string[];
    areasForImprovement: string[];
    hrInsights: {
        technicalCompetency: string;
        experienceLevel: string;
        culturalFit: string;
        learningPotential: string;
        interviewReadiness: number;
    };
    aiNotes: string;
};