import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, startMockInterview, submitMockAnswer, getMockInterviewById, getAllMockInterviews } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../context/interview.context"
import { useParams } from "react-router"
import { toast } from "react-hot-toast"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, mockSession, setMockSession, mockHistory, setMockHistory } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        if (!jobDescription) {
            toast.error("Job description is required.")
            return;
        }
        if (!selfDescription && !resumeFile) {
            toast.error("At least one of resume file or self-description must be provided.")
            return;        }

        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            toast.success("Interview plan generated successfully!")
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || "Failed to generate report."
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            toast.error("Failed to load the interview report.")
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
            toast.error("Failed to load your interview plans.")
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }


    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            toast.success("PDF downloaded successfully!")
        }
        catch (error) {
            console.log(error)
            toast.error("Failed to generate PDF.")
        } finally {
            setLoading(false)
        }
    }
    

// MOCK INTERVIEW FUNCTIONS

    const initMockSession = async ({ jobRole, interviewReportId, totalQuestions }) => {
        if (!jobRole && !interviewReportId) {
            toast.error("A job role or report selection is required.");
            return;
        }

        setLoading(true);
        let response = null;
        try {
            response = await startMockInterview({ jobRole, interviewReportId, totalQuestions });
            setMockSession(response.mockInterview);
            toast.success("Mock interview started!");
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Failed to start mock interview.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        
        return response?.mockInterview;
    }

    const submitAnswer = async ({ mockInterviewId, userAnswer }) => {
        if (!userAnswer || !userAnswer.trim()) {
            toast.error("Please provide an answer before submitting.");
            return;
        }

        setLoading(true);
        let response = null;
        try {
            response = await submitMockAnswer({ mockInterviewId, userAnswer });
            
            // Update local state with the latest feedback and question
            setMockSession(prev => ({
                ...prev,
                status: response.status,
                evaluation: response.evaluation,
                nextQuestion: response.nextQuestion,
                overallFeedback: response.overallFeedback,
                averageScore: response.averageScore
            }));
            
            toast.success("Answer evaluated!");
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Failed to evaluate answer.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }

        return response;
    }

    const fetchMockSessionById = async (id) => {
        setLoading(true);
        let response = null;
        try {
            response = await getMockInterviewById(id);
            setMockSession(response.mockInterview);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load mock interview session.");
        } finally {
            setLoading(false);
        }
        return response?.mockInterview;
    }

    const fetchMockHistory = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllMockInterviews();
            setMockHistory(response.mockInterviews);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load mock interview history.");
        } finally {
            setLoading(false);
        }
        return response?.mockInterviews;
    }


    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
            fetchMockHistory()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf, mockSession, mockHistory, initMockSession, submitAnswer, fetchMockSessionById, fetchMockHistory }

}