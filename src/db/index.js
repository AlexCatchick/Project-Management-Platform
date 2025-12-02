import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to db");
    } catch (error) {
        console.log("Failed to connect to db", error);
        process.exit(1);
    }
}
export default connectDB;