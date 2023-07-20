import mongoose from "mongoose";

const StudentsSchema = new mongoose.Schema(
  {
    student_id: { type: String, required:true},
    school_id:{type:String, required:true},
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    other_name:{type:String},
    arm:{type:String},
    grade:{type:String, required:true}
  },
  { timestamps: true }
);

export default mongoose.models.Students ||
  mongoose.model("Students", StudentsSchema);
