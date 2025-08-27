
import { getTraffic } from "@src/controllers/traffic.controller";
import { Router } from "express";

const router = Router();

router.get("/", getTraffic);

export default router;
