import { configDotenv } from "dotenv";
configDotenv({ path: ".env" });
import app from './app.js';
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8080;
const weblink = process.env.NODE_ENV === 'production'
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'your-app.onrender.com'}`
    : `http://localhost:${PORT}`;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Access at: ${weblink}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error", err);
        process.exit(1);
    });