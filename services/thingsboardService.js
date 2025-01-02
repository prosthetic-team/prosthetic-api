import axios from 'axios';

//const BASE_URL = 'http://iot.ceisufro.cl:8080';
const BASE_URL = 'https://demo.thingsboard.io';


export const loginToThingsboard = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username,
            password
        });
        return response.data.token;
    } catch (error) {
        if (error.response) {
            // Si la respuesta contiene información sobre el error
            console.error('Error al obtener el token:', error.response.data);
            console.error('Status code:', error.response.status);
            console.error('Headers:', error.response.headers);
            throw new Error(`Error al obtener el token: ${error.response.data.message || error.message}`);
        } else if (error.request) {
            // Si no hay respuesta pero sí se hizo la solicitud
            console.error('No response received:', error.request);
            throw new Error('No response received from server.');
        } else {
            // Otro error (por ejemplo, un error de configuración)
            console.error('Error de configuración:', error.message);
            throw new Error(`Error de configuración: ${error.message}`);
        }
    }
};

export const getTelemetryData = async (deviceId, keys = '', token) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keys}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener datos de telemetría: ' + error.message);
    }
};

export const getDevices = async (deviceIds, token) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/devices?deviceIds=${deviceIds}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener datos de dispositivos: ' + error.message);
    }
};