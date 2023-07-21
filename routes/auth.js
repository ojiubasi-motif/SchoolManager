import express from "express";
import Trainers from "../models/Trainers.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = express.Router();

// login===NB:you can login with either your email or phone
router.post("/auth/login", async (req, res) => {
  const { user, password } = req.body;
  try {
    // check the kind of input supplied by the user for login
    const userData =
      user.toString().search("@") >= 0
        ? await Trainers.findOne({ email: user })
        : await Trainers.findOne({ trainer_id: user });

    if (!userData) {
      res.status(401).json({msg:"wrong login credentials, couldn't login",type:"NOT_EXIST",code:603});
    } else {
      const bytes = CryptoJS.AES.decrypt(
        userData.password,
        process.env.PW_CRYPT
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (originalPassword !== password) {
        res.status(401).json({msg:"wrong login credentials, couldn't login",type:"WRONG_OR_MISSING_PAYLOAD",code:605});
      } else {
        
        // send a unique secret token for loggedin user
        const accessToken = jwt.sign(
          {
            school_id:userData?.school_id,
            first_name: userData?.first_name,
            last_name: userData?.last_name,
            email: userData?.email,
            trainer_id: userData?.trainer_id, 
          },
          process.env.PW_CRYPT,
          { expiresIn: "1d" }
        );
        //do not include the password when sending query response
        const { password: dbPword, ...data } = userData._doc;
        res.status(200).json({msg:{ ...data, accessToken }, type:"SUCCESS",code:600});
      }
    }
  } catch (err) {
    res.status(500).json({msg:err,type:"FAILED",code:602});
  }
});

export default router;