import express from "express";
import getData from "../controllers/dbController";

const router = express.Router();

router.post("/getData", getData);

export default router;