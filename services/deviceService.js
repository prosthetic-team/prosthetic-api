import axios from 'axios';
import db from '../config/db.js';
import { getDevices } from './thingsboardService.js';

// URL base de la API de ThingsBoard
const THINGSBOARD_API_URL = 'https://demo.thingsboard.io/api/devices';
const device_id = "f83f4410-bfe0-11ef-af67-a38a7671daf5";

// Función para obtener dispositivos desde ThingsBoard
export const getDevicesFromThingsBoard = async (token) => {
    console.log(token, "token desde getDevicesFromThingsBoard")
    try {
        // Asegúrate de que el token esté disponible
        if (!token) {
            throw new Error('Token de autenticación no proporcionado en obtener desde thingsboard');
        }
        const response = await axios.get(
            `${THINGSBOARD_API_URL}?deviceIds=${device_id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al obtener dispositivos de ThingsBoard:', error.message);
        throw error; // Re-lanzamos el error para ser manejado en el controlador
    }
};

// Función para obtener dispositivos disponibles
export const getAvailableDevices = async (token) => {
    try {
        // Obtener todos los dispositivos desde ThingsBoard
        const devicesFromThingsBoard = await getDevices(device_id, token);
        console.log(devicesFromThingsBoard, "respuesta 1 dispositivo de la api de thingsboard")
        // Filtrar los dispositivos que no tienen estado 'no disponible'
        const availableDevices = [];

        for (let device of devicesFromThingsBoard) {
            const deviceId = device.id.id;  // Obtener la ID del dispositivo de la respuesta de ThingsBoard
            console.log(deviceId, "respuesta 2 id del dispositivo desde la response de things")

            // Consultar la base de datos para obtener el estado del dispositivo
            const dbDevice = await db.oneOrNone('SELECT * FROM devices WHERE id = $1', [deviceId]);
            console.log(dbDevice, "respuesta 3 de la base de datos")
            // Si el dispositivo existe en la base de datos y su estado no es "no disponible"
            if (dbDevice && dbDevice.state !== 'no disponible') {
                availableDevices.push({
                    id: deviceId,
                    name: device.name,
                    state: dbDevice.state
                });
            }
        }

        return availableDevices;
    } catch (error) {
        console.error('Error al obtener dispositivos disponibles:', error.message);
        throw new Error('Error al obtener dispositivos disponibles: ' + error.message);
    }
};

// Función para verificar si el dispositivo está disponible en la base de datos
export const isDeviceAvailable = async (deviceId) => {
    try {
        const device = await db.oneOrNone('SELECT * FROM devices WHERE id = $1', [deviceId]);
        return device && device.state !== 'no disponible';
    } catch (error) {
        console.error('Error al verificar el estado del dispositivo:', error.message);
        throw error;
    }
};

// Función para actualizar el estado del dispositivo a "no disponible"
export const updateDeviceState = async (deviceId, newState) => {
    try {
        await db.none('UPDATE devices SET state = $1 WHERE id = $2', [newState, deviceId]);
    } catch (error) {
        console.error('Error al actualizar el estado del dispositivo:', error.message);
        throw error;
    }
};

// Función para obtener un dispositivo específico desde ThingsBoard
export const getDeviceById = async (deviceId, token) => {
    console.log(deviceId, "id del dispositivo");
    console.log(token, "token")
    try {
        if (!token) {
            throw new Error('Token de autenticación no proporcionado en obtener por id');
        }

        // Construir la URL de la API de ThingsBoard para obtener un dispositivo específico
        const url = `${THINGSBOARD_API_URL}?deviceIds=${deviceId}`;

        // Realizar la solicitud GET a la API de ThingsBoard con el encabezado Authorization
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Retornar los datos obtenidos de la API
        return response.data;
    } catch (error) {
        console.error('Error al obtener dispositivo por ID:', error.message);
        throw new Error('Error al obtener dispositivo por ID: ' + error.message);
    }
};



export default {
    getDevicesFromThingsBoard,
    getAvailableDevices,
    updateDeviceState,
    getDeviceById
};
