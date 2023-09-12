import express from 'express';
import cors from 'cors'
const app = express();

import dotenv from 'dotenv';
import dbConnect from './utils/dbConnect.js';
import authRoute from './routes/auth.js';
import schoolsRoute from './routes/schools.js'
import studentsRoute from './routes/students.js'
import trainersRoute from './routes/trainers.js'
import scoresRoute from './routes/scores.js'
import gradesRoute from './routes/grades.js';
import subjectsRoute from './routes/subjects.js';
import sessionRoute from './routes/session.js';
 

let PORT = process.env.PORT;

dotenv.config();
// ===connect to database
dbConnect();
// ===accept json files
app.use(express.json());
app.use(cors({credentials:true,origin:true}));
// ===register the routes
// app.use('/api/auth', authRoute);
app.use('/api/v1', schoolsRoute);
app.use('/api/v1', studentsRoute);
app.use('/api/v1', trainersRoute);
app.use('/api/v1', scoresRoute);
app.use('/api/v1', authRoute);
app.use('/api/v1', gradesRoute);
app.use('/api/v1', subjectsRoute);
app.use('/api/v1', sessionRoute);
 
app.listen(PORT, ()=>{
    console.log("Backend server is running on http://localhost:"+PORT)
}) 