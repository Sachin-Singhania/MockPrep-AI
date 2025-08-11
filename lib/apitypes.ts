import { $Enums, Prisma } from "@prisma/client"

export type ProfileResult = Prisma.DashboardGetPayload<{
    select:{
         Profile: {
                    select: {
                        id: true,
                        Projects: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        },
                        Skills: true,
                        WorkExperience: {
                            select: {
                                company: true,
                                endYear: true,
                                id: true,
                                role: true,
                                startYear: true,
                            }
                        },
                        tagline: true,
                        about: true,
                        
                    }
                }, Interview: {
                    where: {
                        status: "COMPLETED"
                    },
                    select: {
                        id: true,
                        Analytics: {
                            select: {
                                id: true,
                                overallScore: true,
                            }
                        },
                        startTime: true,
                        endTime: true, Jobtitle: true
                    }
                },Activity:{
                    select: {
                        type: true,
                        content: true,
                    }
                },id : true,
                createdAt: true,
    }
}>
export type RegisterPayload={
    name: string | null;
    id: string;
    email: string;
    image: string | null;
    dashboards: {
        id: string;
    } | null;
}
export type InterviewResult = Prisma.AnalyticsGetPayload<{
  select: {
    CommunicationScore: true,
    ProblemSolvingScore: true,
    HRInsight: true,
    GrowthAreas: true,
    InterviewSummary: true,
    KeyStrengths: true,
    overallScore: true,
    VocabularyScore: true,
    TechnicalKeywords: true,
    TechnicalScore: true,
    RelevanceScore: true,
    questions: {
      select: {
        id: true,
        question: true,
        score: true,
      }
    },
    Interview: {
      select: {
        startTime: true,
        endTime: true,
        Jobtitle: true
      }
    }
  }
}>;
export type createInterviewPayload = {
    id: string;
    Jobtitle: string;
    description: string;
    difficulty: $Enums.Level;
    skills: string;
    experience: string;
}

export class LimitExceededError extends Error {
    constructor(message: string = "User limit exceeded") {
        super(message);
        this.name = "LimitExceededError";
    }
}