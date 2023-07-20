import mongoose from "mongoose";

const ScoresSchema = new mongoose.Schema(
  {
    score_id: { type: String, required:true},
    student_id: { type: String, required:true},
    subject:{type:String, required:true},
    session:{type:String, required:true},
    term:{type:String, required:true},
    score:{type:String, required:true},
    school_id:{type:String, required:true},
    created_by:{type:String, required:true},
    created_by_id:{type:String, required:true},
  },
  { timestamps: true }
);

export default mongoose.models.Scores ||
  mongoose.model("Scores", ScoresSchema);
