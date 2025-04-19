import express from 'express';
import cors from 'cors';
import http from 'http';
import {limiter} from './middlewares/rate-limit.middleware.js'
import {Server} from 'socket.io';


const app = express();
const server = http.createServer(app);
const io = new Server(server);
global.io = io; 

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (msg) => {
    console.log('Received message from client:', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credential: true 
    })
)
//common middleware
app.use(express.urlencoded({limit: "16kb", extended: true}));
app.use(express.json({limit: "16kb"}));
app.use(express.static("public"));
app.use(limiter);



// routes
import droneRoute from './routes/drone.route.js';
import missionRoute from './routes/mission.route.js';
import reportRoute from './routes/report.route.js';
app.use("/api/v1/mission", missionRoute);
app.use("/api/v1/drone", droneRoute);
app.use("/api/v1/report", reportRoute);

export {app, server}