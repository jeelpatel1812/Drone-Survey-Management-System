import React, { useEffect, useState, useRef } from 'react';
import './LogViewer.css';
import api from '../../api';
import io from 'socket.io-client';

const LogViewer = ({ missionId, status }) => {
  const [logs, setLogs] = useState([]);
  const socket = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    socket.current = io('ws://localhost:3001', {
      transports: ['websocket'],
    });

    socket.current.on('simulation-start', (data) => {
      console.log("Socket live data: ", data.log);
      setLogs((prevLogs) => [...prevLogs, data.log]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <>
    <h3 className="log-title">Real-time logs</h3>
    <div className="mission-log-container">
      <div className="log-header">
        {/* <span>Mission Id</span> */}
        <span>Time</span>
        <span>Message</span>
        <span>Latitude</span>
        <span>Longitude</span>
        <span>Altitude</span>
        <span>Battery Status</span>
      </div>
      <ul className="log-list">
        {logs.filter(log => log.missionId == missionId).map((log, index) => {
          
          const date = new Date(log.createdAt);
          const dateOnly = date.toLocaleDateString();
          const timeOnly = date.toLocaleTimeString();
          return (
            <li key={index} className="log-item">
            {/* <span>{log.missionId}</span> */}
            <span>{dateOnly} at {timeOnly}</span>
            <span>{log.processedData}</span>
            <span>{log.latitude}</span>
            <span>{log.longitude}</span>
            <span>{log.altitude}</span>
            <span>{log.batteryLevel}</span>
          </li>
        )})}
      </ul>
      <div ref={logEndRef} />
    </div>
    </>
  );
};

export default LogViewer;
