import express from 'express';
import {
    getDevicesAvailable,
    getDeviceById
} from '../controllers/deviceController.js';

const router = express.Router();

// Obtener todos los dispositivos (incluyendo los no disponibles)
//router.get('/', getDevices);

// Obtener dispositivos disponibles (excluyendo los "no disponibles")
router.get('/available', getDevicesAvailable);

// Asignar un dispositivo a un paciente y marcarlo como "no disponible"
//router.post('/assign', assignDeviceToPacient);

// Actualizar el estado de un dispositivo (por ejemplo, "no disponible")
//router.put('/update-state', updateDeviceState);

// Obtener un dispositivo por ID
router.get('/:id', getDeviceById);

export default router;
