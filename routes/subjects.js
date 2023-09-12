import express from "express";
import Subjects from "../models/Subjects.js";
import verify from "../middleware/verifyToken.js";

const router = express.Router();

// login===NB:you can login with either your email or phone
router.post("/subjects",  async (req, res) => {
  const { name } = req.body;
//   const {} = req.user;
  const id = "" + Math.floor(Math.random() * 1000 + 1);

  const school = new Subjects({
    subject_id:id,
    name
  })

  try {
    const checkForSubject = await Subjects.findOne({ name }, "name");
    if (checkForSubject) {
      return res
        .status(403)
        .json({ msg: "subject already exist", type: "EXIST", code: 602 });
    }
    const saved = await school.save();
    res.status(200).json({msg:saved, type:"SUCCESS", code:600});
  } catch (error) {
    res.status(500).json({msg:error, type:"FAILED", code:601});
  }
});

router.get("/subjects", async (req, res) => {
    try {
        const allSubjects = await Subjects.find().select("-createdAt -updatedAt");
        res.status(200).json({msg:allSubjects, type:"SUCCESS",code:600})
      } catch (error) {
        res.status(500).json({msg:error, type:"FAILED",code:601})
      }
});

export default router;
