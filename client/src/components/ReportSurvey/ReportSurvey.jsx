import React, { useEffect, useState, useRef } from 'react';
import api from '../../api';
import './ReportSurvey.css';

const ReportSurvey = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const popupRef = useRef();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/report/list');
        if (res.data && res.data.data.length > 0) {
          setReports(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const fetchLogs = async (missionId) => {
    try {
      const id = missionId;
      const res = await api.get(`mission/getMissionLogs/${id}`);
      setLogs((prev) => [...prev, ...res.data.data]);
      console.log("logs", res.data.data)
    } catch (err) {
      console.log("API error:", err);
    }
  };

  const handleOpenLogsData = (missionId) => {
    fetchLogs(missionId);
    setIsModalOpen(true);
  }

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      setIsModalOpen(false);
    }
  };

  if (loading) return <div className="report-container">Loading reports...</div>;
  if (!reports.length) return <div className="report-container">No reports available</div>;

  return (
    <>
       {isModalOpen && <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal popup-content">
            <h3>Log data</h3>
            <table className="popup-table">
              <thead>
                <tr>
                  <th>createdAt</th>
                  <th>latitude</th>
                  <th>longitude</th>
                  <th>altitude</th>
                  <th>processedData</th>
                  <th>batteryLevel</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => {
                  const date = new Date(log.createdAt);
                  const dateOnly = date.toLocaleDateString();
                  const timeOnly = date.toLocaleTimeString();
                  return (
                  <tr key={index}>
                    <td>{dateOnly} at {timeOnly}</td>
                    <td>{log.latitude}</td>
                    <td>{log.longitude}</td>
                    <td>{log.altitude}</td>
                    <td>{log.processedData}</td>
                    <td>{log.batteryLevel}</td>
                  </tr>
                )})}
              </tbody>
            </table>
            <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Okay</button>
              </div>
          </div>
        </div>
      }
      <div className="report-container">
        <h2 className="report-title">Survey Reports</h2>
        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Mission Name</th>
                <th>Drone Name</th>
                <th>Drone Model</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Distance (km)</th>
                <th>Battery Used (%)</th>
                <th>Survey Area (sq.km)</th>
                <th>Logs</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.mission}</td>
                  <td>{report.droneId.name}</td>
                  <td>{report.droneId.model}</td>
                  <td>{new Date(report.startTime).toLocaleString()}</td>
                  <td>{new Date(report.endTime).toLocaleString()}</td>
                  <td>{report.status}</td>
                  <td>{report.distance}</td>
                  <td>{report.batteryConsumption}</td>
                  <td>{report.coverageArea}</td>
                  {
                    report.status == 'completed'?
                    <td><button type="button" onClick={() => handleOpenLogsData(report.missionId)} >Get</button></td> : 
                    <td><button type="button" disabled={true} onClick={() => {}} >Not available</button></td> 
                  }
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReportSurvey;
