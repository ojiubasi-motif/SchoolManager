import Auth from "../models/Auth.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = express.Router();

// login===NB:you can login with either your email or phone
router.post("/auth/login", async (req, res) => {
  
});

export default router;