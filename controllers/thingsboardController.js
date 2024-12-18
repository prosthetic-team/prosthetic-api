import { loginToThingsboard, getTelemetryData } from '../services/thingsboardService.js';

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
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const telemetryData = await getTelemetryData(deviceId, token);
        console.log(telemetryData['gyroscope-y'][0]['value']);
        res.status(200).json(telemetryData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener telemetría' });
    }
};