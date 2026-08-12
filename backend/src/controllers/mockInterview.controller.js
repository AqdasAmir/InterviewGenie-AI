const MockInterview = require("../models/mockInterview.model");
const InterviewReport = require("../models/interviewReport.model");
const {
  generateInitialQuestion,
  evaluateAnswerAndGetNextQuestion,
} = require("../services/ai.service");

/**
 * @description Start a new mock interview session
 * @route POST /api/mock-interview/start
 */
async function startMockInterviewController(req, res) {
  try {
    const { jobRole, interviewReportId, totalQuestions } = req.body;

    let targetJobRole = jobRole ? jobRole.trim() : "";
    let reportData = null;

    // Optional: Load context from a previously generated interview report
    if (interviewReportId) {
      reportData = await InterviewReport.findOne({
        _id: interviewReportId,
        user: req.user.id,
      });

      if (!reportData) {
        return res.status(404).json({ message: "Interview report not found." });
      }

      // Use report title if jobRole wasn't explicitly passed
      if (!targetJobRole) {
        targetJobRole = reportData.title;
      }
    }

    if (!targetJobRole) {
      return res.status(400).json({
        message: "A job role or a valid interview report ID is required.",
      });
    }

    // Sanitize and validate total questions (default: 5, range: 1–10)
    const parsedTotalQuestions = Math.min(
      Math.max(parseInt(totalQuestions, 10) || 5, 1),
      10
    );

    // Call AI to generate opening question
    const { question } = await generateInitialQuestion({
      jobRole: targetJobRole,
      reportData,
    });

    // Create new mock interview session
    const mockInterview = await MockInterview.create({
      user: req.user.id,
      interviewReport: reportData ? reportData._id : null,
      jobRole: targetJobRole,
      totalQuestions: parsedTotalQuestions,
      status: "in_progress",
      qaList: [{ question }],
    });

    return res.status(201).json({
      message: "Mock interview session started successfully.",
      mockInterview,
    });
  } catch (error) {
    console.error("Error starting mock interview:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * @description Submit an answer, receive evaluation, and get the next question or final report
 * @route POST /api/mock-interview/:id/answer
 */
async function submitAnswerController(req, res) {
  try {
    const mockInterviewId = req.params.id || req.params.mockInterviewId;
    const { userAnswer } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ message: "userAnswer is required." });
    }

    const session = await MockInterview.findOne({
      _id: mockInterviewId,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Mock interview session not found." });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        message: "This mock interview session is already completed.",
      });
    }

    const currentIndex = session.qaList.length - 1;
    const currentQa = session.qaList[currentIndex];
    const isLastQuestion = session.qaList.length >= session.totalQuestions;

    // Single AI call: Evaluates current answer AND generates next question/overall summary
    const evaluation = await evaluateAnswerAndGetNextQuestion({
      jobRole: session.jobRole,
      currentQuestion: currentQa.question,
      userAnswer: userAnswer.trim(),
      qaHistory: session.qaList,
      isLastQuestion,
    });

    // Save current question's evaluation
    session.qaList[currentIndex].userAnswer = userAnswer.trim();
    session.qaList[currentIndex].feedback = evaluation.feedback;
    session.qaList[currentIndex].score = evaluation.score;
    session.qaList[currentIndex].idealAnswer = evaluation.idealAnswer;

    if (isLastQuestion) {
      session.status = "completed";
      session.overallFeedback = evaluation.overallFeedback || "";

      // Calculate overall average score
      const totalScore = session.qaList.reduce(
        (sum, item) => sum + (item.score || 0),
        0
      );
      session.averageScore = parseFloat(
        (totalScore / session.qaList.length).toFixed(1)
      );
    } else if (evaluation.nextQuestion) {
      // Push next question into array
      session.qaList.push({ question: evaluation.nextQuestion });
    }

    await session.save();

    return res.status(200).json({
      message: "Answer evaluated successfully.",
      status: session.status,
      questionNumber: currentIndex + 1,
      totalQuestions: session.totalQuestions,
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        idealAnswer: evaluation.idealAnswer,
      },
      nextQuestion: evaluation.nextQuestion || null,
      overallFeedback: evaluation.overallFeedback || null,
      averageScore: session.averageScore || null,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * @description Fetch a specific mock interview session details
 * @route GET /api/mock-interview/:id
 */
async function getMockInterviewByIdController(req, res) {
  try {
    const mockInterview = await MockInterview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!mockInterview) {
      return res.status(404).json({ message: "Mock interview not found." });
    }

    return res.status(200).json({
      message: "Mock interview fetched successfully.",
      mockInterview,
    });
  } catch (error) {
    console.error("Error fetching mock interview by ID:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * @description Fetch all mock interviews of the logged-in user
 * @route GET /api/mock-interview
 */
async function getAllMockInterviewsController(req, res) {
  try {
    const mockInterviews = await MockInterview.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-qaList.idealAnswer -qaList.feedback");

    return res.status(200).json({
      message: "Mock interviews fetched successfully.",
      mockInterviews,
    });
  } catch (error) {
    console.error("Error fetching all mock interviews:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  startMockInterviewController,
  submitAnswerController,
  getMockInterviewByIdController,
  getAllMockInterviewsController,
};