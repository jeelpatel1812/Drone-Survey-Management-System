import ApiResponse from '../utils/apiResponse.js'
import ApiError from '../utils/apiError.js'
import AsyncHandler from '../utils/asyncHandler.js'
import { MissionLog } from '../models/missionLog.model.js';
import jwt from 'jsonwebtoken';

const generateMissionLogController = AsyncHandler(async(req, res)=>{
  const {mission, batteryLevel, altitude, latitude, longitude, status, message,} = req.body;
  
  const missionLog = await MissionLog.create({
    mission,
    batteryLevel,
    altitude,
    latitude,
    longitude,
    status,
    message,
  });
  const createdMissionLog = await MissionLog.findById(missionLog._id);
  if(!createdMissionLog) throw new ApiError(500, "Something went wrong.");

  return res.json(new ApiResponse(201, createdMissionLog, "Mission log is created succesfully."))

});

const getMissionLogsController = AsyncHandler(async(req, res)=>{
    const missionList = await MissionLog.find({});
    return res.json(new ApiResponse(201, missionList, "Mission log list fetched succesfully."))
})

const getLoggedFlightPath = AsyncHandler(async(req, res)=> {
  try {
    const { droneId } = req.params;

    const logs = await MissionLog.find({ droneId })
      .sort({ timestamp: 1 })
      .select('latitude longitude -_id');

    console.log("check logss", logs)
    const formattedLogs = logs.map(log => ({
      lat: log.latitude,
      lng: log.longitude,
      timestamp: log.timestamp,
    }));

    return res.json(new ApiResponse(201, formattedLogs, "Mission log list fetched succesfully."))
  } catch (error) {
    console.error("Error fetching flight path:", error);
    res.status(500).json({ error: 'Server error' });
  }
})

export {generateMissionLogController, getMissionLogsController, getLoggedFlightPath};