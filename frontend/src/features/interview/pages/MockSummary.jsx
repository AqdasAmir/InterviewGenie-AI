import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import Loader from "../../components/Loader";
import "../style/mock-summary.scss";

const MockSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, mockSession, fetchMockSessionById } = useInterview();

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure user starts at top of the page
    if (id) {
      fetchMockSessionById(id);
    }
  }, [id]);

  if (loading || !mockSession) {
    return <Loader text="Loading your interview results..." />;
  }

  // Determine score color class
  const getScoreClass = (score) => {
    if (score >= 8) return "high";
    if (score >= 5) return "mid";
    return "low";
  };

  const scoreClass = getScoreClass(mockSession.averageScore);

  return (
    <div className="summary-page">
      <div className="summary-container">

        <div className="summary-actions">
          <button className="btn-home" onClick={() => navigate("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Home
          </button>
        </div>
        
        {/* Overview Card */}
        <section className="overview-card">
          <div className="overview-card__header">
            <h1>Interview Performance Summary</h1>
            <p>Role: <strong>{mockSession.jobRole}</strong> • Completed on {new Date(mockSession.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className={`overview-card__score overview-card__score--${scoreClass}`}>
            <span>{mockSession.averageScore}</span>
            <small>Avg Score</small>
          </div>

          {mockSession.overallFeedback && (
            <div className="overview-card__feedback">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                AI Final Verdict
              </h3>
              <p>{mockSession.overallFeedback}</p>
            </div>
          )}
        </section>

        {/* Detailed Q&A Breakdown */}
        <section className="breakdown-section">
          <h2>Detailed Breakdown</h2>
          
          {mockSession.qaList.map((qa, index) => (
            <div key={index} className="qa-card">
              
              <div className="qa-card__header">
                <h4>Q{index + 1}: {qa.question}</h4>
                <span className={`score-badge score-badge--${getScoreClass(qa.score)}`}>
                  Score: {qa.score}/10
                </span>
              </div>

              <div className="qa-card__body">
                
                <div className="qa-block">
                  <h5>Your Answer</h5>
                  <p>{qa.userAnswer}</p>
                </div>

                <div className="qa-block">
                  <h5>AI Feedback</h5>
                  <p>{qa.feedback}</p>
                </div>

                <div className="qa-block qa-block--ideal">
                  <h5>Ideal Approach</h5>
                  <p>{qa.idealAnswer}</p>
                </div>

              </div>
            </div>
          ))}
        </section>

        {/* Action Footer */}
        <div className="summary-actions">
          <button className="btn-home" onClick={() => navigate("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default MockSummary;