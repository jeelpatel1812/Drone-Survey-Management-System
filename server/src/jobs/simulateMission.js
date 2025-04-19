import {Mission} from '../models/mission.model.js';
import {Drone} from '../models/drone.model.js';
import {MissionLog} from '../models/missionLog.model.js';
import {Report} from '../models/report.model.js';

import {
  SIMULATION_INTERVAL,
  BATTERY_DRAIN_PER_STEP,
  COVERAGE_AREA_DEFAULT
} from '../constants.js';

const runningSimulations = new Map();

export const simulateMission = async (missionId) => {
  const mission = await Mission.findById(missionId);
  if (!mission) throw new Error('Mission not found');
  if (mission.status == 'completed') throw new Error('Mission already started or completed');

  const drone = await Drone.findById(mission.drone);
  if (!drone) throw new Error('Drone not found');

  mission.status = 'in-progress';
  mission.progress = 0;
  mission.scheduledTime = new Date();
  await mission.save();

  drone.status = 'in-mission';
  await drone.save();

  const flightPath = mission.flightPath || [];
  let index = 0;

  console.log(`[Simulation] Mission ${mission._id} started.`);


  if (runningSimulations.has(missionId)) {
    console.log(`Simulation already running for mission ${missionId}`);
    return;
  }

  const simulationInterval = setInterval(async () => {
    try {
      // Complete mission
      if (index >= flightPath.length) {
        mission.status = 'completed';
        mission.progress = 100;
        await mission.save();

        drone.status = 'available';
        await drone.save();

        const existingReport = await Report.findOne({ missionId: mission._id });
        if (!existingReport) {
          await Report.create({
            missionId: mission._id,
            mission: mission.name,
            droneId: drone._id,
            startTime: mission.scheduledTime,
            endTime: new Date(),
            duration: Math.round((Date.now() - new Date(mission.scheduledTime)) / 1000),
            distance: calculateTotalDistance(flightPath),
            coverageArea: COVERAGE_AREA_DEFAULT,
            batteryConsumption : index * BATTERY_DRAIN_PER_STEP,
            status: mission.status,
            summary: `${mission.name} completed successfully.`
          });
        }

        console.log(`[Simulation] Mission ${mission._id} completed.`);
        clearInterval(simulationInterval);
        runningSimulations.delete(missionId);
        return;
      }

      const waypoint = flightPath[index];
      const lat = waypoint.lat;
      const lng = waypoint.lng;
      
      drone.location = waypoint;
      drone.path.push({ lat, lng, timestamp: new Date() });
      drone.batteryLevel = Math.max(0, drone.batteryLevel - BATTERY_DRAIN_PER_STEP);
      drone.lastPinged = new Date();
      await drone.save();

      mission.progress = Math.round(((index + 1) / flightPath.length) * 100);
      await mission.save();

      // Log data
      const data = await MissionLog.create({
        missionId: mission._id,
        droneId: drone._id,
        batteryLevel: drone.batteryLevel,
        timestamp: new Date(),
        latitude: waypoint.lat,
        longitude: waypoint.lng,
        altitude: waypoint.altitude || mission.altitude,
        processedData: `fetching data - ${index}`
      });

      io.emit('simulation-start', { log: data });

      console.log(`[Simulation] Mission ${mission._id} progressed to waypoint ${index + 1}/${flightPath.length}`);
      index++;
    } catch (err) {
      console.error(`[Simulation] Error in mission ${mission._id}:`, err.message);
      clearInterval(simulationInterval);
      runningSimulations.delete(missionId);
    }
  }, SIMULATION_INTERVAL);
  runningSimulations.set(missionId, simulationInterval);
};

const calculateTotalDistance = (path) => {
  if (path.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].lat - path[i - 1].lat;
    const dy = path[i].lng - path[i - 1].lng;
    total += Math.sqrt(dx ** 2 + dy ** 2) * 111000;
  }
  return Math.round(total);
};
