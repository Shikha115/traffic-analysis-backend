import express from 'express';
const router = express.Router();
import TrafficRoute from "@routes/traffic.route"

router.use("/traffic", TrafficRoute);

export default router;
