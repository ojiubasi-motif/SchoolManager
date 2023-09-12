import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    session_id:{ type: String, required:true},
    title:{type:String, required:true},
    estimated_start:{type:Date, required:true},
    estimated_end:{type:Date, required:true},
    start:{type:Date},
    end:{type:Date}
  },
  { timestamps: true }
);

export default mongoose.models.Session ||
  mongoose.model("Session", SessionSchema);