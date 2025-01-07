import { loginToThingsboard, getTelemetryData, getDevices, calculateMovingHours, getDeviceState } from '../services/thingsboardService.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await loginToThingsboard(username, password);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el login de Thingsboard' });
    }
};

export const fetchTelemetry = async (req, res) => {
    const { deviceId } = req.params;
    const token = req.headers['authorization']?.split(' ')[1];
    const { keys } = req.query;
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    try {
        const telemetryData = await getTelemetryData(deviceId, keys, token);
        res.status(200).json(telemetryData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener telemetría' });
    }
};

export const getMovingHours = async (req, res) => {
    const { deviceId } = req.params;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const movingHours = await calculateMovingHours(deviceId, token);
        res.status(200).json(movingHours);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al calcular horas de movimiento' });
    }
};

export const fetchDevices = async (req, res) => {
    const { deviceId } = req.params;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    try {
        const devices = await getDevices(deviceId, token);
        res.status(200).json(devices);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener dispositivos' });
    }
}

export const isActive = async (req, res) => {
    const { deviceId } = req.params;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    try {
        const deviceState = await getDeviceState(deviceId, token);
        res.status(200).json(deviceState);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener estado del dispositivo' });
    }
}
