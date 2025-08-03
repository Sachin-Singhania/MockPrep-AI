"use server"
import { getServerSession } from "next-auth";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth";
import { uuidv4 } from "../utils";
import { redis } from "../redis";
import { cookies } from "next/headers";
import { Level, QuestionType } from "@prisma/client";
class LimitExceededError extends Error {
  constructor(message: string = "User limit exceeded") {
    super(message);
    this.name = "LimitExceededError";
  }
}
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
        console.log(error);
        return {
            message : "Error Occured",
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
                    score : question.score ? question.score : 0,id :question.id
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
         return {
            message: "Error updating interview details",
            status: 500,
         }
    }
}
export async function createInterview(dashboardId : string, interviewData: JobDescription) {
    try {
    const data = await getServerSession(authOptions);
        if (!data?.user?.userId) {
            return { success: false, error: "Authentication failed: User not found." };
        }
        const userId = data.user.userId;
       await checkLimit(userId);
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
        if (error instanceof LimitExceededError){
            return {
                status: false,
                message: "Limit exceeded",
                data : null,
            }
        }
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
export async function updateProfile(payload: UpdateProfilePayload) {
    const data = await getServerSession(authOptions);
    if (!data?.user?.userId) {
        return { success: false, error: "Authentication failed: User not found." };
    }
    const userId = data.user.userId;
    try {
        const dashboard = await prisma.dashboard.findUnique({
            where: { userId: userId },
            include: { Profile: true },
        });

        if (!dashboard) {
            return { success: false, error: "Profile not found for the current user." };
        }
       
        let profileId=dashboard.Profile?.id;
        if (!dashboard.Profile || !profileId) {
            const response = await prisma.dashboard.update({
                where: { userId: userId },
                data:{
                    Profile:{
                        create :{}
                    }
                }
            });
            profileId = response.id;
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
        return { success: false};
    }
}
async function checkLimit(userId: string) {
  try {
    const user= await prisma.user.findUnique({
      where: { 
        id : userId
       },
      select:{
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
      where: {         id : userId
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