import express from 'express';
import { login, fetchTelemetry, fetchDevices, getMovingHours, isActive } from '../controllers/thingsboardController.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Telemetry data route
router.get('/telemetry/:deviceId', fetchTelemetry);

// Devices(1 de momento) route
router.get('/devices/:deviceId', fetchDevices);

router.get('/movinghours/:deviceId', getMovingHours);

router.get('/isactive/:deviceId', isActive);

export default router;