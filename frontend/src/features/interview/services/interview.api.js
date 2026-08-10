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


