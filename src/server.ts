import { createServer } from "http";
// import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import envVars from "./config/envars";

dotenv.config();

const port = envVars.PORT || 5001;
const dbUrl = envVars.DB_URL;

const httpServer = createServer(app);


const startServer = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Database connected successfully");

        const numericPort = typeof port === 'string' ? parseInt(port, 10) : port;

        httpServer.listen(numericPort, '0.0.0.0', () => {
            console.log(`Server running on port : ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};




(async () => {
    startServer();
})();

// (async () => {
//     await seedSuperAdmin();
// })();
