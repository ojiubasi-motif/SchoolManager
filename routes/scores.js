// import Auth from "../models/Auth.js";
import express from "express";
import verify from "../middleware/verifyToken.js";
import Students from "../models/Students.js";
import Scores from "../models/Scores.js";

const router = express.Router();

// =======helper functions=======
const aggregateScores = ({ fetchedRecord, selectedSubject,term }) => {
  // compute the the total scores for each term
  // console.log("the supplied arguments==>", fetchedRecord, selectedSubject)
  let firstTermScores = [];
  let secondTermScores = [];
  let thirdTermScores = [];
  let firstTermTotalScore = 0;
  let secondTermTotalScore = 0;
  let thirdTermTotalScore = 0;
  const cummulative =0;

  if(term == "first"){
    for(let i=0;i<fetchedRecord.length; i++){
      if (
        // fetchedRecord[i]?.term == "first" &&
        fetchedRecord[i]?.subject == selectedSubject
      ) {
        firstTermScores.push(fetchedRecord[i]);
        firstTermTotalScore = firstTermTotalScore + fetchedRecord[i]?.score;
      }
    }
    // cummulative += firstTermTotalScore;
    return {
      firstTermScores,
      firstTermTotalScore,
      // cummulative,
    };
  }else if(term == "second"){
    for(let i=0;i<fetchedRecord.length; i++){
      if (
        // fetchedRecord[i]?.term == "second" &&
        fetchedRecord[i]?.subject == selectedSubject
      ) {
        secondTermScores.push(fetchedRecord[i]);
        secondTermTotalScore = secondTermTotalScore + fetchedRecord[i]?.score;
      }
    }
    // cummulative += secondTermScores;
    return {
      secondTermScores,
      secondTermTotalScore,
      // cummulative,
    };
  }else if(term == "third"){
    for(let i=0;i<fetchedRecord.length; i++){
      if (
        // fetchedRecord[i]?.term == "third" &&
        fetchedRecord[i]?.subject == selectedSubject
      ) {
        thirdTermScores.push(fetchedRecord[i]);
        thirdTermTotalScore = thirdTermTotalScore + fetchedRecord[i]?.score;
      }
    }
    // cummulative += thirdTermTotalScore;
    return {
      thirdTermScores,
      thirdTermTotalScore,
      // cummulative,
    };
  }else{
  for (var i = 0; i < fetchedRecord?.length; i++) {
    // if(fetchedRecord[i])
    if (
      fetchedRecord[i]?.term == "first" &&
      fetchedRecord[i]?.subject == selectedSubject
    ) {
      firstTermScores.push(fetchedRecord[i]);
      firstTermTotalScore = firstTermTotalScore + fetchedRecord[i]?.score;
    } else if (
      fetchedRecord[i]?.term == "second" &&
      fetchedRecord[i]?.subject == selectedSubject
    ) {
      secondTermScores.push(fetchedRecord[i]);
      secondTermTotalScore = secondTermTotalScore + fetchedRecord[i]?.score;
    } else if (
      fetchedRecord[i]?.term == "third" &&
      fetchedRecord[i]?.subject == selectedSubject
    ) {
      thirdTermScores.push(fetchedRecord[i]);
      thirdTermTotalScore = thirdTermTotalScore + fetchedRecord[i]?.score;
    }
  } 
  return {
    firstTermScores,
    secondTermScores,
    thirdTermScores,
    firstTermTotalScore,
    secondTermTotalScore,
    thirdTermTotalScore,
    cummulative,
  };
  }
  
};

