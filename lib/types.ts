interface UserDetails {
    userTagline: string;
    userSkills: string[];
    userExperience: number;
}
type Project = {
    id? : string;
    name: string;
    description: string;
}
interface Resume {
    Skills: Set<string>;
    WorkExperience: Experience[],
    Projects: Project[]
}
interface JobDescription {
    jobTitle: string;
    jobDescription: string;
    skills: string;
    experience: number;
    difficulty : "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}
interface pastInterviews{
    id: string;
    jobTitle: string;
    date: string;
    duration: string;
    score: number;
}[]
interface interviewDetails {
    id? : string;
    JobDescription: JobDescription,
    InterviewChatHistory: InterviewChat[]
    name: string,
    startTime: Date,
}
interface Experience {
  id? :string
  role: string
  company: string
  startYear : number
  endYear?: number | null
}
type InterviewChat =
    | {
        id?: string
        Sender: "ASSISTANT";
        Content: string;
        ContentType: "VALIDATION";
        score: number;
    }
    | {
        id?: string
        Sender: "USER" | "ASSISTANT";
        Content: string;
        ContentType: "ANSWER" | "FORMALCHAT" | "QUESTION" | "END";
    } ;
    interface InterviewData extends InterviewInsights {
      date : Date
    candidateName: string;
    position: string;
    duration: string;
    overallScore: number;
    questionPerformance: questionPerformance[]
}
type questionPerformance = {
      id?:string
    question: string;
    score?: number;
    topic: string;
    status?: string;
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
interface getProfile{
  id: string;
  createdAt: Date;
  Profile: {
    id: string;
    tagline: string | null;
    about: string | null;
    Skills: string[];
    WorkExperience: {
      id: string;
      company: string;
      role: string;
      startYear: number;
      endYear: number | null;
    }[];
    Projects: {
      id: string;
      name: string;
      description: string;
    }[];
  } | null;
  Interview: {
    id: string;
    startTime: Date;
    endTime: Date | null;
    Analytics: {
      id: string;
      overallScore: number;
    } | null;
  }[];
}type RadarDataItem = {
  subject: string;
  score: number;
  fullMark: number;
};
