import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import MissionPlanner from './components/MissionPlanner/MissionPlanner';
import FleetDashboard from './components/FleetDashBoard/FleetDashBoard';
import ReportSurvey from './components/ReportSurvey/ReportSurvey';
import 'leaflet/dist/leaflet.css';
import MissionMonitor from './components/MissionMonitor/MissionMonitor';

function App() {
  return (
    <div className="App">
      <Router>
      <div style={{ display: 'flex' }}>
        {/* Sidebar always visible */}
        <Sidebar />

        {/* Main content changes with route */}
        <div style={{ flex: 1, padding: '16px', marginLeft: '240px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/fleet" replace />} />
            <Route path="/fleet" element={<FleetDashboard />} />
            <Route path="/missionPlanner" element={<MissionPlanner />} />
            <Route path="/monitor" element={<MissionMonitor />} />
            <Route path="/reports" element={<ReportSurvey />} />
          </Routes>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default App;
