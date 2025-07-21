import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    assessmentName: { type: String, required: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    dateGiven: { type: Date, required: true },
    gradeType: {
      type: String,
      enum: ["quiz", "assignment", "exam"],
      required: true,
    },
  },
  { timestamps: true }
);

gradeSchema.index({ studentId: 1, courseId: 1 });

export default mongoose.model("Grade", gradeSchema);
