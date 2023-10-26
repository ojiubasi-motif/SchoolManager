import express from "express";
import Subjects from "../models/Subjects.js";
import verify from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/subjects", async (req, res) => {
  const { title,school,cat } = req.body;
  //   const {} = req.user;
  const id = "" + Math.floor(Math.random() * 1000 + 1);

  const subject = new Subjects({
    subject_id: id,
    title,
    school,
    cat
  });

  try {
    const checkForSubject = await Subjects.findOne({ title,school }, "title");
    if (checkForSubject) {
      return res
        .status(403)
        .json({ msg: "subject already exist for this school", type: "EXIST", code: 602 });
    }
    const saved = await subject.save();
    res.status(200).json({ msg: "success",data:saved, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

router.get("/subjects/all/:school_id", async (req, res) => {
  const { school_id } = req.params;
  try {
    const allSubjects = await Subjects.find({school:school_id}).select("-createdAt -updatedAt");
    res.status(200).json({ msg: allSubjects, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// get a single subject
router.get("/subjects/:subject_id", async (req, res) => {
  const { subject_id } = req.params;
  if (typeof subject_id !== "string" || subject_id.trim().length < 1)
    return res.status(200).json({
      msg: `please supply valid and/or complete data for query`,
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });

  try {
    const thisSubject = await Subjects.findOne({ subject_id }).select(
      "-createdAt -updatedAt"
    );
    if (thisSubject) {
      return res
        .status(200)
        .json({
          msg: "subject found",
          data: thisSubject,
          type: "SUCCESS",
          code: 600,
        });
    } else {
      return res
        .status(200)
        .json({
          msg: "No subject found for this subject id",
          type: "SUCCESS",
          code: 600,
        });
    }
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

export default router;