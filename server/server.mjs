import express from 'express';
import AuthRouter from './Route/authRouter.mjs';
import cors from 'cors';  // Import the cors module
import dotenv from 'dotenv';  // To load environment variables
import CoOrdinatorRouter from './Route/coOrdinatorRouter.mjs'
import StudentRouter from './Route/studentRouter.mjs';
import CampusRouter from './Route/campusRouter.mjs';
import AttendanceRouter from './Route/attendanceRouter.mjs';
import SubAdminRouter from './Route/subAdminRouter.mjs'
import SkillRouter from './Route/skillsRoute.mjs'
import JwtOperation from './Utils/jwtoken.mjs'
import pyqRouter from './Route/pyqRouter.mjs';
import notificationRoute from './Route/notificationRouter.mjs';

dotenv.config();

const app = express();


// JSON Parsing Middleware
app.use(express.json());


app.use(cors({
    // origin: "http://localhost:3000",
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {

    if (req.path.startsWith('/api/auth')) {
        // Skip JWT verification for /api/auth routes
        return next();
    }

    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = JwtOperation.verifyToken(token);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    next();
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Routes
app.use('/api/auth', AuthRouter);

app.use('/api/coordinator',CoOrdinatorRouter)

app.use("/api/subadmin",SubAdminRouter)

app.use("/api/student/",StudentRouter)

app.use("/api/campus/",CampusRouter)

app.use("/api/attendance",AttendanceRouter)

app.use("/api/skill",SkillRouter)

app.use("/api/pyq",pyqRouter)

app.use("/api/notification",notificationRoute)

app.listen(5000, '0.0.0.0');


