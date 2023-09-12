import express from "express";
import Trainers from "../models/Trainers.js";
import Schools from "../models/Schools.js";
import CryptoJS from 'crypto-js'

const router = express.Router();

// create a trainer
router.post("/trainers", async (req, res) => {
  const { school_id, first_name, last_name,email, password } = req.body;
  const id = "" + Math.floor(Math.random() * 100000 + 1);
  const trainer = new Trainers({
    trainer_id: id,
    school_id,
    first_name,
    last_name,
    email,
    password:CryptoJS.AES.encrypt(
        password,process.env.PW_CRYPT
      ).toString()
  });
  try {
    const checkTrainer = await Trainers.findOne({email},'-password');
    if(checkTrainer) return res.status(403).json({ msg: "A trainer with this email has been registered already", type: "EXIST", code: 602 });
    const verifySchool = await Schools.findOne({school_id},'school_id name');
    if(!verifySchool) return res.status(403).json({ msg: "Enter a valid school_id", type: "NOT_EXIST", code: 603 });
    const savedTrainer = await trainer.save();
    res.status(200).json({ msg: savedTrainer, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});
 
// get a trainer
router.get("/trainers/:trainer_id/info", async (req, res) => {
  try {
    const findTrainer = await Trainers.findOne({ trainer_id:req.params?.trainer_id },'-password');
    if (!findTrainer)
      return res
        .status(200)
        .json({ msg: "No record found", type: "NOT_EXIST", code: 603 });
    res.status(200).json({ msg: findTrainer, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 602 });
  }
});

// get all trainers
router.get("/trainers", async (req, res) => {
  const {school} = req.query;
  const query =school
    ? Trainers.find({ school_id: school })
    :Trainers.find();

  try {
    const getTrainers = await query.limit(10).exec();
    if (getTrainers.length < 1)
      return res
        .status(400)
        .json({ msg: "No record found", type: "NOT_EXIST", code: 603 });
    res.status(200).json({ msg: getTrainers, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 602 });
  }
});
 
export default router;