import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import Loader from "../../components/Loader";
import "../style/mock-session.scss";

const MockSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, mockSession, fetchMockSessionById, submitAnswer } = useInterview();

  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [loaderText, setLoaderText] = useState("Loading your interview environment...");

  // Load session data on mount
  useEffect(() => {
    if (id) {
      fetchMockSessionById(id);
    }
  }, [id]);

  // Redirect if the session is already completed
  useEffect(() => {
    if (mockSession && mockSession.status === "completed" && !showFeedback) {
      navigate(`/mock-interview/summary/${mockSession._id}`);
    }
  }, [mockSession, navigate, showFeedback]);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;
    
    setLoaderText("Evaluating your answer and generating feedback...");
    await submitAnswer({ mockInterviewId: id, userAnswer });
    setShowFeedback(true);
  };

  const handleNextStep = async () => {
    if (mockSession?.status === "completed") {
      navigate(`/mock-interview/summary/${mockSession._id}`);
    } else {
      setLoaderText("Preparing your next question...");
      await fetchMockSessionById(id);
      setUserAnswer("");
      setShowFeedback(false);
    }
  };

  if (!mockSession || (loading && !showFeedback)) {
    return <Loader text={loaderText} />;
  }

  // Calculate current progress
  const total = mockSession.totalQuestions || 3;
  const qaList = mockSession.qaList || [];
  const currentIndex = qaList.length;
  // If feedback is showing, we are still conceptually on the question we just answered
  const displayIndex = showFeedback ? currentIndex : currentIndex;
  const progressPercentage = total > 0 ? ((displayIndex - 1) / total) * 100 : 0;

  // The active question is the last one in the qaList array
  const currentQuestion = qaList.length > 0 ? qaList[qaList.length - 1] : {};

  // Calculate word count
  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="mock-session-page">
      <div className="session-container">
        
        {/* Header & Progress */}
        <header className="session-header">
          <div className="session-header__top">
            <h1>Mock Interview: {mockSession.jobRole}</h1>
            <span className="question-counter">
              Question {displayIndex} of {total}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar__fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </header>

        {/* Side-by-Side Layout */}
        <main className="interaction-layout">
          
          {/* Card 1: Question */}
          <div className="qna-card">
            <div className="qna-card__header">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Interview Question
              </h2>
            </div>
            <div className="qna-card__body">
              <h3>{currentQuestion?.question}</h3>
            </div>
          </div>

          {/* Card 2: Answer Input OR Feedback */}
          {!showFeedback ? (
            <div className="qna-card">
              <div className="qna-card__header">
                <h2>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Your Answer
                </h2>
              </div>
              <div className="qna-card__body">
                <textarea
                  id="answerInput"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here as clearly and thoroughly as possible..."
                  disabled={loading}
                />
                <div className="word-counter">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </div>
              </div>
            </div>
          ) : (
            <div className="qna-card">
              <div className="qna-card__header">
                <h2>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  AI Evaluation
                </h2>
              </div>
              <div className="qna-card__body feedback-body">
                <div className={`score-badge ${
                    mockSession.evaluation?.score >= 8 ? 'score-badge--high' : 
                    mockSession.evaluation?.score >= 5 ? 'score-badge--mid' : 'score-badge--low'
                  }`}>
                    Score: {mockSession.evaluation?.score}/10
                </div>
                
                <div className="feedback-section">
                  <h4>Feedback</h4>
                  <p>{mockSession.evaluation?.feedback}</p>
                </div>

                <div className="feedback-section">
                  <h4>Ideal Answer</h4>
                  <p className="ideal-answer">{mockSession.evaluation?.idealAnswer}</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Global Action Footer */}
        <div className="action-footer">
          {!showFeedback ? (
            <button 
              onClick={handleSubmit} 
              className="btn btn--primary"
              disabled={loading || wordCount === 0}
            >
              {loading ? "Evaluating..." : "Submit Answer"}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          ) : (
            <button 
              onClick={handleNextStep} 
              className={`btn ${mockSession.status === 'completed' ? 'btn--success' : 'btn--primary'}`}
              disabled={loading}
            >
              {mockSession.status === "completed" ? "View Final Results" : "Next Question"}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MockSession;