import api from '../../api'
import { useEffect, useState } from 'react';
import './FleetDashBoard.css';

export default function FleetDashboard() {
    const [drones, setDrones] = useState([]);
    const [newDrone, setNewDrone] = useState({
      name: '',
      status: 'available',
      batteryLevel: '',
      location: { lat: '', lng: '' },
    });
    const [filter, setFilter] = useState("All");
    const [status, setStatus] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewDrone({ ...newDrone, [name]: value });
    };

    const handleAddDrone = async(e) => {
      e.preventDefault();

      const token = localStorage.getItem('accessToken');
      try{
        const response = await api.post('/drone/add',
          {
            name: newDrone.name,
            model: newDrone.model,
            status: newDrone.status,
            batteryLevel: newDrone.batteryLevel,
          },
          {
            headers: {
                Authorization: `Bearer ${token}`
            },
          });

          if(response){
            setDrones([...drones, { ...newDrone }]);
            setNewDrone({ name: '', status: 'available', batteryLevel: '', name: '' });
          }
          
      }
      catch(err){
        console.log(err);
      }
      finally{
        setIsModalOpen(false);
      }
    };

    useEffect(() => { 
        try{
            api.get('/drone/list')
            .then(res => setDrones(res.data.data || res.data))
            .catch(err => console.log(err))
        }
        catch(err){
            console.log(err);
        }
    }, []);

    const filteredDrones = filter === "All" ? drones : drones.filter(d => d.status === filter);


    return (
      <div className="fleet-container">
      <div className="fleet-header">
        <h2 className="fleet-title">Fleet Dashboard</h2>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Drone</button>
      </div>

      <div className="fleet-filters">
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="available">Available</option>
          <option value="in-mission">In-Mission</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Drone</h3>
            <form onSubmit={handleAddDrone} className="modal-form">
              <input type="text" name="name" placeholder="Drone Name" value={newDrone.name} onChange={handleChange} required />
              <input type="text" name="model" placeholder="Drone Model" value={newDrone.model} onChange={handleChange} required />
              <input type="number" name="batteryLevel" placeholder="Battery (%)"  min={1} max={100}  value={newDrone.batteryLevel} onChange={handleChange} required />
              <select type="text" name="status" placeholder="Status" value={newDrone.status} onChange={handleChange} required>
                <option value="available">Available</option>
                <option value="in-mission">In-Mission</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
              <div className="modal-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="drone-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Model</th>
            <th>Status</th>
            <th>Battery</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrones.map(d => (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.model}</td>
              <td className={`status-${d.status.toLowerCase()}`}>{d.status}</td>
              <td>{d.batteryLevel}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  }