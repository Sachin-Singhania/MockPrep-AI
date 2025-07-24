"use server"
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";
import pdf from "pdf-parse";
import { getStatus } from "../utils";
import { Buffer } from 'buffer';
import { setInterviewDetails } from "./api";

const ai = new GoogleGenAI(process.env.APIKEY as string);

export async function fillsJob(UserDetails: UserDetails): Promise<JobDescription| string> {
    try {
        const query = ` Create a Job Description based on user details.
        User Details:
        User Tagline : ${UserDetails.userTagline},
        User Skills : ${UserDetails.userSkills.join(",")},
        User Experience : ${UserDetails.userExperience} years.,
    
        INSTRUCTION:-
        - If u feel user tagline is random, non-sensical, or meaningless tagline then tell user that its invalid 
        - Requeried Skill will be for the job description you will make not user skills 
        OUTPUT FORMAT :- 
        {"output": "{jobTitle: string, jobDescription: string, skills: string, experience: number}"}
        {"output": "Your tagline seems invalid i can't generate a job description for you."}
        
        Example :-
           User:-User Tagline : "Reactjs",
            User Skills : "JavaScript, React, Node.js",
            User Experience : 2,
        You : - {"output": {
                "jobTitle": "React Developer",
                "jobDescription": "We are seeking a skilled and passionate React Developer to join our dynamic team. As a React Developer, you will be responsible for developing and implementing user interface components using React concepts and workflows. You will also be responsible for integrating these components with backend services built with Node.js and Next.js. The ideal candidate has a strong understanding of JavaScript, HTML, and CSS, and is proficient in building responsive and accessible web applications. You will be working on projects that require attention to detail and a commitment to writing clean, maintainable code.",
                "skills":"react","nodejs","nextjs"
                ],
                "experience": 2}}
           `;
        const model = ai.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.6,
                responseMimeType: "application/json",
            },
        });
        const { response } = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: query }] }
            ]
        });
        const output = response.text().trim();
            
        const data = JSON.parse(output);
        const res:JobDescription | string= data.output;
        return res
    } catch (error) {
        console.log(error)
        throw new Error("Something Went Wrong");
    }
}

export async function ResumeExtracter(pdfInput: string): Promise<Resume | string> {
    try {
        const pdfData = await parsePdfIfMaxTwoPages(pdfInput);
        const systemInstruction = ` You are a smart AI Resume Extractor which takes pdf text as an input and returns the following details:-
           Skills , Work Experience , Projects 
           Instructions:-
            - If data inside the pdf is not a resume then just return the string "Invalid PDF"
           Output Format:-
           {"output":{"Skills": string[], "WorkExperience": {role: string,company: string,startYear : number,endYear?: number}, "Projects": [{ name: string, description: string}]}}
            {"output":string}
           `;
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.0,
                responseMimeType: "application/json",
            },
            systemInstruction: {
                role: "system",
                parts: [{ text: systemInstruction }]
            },
        });
        const { response } = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: pdfData }] }
            ]
        });
        const output = response.text().trim();
        const data= JSON.parse(output);
        const result : Resume | string = data.output;
        return result;
    } catch (error) {
        console.log(error)
        throw new Error(`Error in Resume Extracter:`);
    }

}

export async function InterviewTaking(interviewDetails: interviewDetails,timeLeft:string) {
    try {
        console.log(timeLeft);
        const lastThreeMessages = interviewDetails.InterviewChatHistory.slice(-3);
        let message= {
            InterviewChatHistory : lastThreeMessages,
            JobDescription : interviewDetails.JobDescription,timeLeft
        }
    const systemInstruction = `You are an AI Interview Taker. You take job interviews of users based on job description , title , skills and experience.
        You will also be provided with chats history of the interview if provided , if not then you will start from scratch.
        
        RULES : - 
        1. IF timer is below 00:20 then you will give Closure like Thank you for your time. It was nice talking to you. not this exactly but something like that.
        2. If user Mishbehaves or talks in abusive language then give a formal response something like I am ending this interview as it is not going well and send response with type END
        3. Follow the output format rule especially with the type 
        4. ONLY TALK IN ENGLISH even if user sends response in hindi or any language understand and translate in english and tell user to speak in english only
    
        INSTRUCTIONS:-
        0. There is 25 min timer so you will be provided what time is left , So don't waste asking too many formal question but start with the greeting.
        1. When interviewing the user. If chats are empty then greet the user formally and tell him to introduce.
        2. There are three types of output FORMALCHAT means like greeting, asking hobbies , interest , past company experience , projects , user asking about company goal etc.
            - QUESTION :- this type means you will ask user questions based on job description and skills only
            - VALIDATION :- this type means you will validate user answers if user provide an answer to your response type QUESTION
            - END :- If User uses bad language or time is below 20 seconds then send this type of ContentType
        3 . Once You ask a QUESTION user will send a ANSWER then you will send a VALIDATION (QUESTION(by you)-> ANSWER(by user) ->VALIDATION(by you with score))

        Output Format :- 
            {ContentType:"FORMALCHAT | QUESTION | VALIDATION | END"  , Content : string , score?: number}
            score will be only in type VALIDATION , give score out of 100

        Example 
            name : John Doe
            Job Title: Software Engineer
            Job Description: Develop software applications using Java and Python.
            Skills: Java, Python, Spring Boot, Docker, Kubernetes, AWS, Azure, Google Cloud
            Experience: 5 years of 
            Interview Chat History: []
            timeLeft : 24:08
         You : {ContentType:"FORMALCHAT",Content :"Good Evening , Mr Doe . Thank you for joining me today . Tell me a little about yourself and why you want to work with us? ."}

         `;
    const model = ai.getGenerativeModel({
       model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
        systemInstruction: {
            role: "system",
            parts: [{ text: systemInstruction }]
        },
    });
    const { response } = await model.generateContent({
        contents: [
            { role: "user", parts: [{ text: JSON.stringify(message) }] }
        ]
    });
    const output = response.text().trim();
    const parse = JSON.parse(output);
    let data:InterviewChat ={
        ...parse,
        Sender :"ASSISTANT"
    }
    console.log(data);
    return data;
    } catch (error) {
         console.log(error);
    }
}


