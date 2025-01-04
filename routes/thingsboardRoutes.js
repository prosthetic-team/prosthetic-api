import express from 'express';
import { login, fetchTelemetry, fetchDevices } from '../controllers/thingsboardController.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Telemetry data route
router.get('/telemetry/:deviceId', fetchTelemetry);

// Devices(1 de momento) route
router.get('/devices/:deviceId', fetchDevices);

//agregar ruta para obtener el historial diario de tiempo activo de un dispositivo durante un día

export default router;