"use server"
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";
import pdf from "pdf-parse";
import { getStatus } from "../utils";

const ai = new GoogleGenAI(process.env.APIKEY as string);

export async function fillsJob(UserDetails: UserDetails): Promise<JobDescription> {
    try {
        const query = ` Create a Job Description based on user details.
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
        const output = response.text().trim();
        const data: JobDescription = JSON.parse(output);

        return data
    } catch (error) {
        throw new Error("Something Went Wrong");
    }
}

export async function ResumeExtracter(pdfInput: Buffer | string): Promise<Resume> {
    try {
        const pdfData = await parsePdfIfMaxTwoPages(pdfInput);
        const systemInstruction = ` You are a smart AI Resume Extractor which takes pdf text as an input and returns the following details:-
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
        const output = response.text().trim();
        const data: Resume = JSON.parse(output);
        return data;
    } catch (error) {
        throw new Error(`Error in Resume Extracter:`);
    }

}

export async function InterviewTaking(interviewDetails: interviewDetails) {
    const systemInstruction = `You are an AI Interview Taker. You take job interviews of users based on job description , title , skills and experience.
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
            {type:"FORMALCHAT | QUESTION | VALIDATION | END"  , content : string , score?: number}
            score will be only in type VALIDATION , give score out of 100

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
    const output = response.text().trim();
    const data: InterviewChat = JSON.parse(output);
    return data;
}



export async function analytics(interviewDetails: interviewDetails, job: JobDescription) {
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
        candidateName: interviewDetails.name,
        position: job.jobTitle,
        duration: "20 minutes",
        overallScore,
        questionPerformance,
        ...technicalKeywords,
    };
    return interviewData;
}
async function getTechnicalKeywords(answer: InterviewChat[]): Promise<InterviewInsights> {
    let ex: InterviewInsights = {
        InterviewScores: {
            communication: 85,
            technicalKnowledge: 72,
            problemSolving: 80,
            vocabulary: 75,
            relevance: 82,
        },
        technicalKeywords: [
            "React",
            "JavaScript",
            "TypeScript",
            "Redux",
            "Hooks",
            "Components",
            "State Management",
            "API Integration",
        ],
        strengths: [
            "Strong understanding of React fundamentals",
            "Good communication skills and clear explanations",
            "Demonstrates practical experience with modern tools",
            "Shows enthusiasm for learning new technologies",
        ],
        areasForImprovement: [
            "Deepen knowledge of advanced state management patterns",
            "Improve understanding of performance optimization techniques",
            "Practice explaining complex technical concepts more concisely",
            "Strengthen testing methodology knowledge",
        ],
        hrInsights: {
            technicalCompetency: "Mid-level. Shows solid foundation but needs growth in advanced concepts.",
            experienceLevel: "Approximately 3-4 years of relevant experience.",
            culturalFit: "Good fit. Demonstrates collaborative mindset and growth orientation.",
            learningPotential: "High. Shows curiosity and willingness to learn new technologies.",
            interviewReadiness: 75,
        },
        aiNotes:
            "The candidate demonstrated a solid understanding of React fundamentals and showed good problem-solving approach. Communication was clear and professional throughout the interview. Some hesitation was noted when discussing advanced state management patterns, indicating an area for potential growth. Overall performance suggests readiness for a mid-level position with mentorship opportunities for advancement.",
    };

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
                { role: "user", parts: [{ text: JSON.stringify(answer) }] }
            ]
        });
          const output = response.text().trim();
          console.log(output);
    const data: InterviewInsights = JSON.parse(output);

    return data;
}
 async function parsePdfIfMaxTwoPages(pdfInput: Buffer | string): Promise<string> {
    let buffer: Buffer;

    if (typeof pdfInput === 'string') {
        buffer = Buffer.from(pdfInput, 'base64');
    } else {
        buffer = pdfInput;
    }

    const data = await pdf(buffer);

    if (data.numpages > 2) {
        throw new Error(`PDF has ${data.numpages} pages (maximum allowed is 2).`);
    }

    return data.text.trim();
}

