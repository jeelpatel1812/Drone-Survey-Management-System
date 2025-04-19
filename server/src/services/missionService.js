import { simulateMission } from '../jobs/simulateMission.js';

export const startMissionSimulation = async (missionId) => {
  await simulateMission(missionId);
};
