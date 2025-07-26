"use server"
import { getServerSession } from "next-auth";
import { Level, QuestionType, Sender } from "../generated/prisma";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth";
import { uuidv4 } from "../utils";
import { redis } from "../redis";
import { cookies } from "next/headers";
export async function getProfile(userId:string) {
    try {
        const resp=await prisma.dashboard.findFirst({
            where:{
                userId 
            },select:{
                Profile :{
                    select:{
                        id :true,
                        Projects :{
                            select:{
                                id :true,
                                name :true,
                                description :true,
                            }
                        },
                        Skills :true,
                        WorkExperience :{
                            select :{
                                company :true,
                                endYear :true,
                                id :true,
                                role :true,
                                startYear :true,
                            }
                        },
                        tagline :true,
                        about :true,
                    }
                },Interview :{
                    where:{
                        status : "COMPLETED"
                    },
                    select :{
                     id :true,
                     Analytics :{
                        select:{
                            id :true,
                            overallScore :true,
                        }
                     },
                     startTime : true,
                     endTime : true,Jobtitle : true
                    }
                }
            }
        })
        return {
            message : "Profile Retrieved Successfully",
            data : resp
        }
    } catch (error) {
        return {
            message : "Error Occured ",
            data : null
        }
    }
}


export async function getInterviewDetails(interviewId:string)  {
    if (!interviewId) {
        return {
            message: " Analytics ID is required",
            status: 400,
        }
    }
    const interview = await prisma.analytics.findUnique({ where: { interviewId },
    select :{
        CommunicationScore : true,
        ProblemSolvingScore : true,
        HRInsight : true,
        GrowthAreas : true,
        InterviewSummary : true,
        KeyStrengths : true,
        overallScore : true,
        VocabularyScore : true,
        TechnicalKeywords : true,
        TechnicalScore : true,
        RelevanceScore : true,questions : {
            select:{
                id : true,
                question : true,
                score : true,
            }
        },Interview:{
            select:{
                startTime : true,
                endTime : true,Jobtitle :true
            }
        }
    }
    });
    return {
         message: "Interview details fetched successfully",
         status: 200,
         data: interview
    };
    
}
export async function setInterviewDetails(interviewData:InterviewData,interviewDetails:interviewDetails,endTime:Date) {
    try{
    await prisma.interview.update({
        where: { id: interviewDetails.id},
        data:{
            endTime,
            status : "COMPLETED",
            Messages : {
                createMany :{
                    data : interviewDetails.InterviewChatHistory.map((message) => ({
                      content :message.Content,
                      type : message.ContentType as QuestionType,
                        Sender : message.Sender,id:message.id
                    }))
                }
            },
            Analytics:{
                update:{
              CommunicationScore : interviewData.InterviewScores.communication,
        ProblemSolvingScore : interviewData.InterviewScores.problemSolving,
        HRInsight : {
            create :{
                CulturalFit : interviewData.hrInsights.culturalFit,
                ExperienceLevel : interviewData.hrInsights.experienceLevel,
                InterviewReadlineScore : interviewData.hrInsights.interviewReadiness,
                LearningPotential : interviewData.hrInsights.learningPotential,
                TechnicalCompetency : interviewData.hrInsights.technicalCompetency,
            }
        },
        GrowthAreas : interviewData.areasForImprovement,
        InterviewSummary : interviewData.aiNotes,
        KeyStrengths : interviewData.strengths,
        overallScore : interviewData.overallScore,
        VocabularyScore : interviewData.InterviewScores.vocabulary,
        TechnicalKeywords : interviewData.technicalKeywords,
        TechnicalScore : interviewData.InterviewScores.technicalKnowledge,
        RelevanceScore : interviewData.InterviewScores.relevance,
        questions :{
            createMany :{
                data : interviewData.questionPerformance.map((question) => ({
                    question : question.topic,
                    score : question.score ? question.score : 0,
                    })),
            }
        },
                }
            },
        }
    })
    return {
        message: "Interview details updated successfully",
        status: 200,
    }
}catch (e){
         console.error (e);
    }
}
export async function createInterview(dashboardId : string, interviewData: JobDescription) {
    try {
        const id = uuidv4();
        const {success}=await startInterviewAndCreateSession(id);
       if (!success){
        return {
            status : false,
            message: "Failed to start interview and create session",
            data: null,
        }}
        const response = await prisma.interview.create({
           data:{
            id ,
               dashboardId,
               description: interviewData.jobDescription,
               difficulty: interviewData.difficulty as Level,
               experience: interviewData.experience.toString(),
               Jobtitle: interviewData.jobTitle,
               skills: interviewData.skills,
               status: "IN_PROGRESS" ,
               Analytics:{
                create :{
                                    overallScore: 0,
                                    CommunicationScore: 0,
                                    TechnicalScore: 0,
                                    ProblemSolvingScore: 0,InterviewSummary : "",
                                    RelevanceScore : 0,
                                    VocabularyScore : 0 ,
                                   
                }
               }
           },select:{
            id :true,
            description : true,difficulty : true,experience : true,Jobtitle : true,skills : true
           }
        });
 
        return {
            status: true,
            message : "Interview created successfully",
            data : response,
        };
    } catch (error) {
        return {
            status: false,
            message: "Failed to create interview",
            data: null,
        }
    }
}
export async function register(type : "SIGNIN"|"SIGNUP",email : string, password: string,name?:string) {
    try {
        
        if (!email || !password || (type=="SIGNUP" && !name)) {
            return {
                message: "All Credentials are required",
                status: 400
            }
        };
        const user = await prisma.user.findUnique({ where: { email },include : { dashboards :{ select : { id : true } } } });
        if (user){
            if (user.password==null){
                const bypass= bcrypt.hashSync(password, 10);
                const response= await prisma.user.update({ where: { email }, data: { password: bypass } ,select :{email:true,id :true,image:true,name:true,dashboards :{select:{id : true}}}});
                return {
                    message: "Password updated successfully",
                    status: 200,
                    data : response
                    }
            }else{
                const isValid = bcrypt.compareSync(password, user.password);
                if (isValid) {
                    const data:{
                         name: string | null;
                        id: string;
                        email: string;
                        image: string | null;
                        dashboards: {
                            id: string;
                        } | null;
                    }= {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        dashboards :{
                            id: user.dashboards?.id as string
                        }
                    }
                    return {
                        message: "User signed in successfully",
                        status: 200,
                        data
                }
                }
        }
    }else{
        const response = await prisma.user.create({ data: { email, name, password: bcrypt.hashSync(password, 10),dashboards:{create :{}} },
        select:{
            id : true ,
            email : true ,
            name : true ,
            image : true ,
            dashboards : {select : {id : true}}
        }
    });
    return {
        message: "User created successfully",
        status: 201,
        data : response
        }
    }
}catch (error) {
        
    }
}

