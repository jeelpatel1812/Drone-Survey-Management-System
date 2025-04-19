import {app, server} from './app.js';
import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config();
const Port = process.env.PORT || 4001;

connectDB().
then(()=>{
    server.listen(Port, () => {
        console.log(`listening at port ${Port}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection error.", err);
})