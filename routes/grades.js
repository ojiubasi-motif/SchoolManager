import verify from "../middleware/verifyToken.js";
import Grades from "../models/Grades.js";
import express from "express";
// import CryptoJS from "crypto-js";
// import jwt from "jsonwebtoken";

const router = express.Router();
// fetch all grades in a school
router.get("/grades/:school_id", async (req, res) => {
  const { school_id } = req.params;
  try {
    const allGrades = await Grades.find({ school_id }).select(
      "-createdAt -updatedAt"
    );
    res.status(200).json({ msg: allGrades, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// fetch a single grade
router.get("/grades/:grade_id/details", async (req, res) => {
  const { grade_id} = req.params;
  
  // [null, undefined, "", {}, []].includes(school_id) ||
  if(typeof(grade_id) !== "string"){
    return res.status(403).json({msg:"supply a valid class_id", type:"WRONG_OR_MISSING_PAYLOAD",code:605})
  } 
  let query = Grades.findOne({grade_id});
  
  try {
    const grade = await query.exec();
    if(!grade) return res
    .status(200)
    .json({ msg: "No record found", type: "NOT_EXIST", code: 603 }); 
     res.status(200).json({ msg: grade, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// create a school garde
router.post("/grades/:school_id/create", verify, async (req, res) => {
  const { name, head_teacher_id, head_teacher_name, subjects, arms } = req.body;
  const { school_id } = req.params;
  const {trainer_id } = req.user;

  // console.log('the school_id=>>', school_id);

  if (trainer_id !== '51357')
    return res.status(503).json({
      msg: "You are not authorised to create grade for this school",
      type: "NOT_AUTHORISED",
      code: 604,
    });

  const id = "" + Math.floor(Math.random() * 100 + 1);
  const grade = new Grades({
    grade_id: id,
    name, 
    school_id,
    head_teacher:{
      id:head_teacher_id,
      name:head_teacher_name
    },
    subjects,
    arms,
  });

  try {
    const searchedGrade = await Grades.findOne({ name, school_id }, "school_id name");
    // console.log(searchedSchool);
    if (name === searchedGrade?.name)
      return res
        .status(403)
        .json({ msg: "Grade already exist", type: "EXIST", code: 602 });
    const savedGrade = await grade.save();
    // const {school_id,name} = savedSchool._doc;
    res.status(200).json({ msg: savedGrade, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// update a school grade
router.put("/grades/:grade_id/update", verify, async (req, res) => {
  //N.B:subjects and arms are of array type
  const { head_teacher, subjects, arms } = req.body;

  const { grade_id } = req.params;
  const { school_id: trainer_school } = req.user;
//   if (school_id !== trainer_school)
//     return res.status(503).json({
//       msg: "You are not authorised to create grade for this school",
//       type: "NOT_AUTHORISED",
//       code: 604,
//     });
  try {
    const updatedGrade = await Grades.findOneAndUpdate(
      { grade_id },
      {
        head_teacher,
        // append every value in the array supplied from req.body iff the value doesn't exist
        // NB:if you wish to add the values without checking for redundancy then use $push
        $addToSet: { subjects: { $each: subjects }},
        $addToSet: { arms: { $each: arms }}
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
        msg: updatedGrade,
        type: "SUCCESS",
        code: 600,
      }) 
  } catch (error) {
    console.log("ERROR==>",error);
    res.status(503).json({
        msg: "An error occured",
        type: "FAILED",
        code: 601,
      })
  }
});

// get a school
// router.get("/schools", async(req,res)=>{

// })

export default router;