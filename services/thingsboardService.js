import axios from 'axios';
import dotenv from 'dotenv';

//const BASE_URL = 'http://iot.ceisufro.cl:8080';
const BASE_URL = 'https://demo.thingsboard.io';

export const loginToThingsboard = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: process.env.THINGSBOARD_USER,
            password: process.env.THINGSBOARD_PASSWORD
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
    const ruta = `${BASE_URL}/api/devices?deviceIds=${deviceIds}`;
    console.log(ruta);
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

export const calculateMovingHours = async (deviceId, token) => {
    const endTs = new Date().getTime();
    const startTs = endTs - (24 * 60 * 60 * 1000);

    console.log('Start Time:', startTs);
    console.log('End Time:', endTs);

    try {
        const response = await axios.get(
            `${BASE_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=moving&startTs=${startTs}&endTs=${endTs}&intervalType=MILLISECONDS&interval=100&agg=NONE&orderBy=ASC`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const telemetryData = response.data;

        if (!telemetryData || !telemetryData.moving) {
            console.log('No data available for the "moving" key.');
            return 0;
        }

        const movingData = telemetryData.moving;
        let totalTrueDuration = 0;

        for (let i = 0; i < movingData.length - 1; i++) {
            const current = movingData[i];
            const next = movingData[i + 1];

            if (current.value === 'true') {
                const currentTimestamp = parseInt(current.ts, 10);
                const nextTimestamp = parseInt(next.ts, 10);
                totalTrueDuration += nextTimestamp - currentTimestamp;
                console.log('Current:', currentTimestamp, 'Next:', nextTimestamp, 'Duration:', nextTimestamp - currentTimestamp);
            }
        }

        const totalHours = totalTrueDuration / (1000 * 60 * 60);
        return totalHours;
    } catch (error) {
        console.error('Error calculating moving hours:', error.message);
        if (error.response) {
            console.error('Response error:', error.response.data);
        }
        return 0;
    }
};


const handleAxiosError = (error, customMessage) => {
    if (error.response) {
        console.error(`${customMessage}:`, error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
        throw new Error(`${customMessage}: ${error.response.data.message || error.message}`);
    } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response received from server.');
    } else {
        console.error('Configuration error:', error.message);
        throw new Error(`Configuration error: ${error.message}`);
    }
};

// obtener estado del dispositivo
export const getDeviceState = async (deviceId, token) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/device/info/${deviceId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data.active;
    } catch (error) {
        handleAxiosError(error, 'Error al obtener estado del dispositivo');
    }
};