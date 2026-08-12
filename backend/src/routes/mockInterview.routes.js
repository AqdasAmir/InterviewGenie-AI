const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const {
  startMockInterviewController,
  submitAnswerController,
  getMockInterviewByIdController,
  getAllMockInterviewsController,
} = require("../controllers/mockInterview.controller");

const mockInterviewRouter = express.Router();

/**
 * @route POST /api/mock-interview/start
 * @description Start a new mock interview session
 * @access private
 */
mockInterviewRouter.post("/start", authUser, startMockInterviewController);

/**
 * @route POST /api/mock-interview/:id/answer
 * @description Submit an answer, receive evaluation, and get the next question or final report
 * @access private
 */
mockInterviewRouter.post("/:id/answer", authUser, submitAnswerController);

/**
 * @route GET /api/mock-interview/
 * @description Fetch all mock interviews of the logged-in user
 * @access private
 */
mockInterviewRouter.get("/", authUser, getAllMockInterviewsController);

/**
 * @route GET /api/mock-interview/:id
 * @description Fetch a specific mock interview session details
 * @access private
 */
mockInterviewRouter.get("/:id", authUser, getMockInterviewByIdController);

module.exports = mockInterviewRouter;