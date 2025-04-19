import { Router } from "express";
import {getReportSurveyController} from "../controllers/report.controller.js";

const router = Router();

router.route("/list").get(getReportSurveyController)

export default router
