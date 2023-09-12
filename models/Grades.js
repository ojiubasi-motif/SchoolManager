import mongoose from "mongoose";

const GradesSchema = new mongoose.Schema(
  {
    grade_id: { type: String, required:true},
    name: { type: String, required:true },
    school_id:{ type: String, required:true},
    head_teacher:{ 
      id:String,
      name:String
    },
    subjects:[{ type: String}],
    arms:[{ type: String}]
  },
  { timestamps: true }
);

export default mongoose.models.Grades ||
  mongoose.model("Grades", GradesSchema);