import { getAvailableDevices, getDevicesFromThingsBoard } from '../services/deviceService.js';


// Obtener dispositivos disponibles (excluyendo los "no disponibles")
export const getDevicesAvailable = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token, "token desde getDevicesAvailable controller")
    if (!token) {
        return res.status(400).json({ message: 'Token de autenticación no proporcionado en controller disponibles' });
    }
    try {
        const devices = await getAvailableDevices(token);
        res.status(200).json(devices);
    } catch (error) {
        console.error('Error al obtener dispositivos disponibles:', error.message);
        res.status(500).json({ message: 'Error al obtener dispositivos disponibles' });
    }
};

// Obtener dispositivo por ID
export const getDeviceById = async (req, res) => {
    const deviceId = req.params.id;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token de autenticación no proporcionado en controller por id' });
    }

    try {
        // Llamamos al servicio para obtener el dispositivo
        const device = await getDevicesFromThingsBoard(token);

        // Si no se encuentra el dispositivo, respondemos con 404
        if (!device || device.id !== deviceId) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }

        res.status(200).json(device);
    } catch (error) {
        console.error('Error al obtener el dispositivo:', error.message);
        res.status(500).json({ message: 'Error al obtener el dispositivo' });
    }
};

export default {
    getDevicesAvailable,
    getDeviceById
};
