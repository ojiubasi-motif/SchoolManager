import express from 'express';
const app = express();

import dotenv from 'dotenv';
import dbConnect from './utils/dbConnect.js';
// import authRoute from './routes/auths.js';
import schoolsRoute from './routes/schools.js'
import studentsRoute from './routes/students.js'
import trainersRoute from './routes/trainers.js'
import scoresRoute from './routes/scores.js'

let PORT = process.env.PORT;

dotenv.config();
// ===connect to database
dbConnect();
// ===accept json files
app.use(express.json());
// ===register the routes
// app.use('/api/auth', authRoute);
app.use('/api/v1', schoolsRoute);
app.use('/api/v1', studentsRoute);
app.use('/api/v1', trainersRoute);
app.use('/api/v1', scoresRoute);


app.listen(PORT, ()=>{
    console.log("Backend server is running on http://localhost:"+PORT)
})