export async function analytics(interviewDetails: interviewDetails) {
    try {
        let start= interviewDetails.startTime;
        let end= new Date();
        let duration = (end.getTime() - start.getTime()) / 1000;
    const questions = interviewDetails.InterviewChatHistory.filter((val) => val.ContentType == "QUESTION");
    const validate = interviewDetails.InterviewChatHistory.reduce<number[]>((acc, val) => {
        if (val.ContentType == "VALIDATION" && typeof val.score == "number") {
            acc.push(val.score);
        }
        return acc;
    }, [])
    const answer = interviewDetails.InterviewChatHistory.filter((val) => val.ContentType == "ANSWER");

    let questionPerformance: questionPerformance[] = [];
    for (let index = 0; index < questions.length; index++) {
        const ques = questions[index];
        const score = validate[index];
        let final = {
            question: `Q${index + 1}`,
            score,
            status: getStatus(score).status,
            topic: ques.Content
        }
        questionPerformance.push(final);
    }

    const technicalKeywords = await getTechnicalKeywords(answer);
    const InterviewScores = Object.values(technicalKeywords.InterviewScores);
    const overallScore = InterviewScores.reduce((a, b) => a + b, 0) / InterviewScores.length;

    const interviewData: InterviewData = {
        date : interviewDetails.startTime,
        candidateName: interviewDetails.name,
        position: interviewDetails.JobDescription.jobTitle,
        duration: duration+ " seconds",
        overallScore,
        questionPerformance,
        ...technicalKeywords,
    };
    await setInterviewDetails(interviewData,interviewDetails,end)
    return interviewData;} catch (error) {
         console.error(error);
    }
}
async function getTechnicalKeywords(answer: InterviewChat[]) : Promise<InterviewInsights>{

    const systemInstruction = `You are an AI Interview Evaluator. Your job is to analyze a candidate's answers from an AI-powered mock interview and return structured JSON data as per the format described below.

            INSTRUCTIONS:
                - Score the following categories from 0 to 100:
                - communication: clarity, fluency, and confidence in speaking.
                - technicalKnowledge: accuracy and depth of technical responses.
                - problemSolving: ability to logically break down problems and approach solutions.
                - vocabulary: use of relevant terminology and precise language.
                - relevance: how relevant and on-topic the answers are to the questions asked.
                - Extract technical keywords or tools mentioned (e.g., React, Redux, TypeScript).
                - Identify strengths — unique or notable qualities the candidate showed.
                - Highlight areas for improvement — things the candidate should work on.
                - Summarize HR insights:
                - Technical competency (e.g., junior/mid/senior and why)
                - Estimated experience level (in years)
                - Cultural fit (collaborative, adaptable, etc.)
                - Learning potential (eagerness and ability to improve)
                - Interview readiness (a number from 0 to 100)
                -  Write a short summary of aiNotes how user peformed.

            RULES:
               - Respond only with valid JSON matching the exact structure below.
               - Do not include any explanation, preamble, or formatting outside the JSON.
               - Scores must be numeric (0 to 100).
               - All fields are required and must not be null or undefined.
               
            OUTPUT FORMAT:- 
                {"InterviewScores": {"communication": number,"technicalKnowledge": number,"problemSolving": number,"vocabulary": number,"relevance": number},"technicalKeywords": string[],"strengths": string[],"areasForImprovement": string[],"hrInsights": {"technicalCompetency":string,"experienceLevel":string,"culturalFit":string,"learningPotential":string,"interviewReadiness": number},"aiNotes":string}              
               
               `

            const model = ai.getGenerativeModel({
            model: "gemini-2.5-pro",
            generationConfig: {
                temperature: 0.8,
                responseMimeType: "application/json",
            },
            systemInstruction: {
                role: "system",
                parts: [{ text: systemInstruction }]
            },
        });
        const { response } = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: JSON.stringify(answer) }] }
            ]
        });
          const output = response.text().trim();
          console.log(output);
    const data: InterviewInsights = JSON.parse(output);

    return data;
        
}
async function parsePdfIfMaxTwoPages(base64:string) {
   const base64Data = base64.split(";base64,").pop();

  if (!base64Data) {
    throw new Error("Invalid base64 data");
  }
      const buffer = Buffer.from(base64Data, "base64");
    
      const data = await pdf(buffer);
    console.log(data.numpages)
      if (data.numpages >= 3) {
        throw new Error("PDF must have less than 3 pages.");
      }
    
      console.log("PDF is valid. Continue processing...");
          return data.text.trim();
  
}

