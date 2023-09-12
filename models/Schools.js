import mongoose from "mongoose";

const SchoolsSchema = new mongoose.Schema(
  {
    school_id: { type: String, required:true},
    name: { type: String, required:true },
  },
  { timestamps: true }
); 
export default mongoose.models.Schools ||
  mongoose.model("Schools", SchoolsSchema);