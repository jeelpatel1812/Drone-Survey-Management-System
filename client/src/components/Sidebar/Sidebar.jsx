import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
    { label: "Fleet Inventory", path: "/fleet" },
    { label: "Mission Planner", path: "/missionPlanner" },
    { label: "Real-time Monitoring", path: "/monitor" },
    { label: "Reports", path: "/reports" },
];

const Sidebar = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClickCategory = (e, path) => {
        console.log("check category", path);
        e.preventDefault();
        navigate(`${path}`);
    };

    return (
        <div className="sidebar">
            <ul className="sidebar-list">
                {navItems.map(item => (
                    <li key={item.path} 
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={(e) => handleClickCategory(e, item.path)}
                    >
                        <span className="sidebar-text">{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
