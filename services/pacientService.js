import db from '../config/db.js';
import thingsboardService from './thingsboardService.js';

// Función para crear un paciente
export const createPacient = async (pacientData, token, callback) => {
    try {
        // Insertar el paciente en la tabla "pacients"
        const result = await db.one(
            `INSERT INTO pacients (name, description, treatment, time_of_use)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [pacientData.nombreCompleto, pacientData.descripcion, pacientData.tratamiento, pacientData.tiempoUsoDiario]
        );

        // Obtener el dispositivo desde ThingsBoard
        const devices = await thingsboardService.getDevices(pacientData.dispositivoId, token);

        // Si el dispositivo no existe o no está disponible, lanzar error
        if (!devices || devices.length === 0) {
            throw new Error('El dispositivo no existe o no está disponible');
        }

        const device = devices[0]; // Asumimos que se devuelve un dispositivo como un arreglo

        // Cambiar el estado del dispositivo a "no disponible"
        await db.none(`UPDATE devices SET state = 'no disponible' WHERE id = $1`, [pacientData.dispositivoId]);

        // Asignar el dispositivo al paciente
        await db.none(
            `INSERT INTO pacient_devices (pacient_id, device_id) VALUES ($1, $2)`,
            [result.id, pacientData.dispositivoId]
        );

        // Asignar el paciente al especialista (usuario)
        await db.none(
            `INSERT INTO user_pacients (user_id, pacient_id) VALUES ($1, $2)`,
            [pacientData.especialistaId, result.id]
        );

        // Retornar el ID del paciente creado
        callback(null, { pacientId: result.id });
    } catch (error) {
        console.error('Error creating pacient:', error.message);
        callback(error);
    }
};

// Función para obtener todos los pacientes
export const getAllPacients = async () => {
    try {
        const pacients = await db.any('SELECT * FROM pacients');
        return pacients;
    } catch (err) {
        console.error('Error fetching pacients:', err.message);
        throw err;
    }
};

// Función para obtener un paciente por ID
export const getPacientById = async (id) => {
    try {
        const pacient = await db.oneOrNone('SELECT * FROM pacients WHERE id = $1', [id]);
        return pacient;
    } catch (err) {
        console.error('Error fetching pacient by ID:', err.message);
        throw err;
    }
};

export default {
    createPacient,
    getAllPacients,
    getPacientById
};
