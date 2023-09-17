import mongoose from "mongoose";

const AggregatesSchema = new mongoose.Schema(
  {
    aggregate_id: { type: String, required:true},
    student_id: { type: String, required:true },
    subject_id: { type: String, required:true },
    class_id:{ type: String, required:true},
    session_id:{ type: String, required:true},
    term: { type: Number,enum: [1,2,3], required: true },
    total_scores: { type: Number, required:true,default:0 },
    cummulative: { type: Number,default:0},
  },
  { timestamps: true }
);

export default mongoose.models.Aggregates ||
  mongoose.model("Aggregates", AggregatesSchema);