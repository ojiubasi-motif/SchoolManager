import mongoose from "mongoose";

const TrainersSchema = new mongoose.Schema(
  {
    trainer_id: { type: String, required:true},
    school_id:{type:String, required:true},
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    email:{type:String,required:true},
    password:{type:String, required:true}
  },
  { timestamps: true }
);

export default mongoose.models.Trainers ||
  mongoose.model("Trainers", TrainersSchema);