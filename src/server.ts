import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./route.js";
import { errorHandler } from "@middlewares/error.middleware";
import { CONSTANT } from "@config/constants.config";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(helmet()); // security - set http headers
app.use(express.json());
app.use(morgan("dev")); // logger

app.use("/api", router);
app.get("*", (_req:Request, res:Response) => res.json({ message: "Not Found" }));

app.use(errorHandler);

mongoose
  .connect(CONSTANT.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    app.listen(CONSTANT.PORT, () => {
      console.log(`Server running on :http://localhost:${CONSTANT.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo error", err);
    process.exit(1);
  });
