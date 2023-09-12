import Schools from "../models/Schools.js";
import express from  "express"
// import CryptoJS from "crypto-js";
// import jwt from "jsonwebtoken";

const router = express.Router();

// get a school
router.get("/schools/:school_id", async(req,res)=>{
  const {school_id} = req.params

  if(!school_id){
    return res.status(403).json({msg:"supply a valid school_id", type:"WRONG_OR_MISSING_PAYLOAD",code:605})
  }
  const fetchSchool = Schools.findOne({school_id},'-createdAt -updatedAt');
  try {
    const school = await fetchSchool.exec();
    if(!school) return res
    .status(200)
    .json({ msg: "No record found for the school_id you entered", type: "NOT_EXIST", code: 603 }); 
     res.status(200).json({ msg: school, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
})
// 
router.get("/schools", async (req, res) => {
  try {
    const allSchools = await Schools.find().select("-createdAt -updatedAt");
    res.status(200).json({msg:allSchools, type:"SUCCESS",code:600})
  } catch (error) {
    res.status(500).json({msg:error, type:"FAILED",code:601})
  }
});

// create a school
router.post("/schools", async (req, res) => {
  const {name} = req.body;
  
  const id = "" + Math.floor(Math.random() * 10000 + 1);
  const school = new Schools({
    school_id:id,
    name,
  });
  

  try {
    const searchedSchool = await Schools.findOne({name},'school_id name');
    // console.log(searchedSchool);
    if(name === searchedSchool?.name) return res.status(403).json({msg:"A school with this name already exist",type:"EXIST",code:602})
    const savedSchool = await school.save();
    // const {school_id,name} = savedSchool._doc;
    res.status(200).json({msg:savedSchool, type:"SUCCESS", code:600});
  } catch (error) {
    res.status(500).json({msg:error, type:"FAILED", code:601});
  }
});



export default router;