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
                id :true,
                createdAt :true,
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
                    select :{
                     id :true,
                     Analytics :{
                        select:{
                            id :true,
                            overallScore :true,
                        }
                     },
                     startTime : true,
                     endTime : true,
                     _count : true   
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
async function setProfile(userId: string, data: {
  about?: string;
  tagline?: string;
  skills?: string[];
  projects?: { id?: string; name: string; description: string }[];
  workExperience?: {
    id?: string;
    company: string;
    role: string;
    startYear: number;
    endYear?: number;
  }[];
},updateType?:"PROFILE" | "WORK" | "PROJECTS" | "SKILLS") {
    try {
        
        const dashboard = await prisma.dashboard.findUnique({
          where: { userId },
          select: { id: true, Profile: { select: { id: true } } }
        });
      
        if (!dashboard) throw new Error("Dashboard not found");
      
        const profileId = dashboard.Profile?.id;
      
        // If profile does not exist, create a new one
        if (!profileId) {
          await prisma.profile.create({
            data: {
              dashboardId: dashboard.id,
              about: data.about ?? '',
              tagline: data.tagline ?? '',
              Skills: data.skills ?? [],
              Projects: data.projects
                ? { create: data.projects.map(p => ({
                    name: p.name,
                    description: p.description,
                  })) }
                : undefined,
              WorkExperience: data.workExperience
                ? {
                    create: data.workExperience.map(w => ({
                      company: w.company,
                      role: w.role,
                      startYear: w.startYear,
                      endYear: w.endYear,
                    }))
                  }
                : undefined
            }
          });
          return;
        }
        const dashboardId=dashboard.id;
        switch (updateType) {
        case "PROFILE":
          await prisma.profile.update({
            where: { dashboardId },
            data: {
              about: data.about ?? '',
              tagline: data.tagline ?? '',
            }
          });
          break;
      
        case "SKILLS":
          await prisma.profile.update({
            where: { dashboardId },
            data: {
              Skills: data.skills ?? [],
            }
          });
          break;
      
        case "WORK":
      if (data.workExperience) {
        await Promise.all(
          data.workExperience.map(w =>
              prisma.workInfo.upsert({
                  where: { id: w.id ?? "non-existent-id" }, // 'id' required for update
                  update: {
                  company: w.company,
                  role: w.role,
                  startYear: w.startYear,
                  endYear: w.endYear,
                  },
                  create: {
                  profileId,
                  company: w.company,
                  role: w.role,
                  startYear: w.startYear,
                  endYear: w.endYear,
                  },
              })
              )
          );
          }
          break;
      
      case "PROJECTS":
        if (data.projects) {
          await Promise.all(
            data.projects.map(p =>
              prisma.project.upsert({
                where: { id: p.id ?? "___" }, 
                update: {
                  name: p.name,
                  description: p.description
                },
                create: {
                  profileId,            
                  name: p.name,
                  description: p.description
                }
              })
            )
          );
        }
        break;
      }
    } catch (error) {
        
    }
}

async function getInterviewDetails(analyticsId:string) {
    if (!analyticsId) {
        return {
            message: " Analytics ID is required",
            status: 400
        }
    }
    const interview = await prisma.analytics.findUnique({ where: { id: analyticsId },
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
        RelevanceScore : true,questions : true,Interview:{
            select:{
                startTime : true,
                endTime : true,
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
                        Sender : message.Sender
                    }))
                }
            },
            Analytics:{
                create:{
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
                    question : question.question,
                    score : question.score,
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
               status: "IN_PROGRESS" 
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
                    const data= {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        dashboards : user.dashboards?.id
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
}