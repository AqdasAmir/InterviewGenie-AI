const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { generatePdfBuffer } = require("./pdf.service");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(interviewReportSchema),
        }
    })
    
    return JSON.parse(response.text)


}

// Generating pdf 

const resumeDataSchema = z.object({
    name: z.string().describe("Candidate's full name"),
    headline: z.string().describe("Professional headline tailored to the job, e.g. 'Full-Stack Developer (MERN)'"),
    contact: z.object({
        email: z.string(),
        phone: z.string().optional(),
        location: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
    }),
    summary: z.string().describe("2-3 sentence professional summary tailored to the job description, written like a human wrote it, not generic AI text"),
    skills: z.array(z.string()).describe("Relevant technical and soft skills, ordered by relevance to the job description"),
    experience: z.array(z.object({
        company: z.string(),
        role: z.string(),
        duration: z.string().describe("e.g. 'Jun 2024 - Present'"),
        bullets: z.array(z.string()).describe("Achievement-focused bullet points, quantified where possible")
    })).describe("Work experience or internships. Use an empty array if the candidate has none."),
    projects: z.array(z.object({
        name: z.string(),
        techStack: z.array(z.string()).optional(),
        bullets: z.array(z.string()).describe("What was built and the impact/result, quantified where possible")
    })).describe("Relevant personal/academic projects — especially important for candidates with limited work experience"),
    education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        duration: z.string()
    }))
})


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate ATS-friendly resume content for a candidate, tailored to the job description below.

                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        Tailor the summary, skills order, and bullet points to this specific job description, highlighting the candidate's most relevant strengths and experience.
                        Write it like a real human-written resume, not something that sounds AI-generated.
                        Quantify achievements wherever possible. Keep content concise enough to fit 1-2 pages when laid out.
                        If work experience is limited, lean more heavily on projects to demonstrate relevant skills.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(resumeDataSchema),
        }
    })

    const data = JSON.parse(response.text)


    const pdfBuffer = await generatePdfBuffer(data)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf };
