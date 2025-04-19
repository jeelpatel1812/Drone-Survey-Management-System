import { Router } from "express";
import {addDroneController, getDronesController} from "../controllers/drone.controller.js";

const router = Router();

router.route("/add").post(addDroneController)
router.route("/list").get(getDronesController)

export default router
