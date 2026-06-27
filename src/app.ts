import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status-codes";
import { router } from "./routes/index";
import './config/passport';

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());


app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "welcome to our Survey project server............",
  });
});


export default app;
