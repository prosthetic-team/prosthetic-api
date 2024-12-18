import axios from 'axios';

const BASE_URL = 'http://iot.ceisufro.cl:8080';

export const loginToThingsboard = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username,
            password
        });
        return response.data.token;
    } catch (error) {
        throw new Error('Error al obtener el token: ' + error.message);
    }
};

export const getTelemetryData = async (deviceId, token) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener datos de telemetría: ' + error.message);
    }
};