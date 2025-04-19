import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import api from '../../api';
import L from 'leaflet';
import './DroneMap.css';

const DroneMap = ({ droneId }) => {
  const [flightPath, setFlightPath] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchFlightPath = async () => {
      try {
        const res = await api.get(`/missionLog/flightpath/${droneId}`);
        const data = res.data.data || [];
        setFlightPath(data.map(p => [p.lat, p.lng]));
        {console.log("check currentLocation0", data)}
        setCurrentLocation(data[data.length - 1]);
      } catch (err) {
        console.error("Error fetching flight path", err);
      }
    };

    fetchFlightPath();
    const interval = setInterval(fetchFlightPath, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [droneId]);

  return (
    <div className="drone-map-container">
      <MapContainer
        center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [0, 0]}
        zoom={13}
        scrollWheelZoom={true}
        className="drone-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {flightPath.length > 1 && <Polyline positions={flightPath} color="blue" />}

        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={droneIcon}
          >
            <Popup>
              <b>Drone Live Location</b>
              <br />
              Lat: {currentLocation.lat}
              <br />
              Lng: {currentLocation.lng}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

const droneIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190294.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default DroneMap;
