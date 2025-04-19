import ApiResponse from '../utils/apiResponse.js'
import ApiError from '../utils/apiError.js'
import AsyncHandler from '../utils/asyncHandler.js'
import { Mission } from '../models/mission.model.js';
import jwt from 'jsonwebtoken';
import { startMissionSimulation } from '../services/missionService.js';
import { MissionLog } from '../models/missionLog.model.js';
import cron from "node-cron";
import { simulateMission } from '../jobs/simulateMission.js';

const createMissionController = AsyncHandler(async(req, res)=>{
  const {name, location, drone, scheduledTime, flightPath, status} = req.body;
  const isMissionExist = await Mission.findOne({name});
  if(isMissionExist) throw new ApiError(409, "Mission already exist with this name.");

  const mission = await Mission.create({
      name,
      location, 
      drone, 
      scheduledTime,
      flightPath,
      status
  });
  const createdMission = await Mission.findById(mission._id);
  if(!createdMission) throw new ApiError(500, "Something went wrong.");

  return res.json(new ApiResponse(201, createdMission, "Mission is created succesfully."))

});

const getMissionsController = AsyncHandler(async(req, res)=>{
    const missionList = await Mission.find({}).populate('drone', 'name');
    return res.json(new ApiResponse(201, missionList, "Mission list fetched succesfully."))
})

const startMissionController = async (req, res) => {
    const { id } = req.params;
    try {
      await startMissionSimulation(id);
      return res.json(new ApiResponse(200, {}, "Mission simulation started"))
    } catch (err) {
      return res.json(new ApiResponse(500, {}, err.message))
    }
};

const getRunningMissionsController = AsyncHandler(async(req, res)=> {
    const runningMissions = await Mission.find({ status: 'in-progress' }).populate('drone');
    return res.json(new ApiResponse(201, runningMissions, "Running mission list fetched succesfully."))
})

const getMissionLogsController  = AsyncHandler(async(req, res)=> {

  try {
    const { id } = req.params;

    const logs = await MissionLog.find({ missionId : id })
      .sort({ timestamp: 1 })

    return res.json(new ApiResponse(201, logs,  "Mission log fetched succesfully."))
  } catch (error) {
    console.error("Error fetching flight path:", error);
    return res.json(new ApiResponse(500, {}, err.message))
  }
})

cron.schedule("*/59 * * * * *", AsyncHandler(async(req, res)=>{
  const currentTime = new Date().toISOString();
  const missionToBeExecuted = await Mission.find({scheduledTime: { $lt: currentTime }});
  if(missionToBeExecuted.length==0) {
    console.log("No mission to execute at this time.");
    return
  }
  console.log(missionToBeExecuted)
  
  const runSimulations = async () => {
    try {
      await Promise.all(
        missionToBeExecuted.map(mission => simulateMission(mission._id))
      );
    } catch (error) {
      console.error("Error during simulation:", error);
    }
  };

  runSimulations();

}))

  

export {createMissionController, getMissionsController, startMissionController, getRunningMissionsController, getMissionLogsController};