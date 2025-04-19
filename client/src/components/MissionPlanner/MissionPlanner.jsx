import { useEffect, useState } from 'react';
import api from '../../api'
import './MissionPlanner.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MissionPlanner() {
    const [missions, setMissions] = useState([]);
    const [drones, setDrones] = useState([]);
    const [filter, setFilter] = useState("All");
    const [form, setForm] = useState({ name: '', drone: '', status: "", latitude:"", longitude: "", flightPath: [], scheduledTime: ''});
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => { 
      try{
        api.get('/mission/list')
            .then(res => setMissions(res.data.data || res.data))
            .catch(err => console.log(err))
      }
      catch(err){
        console.log(err);
      }
        
      try{
        api.get('/drone/list')
        .then(res => setDrones(res.data.data || res.data))
        .catch(err => console.log(err))
      }
      catch(err){
        console.log(err);
      }
        
    }, []);
      
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };
    
    const handleCreateMission = async (e) => {
      e.preventDefault();

      try{
        const res = await api.post('/mission/create', {
          ...form,
          flightPath: JSON.parse(form.flightPath),
          location: [form.latitude, form.longitude],
        });
        if(res){
          setIsModalOpen(false);
          setMissions([...missions, { ...form,
            flightPath: JSON.parse(form.flightPath),
            location: [form.latitude, form.longitude] }]);
          toast.success("Mission created successfully!");
          setForm({})
        }
      }
      catch(err){
        console.log(err)
      }

      
    };

    const handleStartSimulation = (missionId) => {
      try{
        const response = api.patch(`/mission/startMission/${missionId}`)
        .then(res => setDrones(res.data.data || res.data)); 

        if(response) toast.success("Mission started successfully!");
      }
      catch(err){
        console.log(err);
      }
    }

    const missionStatus = [
      {name: 'scheduled', value:'scheduled'},
      {name: 'pending', value:'pending'},
      {name: 'in-progress', value:'in-progress'},
      {name: 'completed', value:'completed'},
      {name: 'failed', value:'failed'},

    ]


    const filteredMissions = filter === "All" ? missions : missions.filter(d => d.status === filter);
    return (
      <div className="misson-container">
      <div className="misson-header">
        <h2 className="misson-title">Mission Dashboard</h2>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Create Mission</button>
      </div>

      <div className="misson-filters">
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Mission</h3>
            <form onSubmit={handleCreateMission} className="modal-form">
              <input type="text" name="name" placeholder="Mission Name" value={form.name} onChange={handleChange} required />
              <select className="border p-2" name="drone" onChange={handleChange} required>
                <option>Select Drone</option>
                {drones.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <select className="border p-2"name="status"  onChange={handleChange} required>
                <option>Select Status</option>
                {missionStatus.map(d => <option key={d.value} value={d.value}>{d.name}</option>)}
              </select>
              <input
                name="latitude" 
                type="number"
                placeholder="Latitude"
                value={form.latitude} 
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="longitude"
                placeholder="Longitude"
                value={form.longitude} 
                onChange={handleChange}
                required
              />
              <input type="datetime-local" name="scheduledTime" placeholder="Schedule time"  value={form.scheduledTime} onChange={handleChange} required />
              <div className="input-with-tooltip">
                <input type="text" name="flightPath" className="input-tooltip" placeholder="Flight Path"  value={form.flightPath} onChange={handleChange} required />
                <div class="tooltip-container">
                  <span class="info-icon">ℹ️</span>
                  <div className="tooltip-text">
                    <p><strong>Info:</strong> Please add flight path like:</p>
                    <code>
                      {`[
                        { "lat": 22.7196, "lng": 75.8577, "altitude": 100 },
                        { "lat": 22.7198, "lng": 75.8580, "altitude": 100 }
                      ]`}
                    </code>
                  </div>
                </div>
              </div>
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
            <th>Status</th>
            <th>Drone</th>
            <th>Location</th>
            <th>FlightPath Length</th>
            <th>Scheduled Time</th>
            <th>Simulation</th>
          </tr>
        </thead>
        <tbody>
          {filteredMissions.map(d => {
            const date = new Date(d.scheduledTime);
            const dateOnly = date.toLocaleDateString();
            const timeOnly = date.toLocaleTimeString();
            return (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.status}</td>
              <td>{d.drone?.name}</td>
              <td>{d.location[0]}, {d.location[1]}</td>
              <td>{d.flightPath?.length}</td>
              <td>{dateOnly} at {timeOnly}</td>
              {
                d.status == "in-process" ? 
                <td><button type="button" onClick={() => handleStartSimulation(d._id)} >Processing</button></td> : 
                (
                  d.status == "completed" ? 
                  <td><button type="button" disabled = {true} onClick={()=>{}} >Completed</button></td> : 
                  <td><button type="button" onClick={() => handleStartSimulation(d._id)} >Start Now</button></td>
                )
                
              }
            </tr>
          )})}
        </tbody>
      </table>
      <ToastContainer />
    </div>
    );
  }