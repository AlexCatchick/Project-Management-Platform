import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthCheck from './routes/healthCheck.route.js';
import authRoutes from './routes/auth.route.js';
import projectRoutes from './routes/project.route.js';
import taskRoutes from './routes/task.route.js';
import noteRoutes from './routes/note.route.js';

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CROSS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/v1/healthcheck", healthCheck);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notes", noteRoutes);

app.get("/", (req, res) => {
    res.send("Project Camp API");
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        statusCode,
        message,
        success: false,
        errors: err.errors || []
    });
});

export default app;