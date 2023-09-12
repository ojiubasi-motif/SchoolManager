import express from "express";
import Students from "../models/Students.js";
import Schools from "../models/Schools.js";

const router = express.Router();

// login===NB:you can login with either your email or phone
router.post("/students", async (req, res) => {
  const { school_id, first_name, last_name, other_name, arm, grade } = req.body;
  const id = "" + Math.floor(Math.random() * 1000000 + 1);
  const student = new Students({
    student_id: id,
    school_id,
    first_name,
    last_name,
    other_name,
    arm,
    grade,
  });
  try {
    const verifySchool = await Schools.findOne({school_id},'school_id name');
    if(!verifySchool) return res.status(403).json({ msg: "Enter a valid school_id", type: "NOT_EXIST", code: 603 });
    const savedStudent = await student.save();
    res.status(200).json({ msg: savedStudent, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// get a student
router.get("/students/:student_id/info", async (req, res) => {
  try {
    const findStudent = await Students.findOne({ student_id:req.params?.student_id });
    if (!findStudent)
      return res
        .status(403)
        .json({ msg: "No record found", type: "NOT_EXIST", code: 603 });
    res.status(200).json({ msg: findStudent, type: "SUCCESS", code: 600 });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ msg: err, type: "FAILED", code: 602 });
  }
});

// get all students
router.get("/students", async (req, res) => {
  const { school, grade, arm } = req.query;
  const query = school && arm && grade
    ?Students.find({ school_id: school, arm, grade })
    :arm && grade
    ?Students.find({ grade, arm })
    : school && arm
    ?Students.find({ school_id: school, arm })
    : school && grade
    ? Students.find({ school_id: school, grade })
    : arm
    ? Students.find({ arm })
    : grade
    ? Students.find({ grade })
    :school
    ? Students.find({ school_id: school })
    :Students.find();
  try {
    const getStudents = await query.limit(10).exec();
    if (getStudents.length < 1)
      return res
        .status(200)
        .json({ msg: "No record found", type: "NOT_EXIST", code: 603 });
    res.status(200).json({ msg: getStudents, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 602 });
  }
});

export default router;