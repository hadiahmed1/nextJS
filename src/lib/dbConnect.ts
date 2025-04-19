import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
    if (connection.isConnected) {//checking if connection exists
        console.log("Already connected to DB");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed");
        process.exit(1);
    }
}

export default dbConnect;