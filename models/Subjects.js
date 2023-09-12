import mongoose from "mongoose";

const SubjectsSchema = new mongoose.Schema(
  {
    subject_id: { type: String, required:true},
    name: { type: String, required:true },
  },
  { timestamps: true }
); 
 
export default mongoose.models.Subjects ||
  mongoose.model("Subjects", SubjectsSchema);