import { createContext,useState } from "react";


export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    const [mockSession, setMockSession] = useState(null)
    const [mockHistory, setMockHistory] = useState([])

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports, mockSession, setMockSession, mockHistory, setMockHistory }}>
            {children}
        </InterviewContext.Provider>
    )
}