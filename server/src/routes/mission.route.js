import { Router } from "express";
import {createMissionController, getMissionsController, startMissionController, getRunningMissionsController, getMissionLogsController} from "../controllers/mission.controller.js";

const router = Router();

router.route("/create").post(createMissionController)
router.route("/list").get(getMissionsController)
router.route("/getAllRunning").get(getRunningMissionsController)
router.route("/startMission/:id").patch(startMissionController)
router.route("/getMissionLogs/:id").get(getMissionLogsController)

export default router
