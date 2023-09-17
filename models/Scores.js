import mongoose from "mongoose";

const ScoresSchema = new mongoose.Schema(
  {
    record_id: { type: String, required: true },
    student_id: { type: String, required: true },
    student_class: { type: String, required: true },
    subject: { type: String, required: true },
    session: { type: String, required: true },
    session_id: { type: String, required: true },
    term: { type: Number,enum: [1,2,3], required: true },
    assessment_type:{ type: String, required: true, required:true},
    score:{ type: Number, default: 0, required:true },
    // total_scores:{ type: Number, default: 0, required:true },
    cummulative:{ type: Number, default: 0},
    school_id: { type: String },
    created_by: { type: String, required: true },
    created_by_id: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Scores || mongoose.model("Scores", ScoresSchema);
