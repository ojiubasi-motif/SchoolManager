import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// create a session
router.post("/sessions", async (req, res) => {
  const {estimated_start, estimated_end, start, end } = req.body;
  //   const {} = req.user;
  const id = "" + Math.floor(Math.random() * 10000 + 1);

  const es_start = new Date(estimated_start)?.getFullYear();
  const es_end = new Date(estimated_end)?.getFullYear();

  if (es_end - es_start < 0) {
    return res
      .status(403)
      .json({
        msg: "end date must be greater than start date",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });
  }else if(es_end - es_start > 1){
    return res
      .status(403)
      .json({
        msg: "difference between end date & start date must NOT be more than 1year ",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });
  }

  const sessionData = new Session({
    session_id: id,
    title: `${es_start}/${es_end}`,
    estimated_start,
    estimated_end,
    start,
    end,
  });

  try {
    const checkForSession = await Session.findOne({title:`${es_start}/${es_end}`});
    if(checkForSession){
        return res
      .status(403)
      .json({
        msg: "this session has been created already",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });
    }

    const saved = await sessionData.save();
    res.status(200).json({ msg: saved, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// get all sessions
router.get("/sessions", async (req, res) => {
  try {
    const allSessions = await Session.find().select("-createdAt -updatedAt");
    res.status(200).json({ msg: allSessions, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

// get a session
router.get("/sessions/:session_id", async (req, res) => {
    const {session_id} = req.params;
    if([null, undefined, "", {}, []].includes(session_id)){
        return res
      .status(403)
      .json({
        msg: "enter a valid session id",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });
    }
  try {
    const session = await Session.findOne({session_id}).select("-createdAt -updatedAt");
    res.status(200).json({ msg: session, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: error, type: "FAILED", code: 601 });
  }
});

export default router;