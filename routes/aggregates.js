import verify from "../middleware/verifyToken.js";
import Aggregates from "../models/Aggregates.js";
import express from "express";
import Students from "../models/Students.js";
// import CryptoJS from "crypto-js";
// import jwt from "jsonwebtoken";

const router = express.Router();
// fetch all aggregates in a school
router.get("/aggregates", async (req, res) => {
  const { student_id, class_id, subject_id, session_id, term } = req.query;

  if (
    // typeof term !== "number" ||
    typeof class_id !== "string" ||
    typeof subject_id !== "string" ||
    typeof session_id !== "string" ||
    typeof student_id !== "string" ||
    // term === NaN ||
    session_id.trim().length < 1 ||
    class_id.trim().length < 1 ||
    student_id.trim().length < 1 ||
    subject_id.trim().length < 1
  )
    return res.status(200).json({
      msg: "please supply valid and/or complete data for query",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });
  try {
    const aggregate = await Aggregates.find({
      student_id,
      class_id,
      subject_id,
      session_id,
    }).select("-createdAt -updatedAt");
    res.status(200).json({ msg: aggregate, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// create a student aggregate record for a subject
router.post("/aggregates/:student_id", async (req, res) => {
  const { class_id, subject_id, session_id, term, score } = req.body;
  const { student_id } = req.params;

  const id = "" + Math.floor(Math.random() * 100000 + 1);
  const aggregate = new Aggregates({
    aggregate_id: id,
    student_id,
    subject_id,
    class_id,
    session_id,
    term,
    total_scores: score,
    // cummulative,
  });

  try {
    const aggregateExist = await Aggregates.findOne(
      { student_id, class_id, subject_id, session_id, term },
      "aggregate_id"
    );
    if (aggregateExist)
      return res.status(403).json({
        msg: "this aggregate record already exist, you can modify it",
        type: "EXIST",
        code: 602,
      });

    const studentExist = await Students.findOne(
      { student_id },
      "student_id name"
    );
    // console.log(searchedSchool);
    if (!studentExist)
      return res
        .status(403)
        .json({ msg: "student not found", type: "NOT_EXIST", code: 603 });

    const savedAggr = await aggregate.save();
    // const {school_id,name} = savedSchool._doc;
    res.status(200).json({ msg: savedAggr, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// update a student agrregate
router.put("/aggregates/:student_id", async (req, res) => {
  const { score } = req.body;
  const { class_id, subject_id, session_id, term } = req.query;
  const { student_id } = req.params;

  try {
    if (term === 3) {
      const cumm = 0;
      // fetch all the aggregater records for the previous terms(1,2 and 3 if available)
      const allAggregates = await Aggregates.find({
        student_id,
        class_id,
        subject_id,
        session_id,
      });
      for (let i = 0; i < allAggregates.length; i++) {
        cumm += allAggregates[i]?.total_scores;
      }

      const updatedAggregate = await Aggregates.findOneAndUpdate(
        { student_id, class_id, subject_id, session_id, term: 3 },
        {
          $inc: { total_scores: score },
          cummulative: cumm + score,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        msg: updatedAggregate,
        type: "SUCCESS",
        code: 600,
      });
    } else {
      const updatedAggregate = await Aggregates.findOneAndUpdate(
        { student_id, class_id, subject_id, session_id, term },
        {
          $inc: { total_scores: score },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        msg: updatedAggregate,
        type: "SUCCESS",
        code: 600,
      });
    }
  } catch (error) {
    console.log("ERROR==>", error);
    res.status(503).json({
      msg: "An error occured",
      type: "FAILED",
      code: 601,
    });
  }
});

export default router;