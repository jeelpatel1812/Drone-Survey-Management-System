import ApiResponse from '../utils/apiResponse.js'
import ApiError from '../utils/apiError.js'
import AsyncHandler from '../utils/asyncHandler.js'
import { Drone } from '../models/drone.model.js';
import jwt from 'jsonwebtoken';

const addDroneController = AsyncHandler(async(req, res)=>{
  const {name, model, status, batteryLevel} = req.body;
  if([name, model, status].some((field)=>{field.trim() === ""})){
      throw new ApiError(400, "All field are required.")
  }

  
  const drone = await Drone.create({
      name,
      model,
      status,
      batteryLevel
  });
  const createdDrone = await Drone.findById(drone._id);
  if(!createdDrone) throw new ApiError(500, "Something went wrong.");

  return res.json(new ApiResponse(201, createdDrone, "Drone is created succesfully."))

});

const getDronesController = AsyncHandler(async(req, res)=>{
    const droneList = await Drone.find({});
    return res.json(new ApiResponse(201, droneList, "Drone list fetched succesfully."))
})

export {addDroneController, getDronesController};