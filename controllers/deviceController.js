import deviceService from '../services/deviceService.js';

// Obtener todos los dispositivos (excluyendo los no disponibles)
export const getAllDevices = async (req, res) => {
    const { token } = req.headers; // Se obtiene el token de los headers de la request

    if (!token) {
        return res.status(400).json({ message: 'Token de autenticación no proporcionado' });
    }

    try {
        const devices = await deviceService.getAllDevices(token);
        res.status(200).json(devices);
    } catch (error) {
        console.error('Error al obtener dispositivos:', error.message);
        res.status(500).json({ message: 'Error al obtener dispositivos' });
    }
};

// Obtener dispositivos disponibles (excluyendo los "no disponibles")
export const getAvailableDevices = async (req, res) => {
    const { token } = req.headers; // Se obtiene el token de los headers de la request

    if (!token) {
        return res.status(400).json({ message: 'Token de autenticación no proporcionado' });
    }

    try {
        const devices = await deviceService.getAvailableDevices(token);
        res.status(200).json(devices);
    } catch (error) {
        console.error('Error al obtener dispositivos disponibles:', error.message);
        res.status(500).json({ message: 'Error al obtener dispositivos disponibles' });
    }
};

// Asignar un dispositivo a un paciente y marcarlo como "no disponible"
export const assignDeviceToPacient = async (req, res) => {
    const { deviceId } = req.body;  // El dispositivo que se asignará al paciente
    const { token } = req.headers; // Se obtiene el token de los headers de la request

    if (!token) {
        return res.status(400).json({ message: 'Token de autenticación no proporcionado' });
    }

    try {
        await deviceService.assignDeviceToPacient(deviceId);
        res.status(200).json({ message: 'Dispositivo asignado correctamente y marcado como no disponible' });
    } catch (error) {
        console.error('Error al asignar dispositivo al paciente:', error.message);
        res.status(500).json({ message: 'Error al asignar dispositivo' });
    }
};

// Actualizar el estado de un dispositivo (por ejemplo, "no disponible")
export const updateDeviceState = async (req, res) => {
    const { deviceId, newState } = req.body; // El dispositivo y el nuevo estado
    const { token } = req.headers; // Se obtiene el token de los headers de la request

    if (!token) {
        return res.status(400).json({ message: 'Token de autenticación no proporcionado' });
    }

    try {
        await deviceService.updateDeviceState(deviceId, newState);
        res.status(200).json({ message: 'Estado del dispositivo actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el estado del dispositivo:', error.message);
        res.status(500).json({ message: 'Error al actualizar el estado del dispositivo' });
    }
};

// Obtener dispositivo por ID
export const getDeviceById = async (req, res) => {
    const deviceId = req.params.id;
    const { token } = req.headers; // Se obtiene el token de los headers de la request

    if (!token) {
        return res.status(400).json({ message: 'Token de autenticación no proporcionado' });
    }

    try {
        // Llamamos al servicio para obtener el dispositivo
        const device = await deviceService.getDevicesFromThingsBoard(token);

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
    getAllDevices,
    getAvailableDevices,
    assignDeviceToPacient,
    updateDeviceState,
    getDeviceById
};
