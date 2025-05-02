import express from "express";
import { dbFirebase } from "../model/firebase.js";
import { push, ref, set } from "firebase/database";
import dotenv from "dotenv";
import { PostLocation } from "../controller/apiController.js";
dotenv.config();

const router = express.Router();

// POST LOCATION
router.post("/", PostLocation);

export default router;