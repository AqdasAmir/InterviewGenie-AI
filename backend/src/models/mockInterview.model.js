const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    interviewReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewReport", 
      default: null,
    },
    jobRole: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      default: 4,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    qaList: [
      {
        question: { 
          type: String, 
          required: true 
        },
        userAnswer: { 
          type: String, 
          default: "" 
        },
        feedback: { 
          type: String, 
          default: "" 
        },
        score: { 
          type: Number, 
          default: 0 
        },
        idealAnswer: { 
          type: String, 
          default: "" 
        },
      },
    ],
    overallFeedback: { 
      type: String, 
      default: "" 
    },
    averageScore: { 
      type: Number, 
      default: 0 
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes to speed up user-specific and status-based lookups
mockInterviewSchema.index({ user: 1, createdAt: -1 });
mockInterviewSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("MockInterview", mockInterviewSchema);