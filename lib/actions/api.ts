"use server"
import { Level, QuestionType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { createInterviewPayload, InterviewResult, LimitExceededError, ProfileResult, RegisterPayload } from "../apitypes";
import { authOptions } from "../auth";
import { prisma } from "../prisma";
import { redis } from "../redis";
import { uuidv4 } from "../utils";


export async function getProfile(userId: string) : Promise<Result<{ message: string; data: ProfileResult | null },string>> {
    try {
        const resp = await prisma.dashboard.findFirst({
            where: {
                userId
            }, select: {
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
        })
        return Ok({
            message: "Profile Retrieved Successfully",
            data: resp
        })
    } catch (error) {
        console.error("Error fetching profile:", error);
             return Err("Error Occured : "+error);
    }
}

export async function getInterviewDetails(interviewId: string) : Promise<Result<{ message: string; status: number; data?: InterviewResult | null },string>> {
    if (!interviewId) {
        return Ok({
            message: " Analytics ID is required",
            status: 400,
        })
    }
    try {
        
        const interview = await prisma.analytics.findUnique({
            where: { interviewId },
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
            RelevanceScore: true, questions: {
                select: {
                    id: true,
                    question: true,
                    score: true,
                }
            }, Interview: {
                select: {
                    startTime: true,
                    endTime: true, Jobtitle: true
                }
            }
        }
    });
    return Ok({
        message: "Interview details fetched successfully",
        status: 200,
        data: interview
    });
} catch (error) {
    console.error(error);
    return Err("Error fetching interview details: " + error);
}

}

export async function setInterviewDetails(interviewData: InterviewData, interviewDetails: interviewDetails, endTime: Date) : Promise<Result<{ message: string; status: number },string>> {
    try {
        await prisma.interview.update({
            where: { id: interviewDetails.id },
            data: {
                endTime,
                status: "COMPLETED",
                Messages: {
                    createMany: {
                        data: interviewDetails.InterviewChatHistory.map((message) => ({
                            content: message.Content,
                            type: message.ContentType as QuestionType,
                            Sender: message.Sender, id: message.id
                        }))
                    }
                },
                Analytics: {
                    update: {
                        CommunicationScore: interviewData.InterviewScores.communication,
                        ProblemSolvingScore: interviewData.InterviewScores.problemSolving,
                        HRInsight: {
                            create: {
                                CulturalFit: interviewData.hrInsights.culturalFit,
                                ExperienceLevel: interviewData.hrInsights.experienceLevel,
                                InterviewReadlineScore: interviewData.hrInsights.interviewReadiness,
                                LearningPotential: interviewData.hrInsights.learningPotential,
                                TechnicalCompetency: interviewData.hrInsights.technicalCompetency,
                            }
                        },
                        GrowthAreas: interviewData.areasForImprovement,
                        InterviewSummary: interviewData.aiNotes,
                        KeyStrengths: interviewData.strengths,
                        overallScore: interviewData.overallScore,
                        VocabularyScore: interviewData.InterviewScores.vocabulary,
                        TechnicalKeywords: interviewData.technicalKeywords,
                        TechnicalScore: interviewData.InterviewScores.technicalKnowledge,
                        RelevanceScore: interviewData.InterviewScores.relevance,
                        questions: {
                            createMany: {
                                data: interviewData.questionPerformance.map((question) => ({
                                    question: question.topic,
                                    score: question.score ? question.score : 0, id: question.id
                                })),
                            }
                        },
                    }
                },
            }
        });
        try {
            const data = await getServerSession(authOptions);
            const userId = data.user.userId;
            await prisma.dashboard.update({
                where: { userId: userId },
                data: {
                    Activity:{
                        create: {
                            content :{
                                interviewId: interviewDetails.id,
                                jobTitle: interviewDetails.JobDescription.jobTitle ,
                                overallScore: interviewData.overallScore,
                                date: new Date(),
                            },type : "INTERVIEW"
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error updating user activity:", error);
        }
        return Ok({
            message: "Interview details updated successfully",
            status: 200,
        })
    } catch (e) {
        console.error(e);
        return Err(
            "Error updating interview details" + (e instanceof Error ? `: ${e.message}` : "")
        )
    }
}

export async function createInterview(dashboardId: string, interviewData: JobDescription) : Promise<Result<{ status: boolean; message: string; data?:createInterviewPayload},string>> {
    try {
        const data = await getServerSession(authOptions);
        if (!data?.user?.userId) {
            return Err("Authentication failed: User not found.");
        }
        const userId = data.user.userId;
        const { success: isallow, error } = await isAllowed(userId);
        if (!isallow) {
            return Err( error || "User is not allowed to create interviews");
        }
        await checkLimit(userId);
        const id = uuidv4();
        const { success } = await startInterviewAndCreateSession(id);
        if (!success) {
            return Err("Failed to start interview and create session");
        }
        const response = await prisma.interview.create({
            data: {
                id,
                dashboardId,
                description: interviewData.jobDescription,
                difficulty: interviewData.difficulty as Level,
                experience: interviewData.experience.toString(),
                Jobtitle: interviewData.jobTitle,
                skills: interviewData.skills,
                status: "IN_PROGRESS",
                Analytics: {
                    create: {
                        overallScore: 0,
                        CommunicationScore: 0,
                        TechnicalScore: 0,
                        ProblemSolvingScore: 0, InterviewSummary: "",
                        RelevanceScore: 0,
                        VocabularyScore: 0,

                    }
                }
            }, select: {
                id: true,
                description: true, difficulty: true, experience: true, Jobtitle: true, skills: true
            }
        });

        return Ok({
            status: true,
            message: "Interview created successfully",
            data: response,
        });
    } catch (error) {
        if (error instanceof LimitExceededError) {
            return Err("User limit exceeded. Please try again later.");
        }
        console.error("Error creating interview:", error);
        return Err("An error occurred while creating the interview: " + (error instanceof Error ? error.message : "Unknown error"));
    }
}

export async function register(type: "SIGNIN" | "SIGNUP", email: string, password: string, name?: string) : Promise<Result<{ message: string; status: number; data: RegisterPayload },string>> {
    try {
        if (!email || !password || (type == "SIGNUP" && !name)) {
            return Err ("Email, password and name are required for registration");
        };
        const user = await prisma.user.findUnique({ where: { email }, include: { dashboards: { select: { id: true } } } });
        if (user) {
            if (user.password == null) {
                const bypass = bcrypt.hashSync(password, 10);
                const response = await prisma.user.update({ where: { email }, data: { password: bypass }, select: { email: true, id: true, image: true, name: true, dashboards: { select: { id: true } } } });
                return Ok({
                    message: "Password updated successfully",
                    status: 200,
                    data: response
                })
            } else {
                const isValid = bcrypt.compareSync(password, user.password);
                if (isValid) {
                    const data: {
                        name: string | null;
                        id: string;
                        email: string;
                        image: string | null;
                        dashboards: {
                            id: string;
                        } | null;
                    } = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        dashboards: {
                            id: user.dashboards?.id as string
                        }
                    }
                    return Ok({
                        message: "User signed in successfully",
                        status: 200,
                        data
                    })
                }
            }
        }
        const response = await prisma.user.create({
                data: { email, name, password: bcrypt.hashSync(password, 10), dashboards: { create: {
                    Activity :{
                        create: {
                            content: {
                                date: new Date()
                            },
                            type: "DASHBOARD_CREATED"
                        }
                    }
                } } },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    dashboards: {
                        select: { id: true } }
                }
            });
            return Ok({
                message: "User created successfully",
                status: 201,
                data: response
            })

    } catch (error) {
        return Err(error instanceof Error ? error.message : "An unexpected error occurred");
    }
}

export async function updateProfile(payload: UpdateProfilePayload) : Promise<Result<{ success: boolean; message?: string},string>> {
    const data = await getServerSession(authOptions);
    if (!data?.user?.userId) {
        return Err("Authentication failed: User not found.");
    }
    const userId = data.user.userId;
    try {
        const dashboard = await prisma.dashboard.findUnique({
            where: { userId: userId },
            include: { Profile: true },
        });

        if (!dashboard) {
            return Err("Dashboard not found for the user.");
        }
        let flag=true;
        let profileId = dashboard.Profile?.id;
        if (!dashboard.Profile || !profileId) {
            const response = await prisma.dashboard.update({
                where: { userId: userId },
                data: {
                    Profile: {
                        create: {}
                    },Activity:{
                        create: {
                            content: {
                                date: new Date()
                            },
                            type: "PROFILE_UPDATED"
                        }
                    }
                }
            });
            profileId = response.id;
            flag=false;
        }
        
        if(flag){
            const getActivity = await prisma.recentActivity.findFirst({
                where: {
                    dashboardId: dashboard.id,
                    type: "PROFILE_UPDATED",
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)), 
                    },
                },
            });
            
            if (getActivity==null) {
                await prisma.recentActivity.create({
                    data: {
                        dashboardId: dashboard.id,
                        type: "PROFILE_UPDATED",
                        content: {
                            date: new Date(),
                        },
                    },
                });
            } 
        }

        await prisma.$transaction(async (tx) => {
            if (payload.tagline || payload.about || payload.skills) {
                await tx.profile.update({
                    where: { id: profileId },
                    data: {
                        tagline: payload.tagline,
                        about: payload.about,
                        Skills: payload.skills as string[],
                    },
                });
            }
            if (payload.projectsToAdd && payload.projectsToAdd.length > 0) {
                await tx.project.createMany({
                    data: payload.projectsToAdd.map(proj => ({
                        ...proj,
                        profileId: profileId,
                    })),
                });
            }

            if (payload.projectIdsToRemove && payload.projectIdsToRemove.length > 0) {
                await tx.project.deleteMany({
                    where: {
                        id: { in: payload.projectIdsToRemove },
                        profileId: profileId,
                    },
                });
            }

            if (payload.workExperienceToAdd && payload.workExperienceToAdd.length > 0) {
                await tx.workInfo.createMany({
                    data: payload.workExperienceToAdd.map(exp => ({
                        ...exp,
                        profileId: profileId,
                    })),
                });
            }

            if (payload.workExperienceIdsToRemove && payload.workExperienceIdsToRemove.length > 0) {
                await tx.workInfo.deleteMany({
                    where: {
                        id: { in: payload.workExperienceIdsToRemove },
                        profileId: profileId,
                    },
                });
            }
        });

        return Ok({ success: true, message: "Profile updated successfully!" });

    } catch (error) {
        console.error("Failed to update profile:", error);
        return Err("Error updating profile: " + (error instanceof Error ? error.message : "Unknown error"));
    }
}




async function startInterviewAndCreateSession(interviewId: string) {
    const data = await getServerSession(authOptions);
    if (!data?.user?.userId) {
        return { success: false, error: "Authentication failed: User not found." };
    }
    const userId = data.user.userId;
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {

        const sessionToken = uuidv4().toString();

        const sessionData = {
            userId: userId,
            interviewId: interviewId,
        };

        await redis.set(
            `tts-session:${sessionToken}`,
            JSON.stringify(sessionData),
            { ex: 23 * 60 }
        );
        cookies().set('tts-session-token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 23 * 60,
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to start interview session:", error);
        return { success: false };
    }
}
async function checkLimit(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                limit: true,
                id: true,
            }
        });
        if (!user) {
            throw new Error("User not found in database");
        }
        if (user.limit && user.limit <= 0) {
            throw new LimitExceededError();
        }
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                limit: {
                    decrement: 1,
                },
            },
        });
        console.log("User limit decremented successfully");
    } catch (error) {
        console.error("Error checking user limit:", error);
        if (error instanceof LimitExceededError) {
            throw error;
        } else {
            throw new Error("Error checking user limit: " + error);
        }
    }
}
async function isAllowed(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isAllowed: true }
        })
        if (!user) {
            return { success: false, error: "User not found" };
        }
        if (user.isAllowed) {
            return { success: true };
        } else {
            return { success: false, error: "Taking interview is not available for all the users. You will be notified when it will be available." };
        }
    } catch (error) {
        console.error("Error checking user allowance:", error);
        return { success: false, error: "Error checking user allowance" };

    }
}