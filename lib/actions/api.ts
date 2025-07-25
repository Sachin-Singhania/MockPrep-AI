"use server"
import { Level, QuestionType } from "../generated/prisma";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
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
export async function addMessage(interviewId : string, content:InterviewChat ) {
    try {
        if (!interviewId) {
            return {
                message: "Analytics ID is required",
                status: 400,
                data : null
                }
            }
            const data={
                   content : content.Content ,
                    Sender : content.Sender,
                    type : content.ContentType,
                    interviewId : interviewId ,
            }
                   const {message:response}=await prisma.$transaction(async (tx) => {
                           const message= await tx.message.create({
                                data,omit:{
                                    createdAt : true ,
                                    updatedAt : true ,
                                    interviewId : true ,
                                }
                            });
                    if (content.ContentType === "QUESTION") {
                               await tx.analytics.upsert({
                                where: { interviewId },
                                create: {
                                    interviewId,
                                    overallScore: 0,
                                    CommunicationScore: 0,
                                    TechnicalScore: 0,
                                    ProblemSolvingScore: 0,InterviewSummary : "",
                                    RelevanceScore : 0,
                                    VocabularyScore : 0 ,
                                    questions: {
                                    create: {
                                        question: content.Content ,
                                        score: 0,
                                    },
                                    },
                                },
                                update: {
                                    questions: {
                                    create: {
                                        question: content.Content,
                                        score: 0,
                                    },
                                    },
                                },
                                });
                            }

                            if (content.ContentType === "VALIDATION") {
                              await tx.analytics.update({
                                where: { interviewId },
                                data: {
                                    questions: {
                                    update: {
                                        where: { id: content.questionId },
                                        data: { score: content.score },
                                    },
                                    },
                                },
                                });
                            }
                            return {
                                message
                            }
                            });

            return{
                message: "Message added successfully",
                status: 200,
                data: {
                    id : response.id ,
                    Content : response.content as InterviewChat["ContentType"],
                    Sender : response.Sender  ,
                    ContentType : response.type,
                }
            }
    } catch (error) {
         return {
            message: "Error adding message",
            status: 500,
            data : null
         }
    }
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
                        Sender : message.Sender
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
            }
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
        const response = await prisma.interview.create({
           data:{
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
            message : "Interview created successfully",
            data : response
        };
    } catch (error) {
         console.error(error);
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

