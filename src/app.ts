import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status-codes";
import path from "path";
import { router } from "./routes/index";


const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bibah.app",
      "https://www.bibah.app",
      "https://admin.bibah.app",
      "https://www.admin.bibah.app",
      "https://api.bibah.app",
      "https://www.api.bibah.app",
      "http://localhost:5174",
      "http://localhost:5000",
      "https://bdapis.vercel.app/geo/v2.0",
      "https://sandbox.paystation.com.bd/initiate-payment",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "welcome to our Survey project server............",
  });
});


export default app;
