import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";
import { parsePdfIfMaxTwoPages } from "../utils";

const ai = new GoogleGenAI(process.env.APIKEY as string);


interface UserDetails {
    userTagline: string;
    userSkills: string[];
    userExperience: number;
}
interface JobDescription {
    jobTitle: string;
    jobDescription: string;
    skills: string[];
    experience: number;
}
type Project ={
    projectName: string;
    projectDescription: string;
}
interface Resume {
    Skills : string[];
    WorkExperience : number,
    Projects : Project
}
interface interviewDetails{
    JobDescription:JobDescription,
    InterviewChatHistory : InterviewChat[]
    name : string,
    timeLeft : number
}
type InterviewChat={
    Sender : "USER" | "ASSISTANT",
    Content : string ,
    ContentType: "ANSWER"|"FORMALCHAT" | "QUESTION" | "VALIDATION" | "END"
}
async function fillsJob(UserDetails: UserDetails): Promise<JobDescription> {
    try {
        const query= ` Create a Job Description based on user details.
        User Details:
        User Tagline : ${UserDetails.userTagline},
        User Skills : ${UserDetails.userSkills.join(",")},
        User Experience : ${UserDetails.userExperience} years.,
    
    
        Output :- 
        {"output": "{jobTitle: string, jobDescription: string, skills: string[], experience: number}"}
        
        Example :-
           User:-User Tagline : "Full Stack Developer",
            User Skills : "JavaScript, React, Node.js",
            User Experience : 5 years,
           You:- Output : {"jobTitle": "Full Stack Developer", "jobDescription": " We are seeking a talented and detail-oriented Web Developer to join our team. The ideal candidate will be responsible for designing, coding, and modifying websites and web applications, from layout to function, according to client specifications. You will work closely with designers, developers, and project managers to build responsive and user-friendly digital products.", "skills": ["JavaScript", "React", "Node.js"], "experience": 3}
    
    
        `;
         const model = ai.getGenerativeModel({
                model: "gemini-2.0-flash",
                generationConfig: {
                    temperature: 1.5,
                    responseMimeType: "application/json",
                },
            });
            const { response } = await model.generateContent({
                contents: [
                    { role: "user", parts: [{ text: query }] }
                ]
            });
            const output= response.text().trim();
            const data:JobDescription = JSON.parse(output);
       
        return data
    } catch (error) {
        throw new Error("Something Went Wrong");
    }
}

async function ResumeExtracter(pdfInput: Buffer | string): Promise<Resume> {
    try {
        const pdfData= await parsePdfIfMaxTwoPages(pdfInput);
          const systemInstruction= ` You are a smart AI Resume Extractor which takes pdf text as an input and returns the following details:-
           Skills , Work Experience , Projects 
           Output Format:-
           {"Skills": string[], "WorkExperience": number, "Projects": [{ projectName: string, projectDescription: string}]}
        `;
          const model = ai.getGenerativeModel({
                model: "gemini-2.0-flash",
                generationConfig: {
                    temperature: 1.5,
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
            const output= response.text().trim();
            const data:Resume = JSON.parse(output);
            return data;
    } catch (error) {
         throw new Error(`Error in Resume Extracter:`);
    }
    
}



async function InterviewTaking(interviewDetails : interviewDetails){
        const systemInstruction=`You are an AI Interview Taker. You take job interviews of users based on job description , title , skills and experience.
        You will also be provided with chats history of the interview if provided , if not then you will start from scratch.
        
        RULES : - 
        1. IF timer is below 00:20 then you will give Closure like Thank you for your time. It was nice talking to you. not this exactly but something like that.
        2. If user Mishbehaves talks in bad language then give a formal response something like I am ending this interview as it is not going well and send response with type END
        3. Follow the output format rule especially with the type 

        INSTRUCTIONS:-
        0. There is 25 min timer so you will be provided what time is left , So don't waste asking too many casual question.
        1. When interviewing the user. If chats are empty then greet the user formally and tell him to introduce.
        2. There are three types of output FORMALCHAT means like asking hobbies , interest , past company experience , work etc.
            - QUESTION :- this type means you will ask user questions based on job description and skills only.
            - VALIDATION :- this type means you will validate user answers if user provide an answer to your response type QUESTION

        Output Format :- 
            {type:"FORMALCHAT | QUESTION | VALIDATION | END"  , content : string}

        Example 
            name : John Doe
            Job Title: Software Engineer
            Job Description: Develop software applications using Java and Python.
            Skills: Java, Python, Spring Boot, Docker, Kubernetes, AWS, Azure, Google Cloud
            Experience: 5 years of 
            Interview Chat History: []
            timeLeft : 24:08
         You : {type:"FORMALCHAT",content :"Good Evening , Mr Doe . Thank you for joining me today . Tell me a little about yourself and why you want to work with us? ."}
        `;
        const model = ai.getGenerativeModel({
                model: "gemini-2.0-flash",
                generationConfig: {
                    temperature: 1.5,
                    responseMimeType: "application/json",
                },
                 systemInstruction: {
                    role: "system",
                    parts: [{ text: systemInstruction }]
                },
            });
            const { response } = await model.generateContent({
                contents: [
                    { role: "user", parts: [{ text: JSON.stringify(interviewDetails) }] }
                ]
            });
                 const output= response.text().trim();
            const data:InterviewChat = JSON.parse(output);
            return data;
}