type ProjectData = {
    name: string;
    description: string;
};

type WorkInfoData = {
    company: string;
    role: string;
    startYear: number;
    endYear?: number | null;
};

type UpdateProfilePayload = {
    tagline?: string;
    about?: string;
    skills?: string[];
    projectsToAdd?: ProjectData[];
    projectIdsToRemove?: string[];
    workExperienceToAdd?: WorkInfoData[];
    workExperienceIdsToRemove?: string[];
};


export async function updateProfile(payload: UpdateProfilePayload) {
    // 1. Authentication & Authorization
    // Get the authenticated user's ID from your auth provider (e.g., Clerk, NextAuth)
    const data = await getServerSession(authOptions);
    if (!data?.user?.userId) {
        return { success: false, error: "Authentication failed: User not found." };
    }
    const userId = data.user.userId;

    try {
        // 2. Find the user's dashboard and profile
        // We need the profileId to link new projects and work experience
        const dashboard = await prisma.dashboard.findUnique({
            where: { userId: userId },
            include: { Profile: true },
        });

        if (!dashboard || !dashboard.Profile) {
            return { success: false, error: "Profile not found for the current user." };
        }
        const profileId = dashboard.Profile.id;

        // 3. Perform all database operations within a transaction
        await prisma.$transaction(async (tx) => {
            // A. Update simple fields on the Profile model
            await tx.profile.update({
                where: { id: profileId },
                data: {
                    tagline: payload.tagline,
                    about: payload.about,
                    Skills: payload.skills, // Prisma handles the string array update
                },
            });

            // B. Handle Projects to Add
            if (payload.projectsToAdd && payload.projectsToAdd.length > 0) {
                await tx.project.createMany({
                    data: payload.projectsToAdd.map(proj => ({
                        ...proj,
                        profileId: profileId, // Link to the user's profile
                    })),
                });
            }

            // C. Handle Projects to Remove
            if (payload.projectIdsToRemove && payload.projectIdsToRemove.length > 0) {
                await tx.project.deleteMany({
                    where: {
                        id: { in: payload.projectIdsToRemove },
                        profileId: profileId, // Security: ensure user can only delete their own projects
                    },
                });
            }

            // D. Handle Work Experience to Add
            if (payload.workExperienceToAdd && payload.workExperienceToAdd.length > 0) {
                await tx.workInfo.createMany({
                    data: payload.workExperienceToAdd.map(exp => ({
                        ...exp,
                        profileId: profileId, // Link to the user's profile
                    })),
                });
            }

            // E. Handle Work Experience to Remove
            if (payload.workExperienceIdsToRemove && payload.workExperienceIdsToRemove.length > 0) {
                await tx.workInfo.deleteMany({
                    where: {
                        id: { in: payload.workExperienceIdsToRemove },
                        profileId: profileId, // Security: ensure user can only delete their own experience
                    },
                });
            }
        });

        // 4. Revalidate the path to show updated data immediately
        // This clears the server-side cache for the profile page.

        return { success: true, message: "Profile updated successfully!" };

    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "An unexpected error occurred while updating the profile." };
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

        // 2. Generate a secure, random token
        const sessionToken = uuidv4().toString();

        // 3. Prepare the session data to store
        const sessionData = {
            userId: userId,
            interviewId: interviewId,
        };

        // 4. Store the session in Redis with a 25-minute expiry (1500 seconds)
        await redis.set(
            `tts-session:${sessionToken}`, // Prefix for clarity
            JSON.stringify(sessionData),
            { ex: 23 * 60 } // ex = expire in seconds
        );
         cookies().set('tts-session-token', sessionToken, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            path: '/', // Available for all paths
            maxAge: 23 * 60, // Cookie expiry in seconds, matching Redis TTL
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to start interview session:", error);
        return { success: false};
    }
}