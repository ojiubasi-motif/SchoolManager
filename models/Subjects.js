import mongoose from "mongoose";

const SubjectsSchema = new mongoose.Schema(
  {
    subject_id: { type: String, required:true},
    title: { type: String, required:true },
    school:{type: String, required:true },
    cat: [{ type: String}],
  },
  { timestamps: true }
); 
 
export default mongoose.models.Subjects ||
  mongoose.model("Subjects", SubjectsSchema);