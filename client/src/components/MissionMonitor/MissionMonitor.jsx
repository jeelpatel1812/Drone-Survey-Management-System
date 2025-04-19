import React, { useEffect, useState } from 'react';
import api from '../../api';
import DroneMap from '../DroneMap/DroneMap';
import './MissionMonitor.css';
import LogViewer from '../LogViewer/LogViewer';

const MissionMonitor = () => {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await api.get('/mission/getAllRunning');
        setMissions(res.data.data);
        if (res.data.data.length) setSelectedMission(res.data.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMissions();
  }, []);

  return (
    <div className="mission-monitor-container">
      <aside className="mission-log-panel">
        <h3 className="panel-title">Live Missions</h3>
        <ul className="mission-list">
          {missions.length > 0 &&
            missions.map(m => (
              <li
                key={m._id}
                className={`mission-item ${selectedMission?._id === m._id ? 'selected' : ''}`}
                onClick={() => setSelectedMission(m)}
              >
                <span className="mission-name">{m.name || `Mission ${m._id}`}</span>
                <span className="drone-name">{m.drone?.name}</span>
              </li>
            ))}
        </ul>
      </aside>

      <main className="map-log-panel">
        {selectedMission != null ? (
          <>
            {/* <DroneMap droneId={selectedMission?.drone?._id} /> */}
            <LogViewer missionId={selectedMission._id} status={selectedMission.status} />
          </>
        ) : (
          <p className="map-placeholder">Select a mission to view flight path and logs</p>
        )}
      </main>
    </div>
  );
};

export default MissionMonitor;
