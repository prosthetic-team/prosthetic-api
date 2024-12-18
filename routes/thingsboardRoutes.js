import express from 'express';
import { login, fetchTelemetry } from '../controllers/thingsboardController.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Telemetry data route
router.get('/telemetry/:deviceId', fetchTelemetry);

export default router;