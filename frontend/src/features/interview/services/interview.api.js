import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    if (!jobDescription) {
        throw new Error("jobDescription is required.");
    }
    if (!selfDescription && !resumeFile) {
        throw new Error("At least one of resumeFile or selfDescription must be provided.");
    }

    try {
        const formData = new FormData()
        formData.append("jobDescription", jobDescription)
        
        if (selfDescription) {
            formData.append("selfDescription", selfDescription)
        }
        if (resumeFile) {
            formData.append("resume", resumeFile)
        }

        const response = await api.post("/api/interview/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        return response.data
    } catch (error) {
        console.error("Error generating interview report API:", error);
        throw error; 
    }

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    try {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
    } catch (error) {
        console.error("Error fetching interview report by ID API:", error);
        throw error;
    }
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    try{
    const response = await api.get("/api/interview/")

    return response.data
    } catch (error) {
        console.error("Error fetching all interview reports API:", error);
        throw error;
    }
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try{
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
 } catch (error) {
        console.error("Error generating resume PDF API:", error);
        throw error;
    }
}


// MOCK INTERVIEW APIs


/**
 * @description Start a new mock interview session
 */
export const startMockInterview = async ({ jobRole, interviewReportId, totalQuestions }) => {
    try {
        const response = await api.post("/api/mock-interview/start", {
            jobRole,
            interviewReportId,
            totalQuestions
        });
        return response.data;
    } catch (error) {
        console.error("Error starting mock interview API:", error);
        throw error;
    }
}

/**
 * @description Submit an answer, receive evaluation, and get the next question
 */
export const submitMockAnswer = async ({ mockInterviewId, userAnswer }) => {
    if (!mockInterviewId || !userAnswer) {
        throw new Error("mockInterviewId and userAnswer are required.");
    }
    try {
        const response = await api.post(`/api/mock-interview/${mockInterviewId}/answer`, {
            userAnswer
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting mock answer API:", error);
        throw error;
    }
}

/**
 * @description Fetch a specific mock interview session details by ID
 */
export const getMockInterviewById = async (mockInterviewId) => {
    if (!mockInterviewId) {
        throw new Error("mockInterviewId is required.");
    }
    try {
        const response = await api.get(`/api/mock-interview/${mockInterviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching mock interview by ID API:", error);
        throw error;
    }
}

/**
 * @description Fetch all mock interviews for the logged-in user
 */
export const getAllMockInterviews = async () => {
    try {
        const response = await api.get("/api/mock-interview/");
        return response.data;
    } catch (error) {
        console.error("Error fetching all mock interviews API:", error);
        throw error;
    }
}