// ================
// record student score
router.post("/scores", verify, async (req, res) => {
  const {
    student_id,
    student_class,
    subject,
    session,
    term,
    assessment_type,
    score,
  } = req.body;
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
    const isScoreRecorded = await Scores.findOne({
      student_id,
      student_class,
      subject,
      session,
      term,
      assessment_type,
    });
    if (isScoreRecorded)
      return res.status(403).json({
        msg: "student score has been recorded already, ",
        type: "EXIST",
        code: 602,
      });
    const scoreRecord = new Scores({
      record_id: id,
      student_id,
      student_class,
      subject,
      session,
      term,
      assessment_type,
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

router.get("/scores/aggregate", verify, async (req, res) => {
  const { subject, session, student_id,term } = req.query;
  let filter = typeof(subject) !== "string"
    ? {
        student_id,
        session,
        term 
      }
    : {
        student_id,
        subject,
        session,
        term
      };
  // 
  try {
   if(typeof(term) !== "string"  || typeof(session) !== "string" || typeof(student_id) !== "string") return res
   .status(200)
   .json({ msg: "please supply valid and/or complete data for query", type: "WRONG_OR_MISSING_PAYLOAD", code: 605 });

    const filteredStudentScores = await Scores.find(filter,'-cummulative');
    if (!filteredStudentScores || filteredStudentScores?.length<1)
      return res
        .status(200)
        .json({ msg: "No record found", type: "NOT_EXIST", code: 603 });

    const computed = [];
    // // aggregate for all subjects
    if (!subject ) {
      // =======get all the subjects=========
      const subjects = [];
      for (let j = 0; j < filteredStudentScores.length; j++) {
        if (subjects?.includes(filteredStudentScores[j]?.subject)) continue;
        subjects.push(filteredStudentScores[j]?.subject);
      }
      for (var i = 0; i < subjects.length; i++) {
        const response = aggregateScores({
          fetchedRecord: filteredStudentScores,
          selectedSubject: subjects[i],
          term
        });
        // console.log("the respo data=>",response)
        const record = term =="first"? {
          first_term: response?.firstTermScores?.length>0?response?.firstTermScores:'No record found for first term',
        }:term=="second"?{
          second_term:response?.secondTermScores?.length>0?response?.secondTermScores:'No record for second term',
        }:term=="third"?{
          third_term:response?.thirdTermScores?.length>0?response?.thirdTermScores:'No record for third term'
        }:{
          first_term: response?.firstTermScores?.length>0?response?.firstTermScores:'No record for first term',
          second_term:response?.secondTermScores?.length>0?response?.secondTermScores:'No record for second term',
          third_term:response?.thirdTermScores?.length>0?response?.thirdTermScores:'No record for third term'
        }
        computed.push({
          subject: subjects[i],
          record,
          aggr: {
            first_term_total: response?.firstTermTotalScore,
            second_term_total: response?.secondTermTotalScore,
            third_term_total: response?.thirdTermTotalScore,
            cummulative:response?.cummulative
          },
        });

      }
    } else {
      const response = aggregateScores({
        fetchedRecord: filteredStudentScores,
        selectedSubject: subject,
        term
      });
      // response?.firstTermScores?.length < 1?
      const record = term =="first"? {
        first_term: response?.firstTermScores?.length>0?response?.firstTermScores:'No record foundc for first term',
      }:term=="second"?{
        second_term:response?.secondTermScores?.length>0?response?.secondTermScores:'No record for second term',
      }:term=="third"?{
        third_term:response?.thirdTermScores?.length>0?response?.thirdTermScores:'No record for third term'
      }:{
        first_term: response?.firstTermScores?.length>0?response?.firstTermScores:'No record for first term',
        second_term:response?.secondTermScores?.length>0?response?.secondTermScores:'No record for second term',
        third_term:response?.thirdTermScores?.length>0?response?.thirdTermScores:'No record for third term'
      }
      computed.push({
        subject,
        record, 
        aggr: {
          first_term_total: response?.firstTermTotalScore,
          second_term_total: response?.secondTermTotalScore,
          third_term_total: response?.thirdTermTotalScore,
          cummulative:response?.cummulative
        },
      });
    } 
    res.status(200).json({
      msg: "Record found",
      type: "SUCCESS",
      code: 600,
      data: computed,
    });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 602 });
  }
});

// get a student's scores
router.get("/scores/:student_id", verify, async (req, res) => {
  try {
    const filteredStudentScores = await Scores.find({
      student_id: req.params?.student_id,
    });
    if (!filteredStudentScores)
      return res.status(403).json({
        msg: "No score found for this student",
        type: "NOT_EXIST",
        code: 603,
      });
    res
      .status(200)
      .json({ msg: filteredStudentScores, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 602 });
  }
});

export default router;
