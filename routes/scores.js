// import Auth from "../models/Auth.js";
import express from "express";
import verify from "../middleware/verifyToken.js";
import Students from "../models/Students.js";
import Scores from "../models/Scores.js";

const router = express.Router();

router.post("/scores", verify, async (req, res) => {
  const { student_id, session, score, subject, term } = req.body;
  const {
    trainer_id,
    first_name,
    last_name,
    school_id: trainer_school,
  } = req.user;
  const id = "" + Math.floor(Math.random() * 100000000 + 1);
  try {
    const verifyStudent = await Students.findOne(
      { student_id },
      "student_id school_id"
    );

    if (!verifyStudent)
      return res.status(403).json({
        msg: "student record not found",
        type: "NOT_EXIST",
        code: 603,
      });

    if (verifyStudent?.school_id !== trainer_school)
      return res.status(503).json({
        msg: "You are not authorised to set scores for this student",
        type: "NOT_AUTHORISED",
        code: 604,
      });
    const checkScore = await Scores.findOne({ student_id, subject, term });
    if (checkScore)
      return res.status(403).json({
        msg: "student score has been recorded already, ",
        type: "EXIST",
        code: 602,
      });
    const scoreRecord = new Scores({
      score_id: id,
      student_id,
      subject,
      session,
      term,
      score,
      school_id: verifyStudent?.school_id,
      created_by: `${first_name} ${last_name}`,
      created_by_id: trainer_id,
    });
    const saved = await scoreRecord.save();
    res.status(200).json({ msg: saved, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

router.get("/scores/:student_id/info", verify, async (req, res) => {
  try {
    const findStudentScore = await Scores.findOne({
      student_id: req.params?.student_id,
    });
    if (!findStudentScore)
      return res
        .status(200)
        .json({ msg: "No record found", type: "NOT_EXIST", code: 603 });
    res.status(200).json({ msg: findStudentScore, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 602 });
  }
});

export default router;
