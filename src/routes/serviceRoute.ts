import express from "express";
import getData from "../controllers/dbController";
import askOpenAI from "../controllers/openAIController";

const router = express.Router();

router.post("/teste", askOpenAI);
router.get("/db", getData);

export default router;