import ApiResponse from '../utils/apiResponse.js'
import ApiError from '../utils/apiError.js'
import AsyncHandler from '../utils/asyncHandler.js'
import { Report } from '../models/report.model.js';

const getReportSurveyController = AsyncHandler(async(req, res)=>{
    const reportSurvey = await Report.find().populate('droneId');
    console.log("check report data", reportSurvey);
    if(!reportSurvey) throw new ApiError(500, "Something went wrong.");
    return res.json(new ApiResponse(201, reportSurvey, "Report survey fetched succesfully."))
})
  

export {getReportSurveyController};