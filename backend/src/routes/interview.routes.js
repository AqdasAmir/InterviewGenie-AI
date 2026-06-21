const express = require("express")
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController } = require("../controllers/interview.controller");


const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authUser, getAllInterviewReportsController)


module.exports = interviewRouter