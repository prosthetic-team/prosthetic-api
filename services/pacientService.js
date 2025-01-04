import db from '../config/db.js';
import { getDevices } from './thingsboardService.js';
import { updateDeviceState } from './deviceService.js';

// Función para crear un paciente
export const createPacient = async (pacientData, token) => {
    try {
        // Verificar si el especialista existe
        const user = await db.oneOrNone('SELECT id FROM users WHERE id = $1', [pacientData.especialistaId]);

        if (!user) {
            throw new Error('Especialista no encontrado');
        }

        // Insertar el paciente en la tabla "pacients" con el "device_id"
        const result = await db.one(
            `INSERT INTO pacients (name, email, description, treatment, time_of_use, device_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [
                pacientData.nombreCompleto,
                pacientData.email,
                pacientData.descripcion,
                pacientData.tratamiento,
                pacientData.tiempoUsoDiario,
                pacientData.dispositivoId
            ]
        );

        // Obtener el dispositivo desde ThingsBoard
        const devices = await getDevices(pacientData.dispositivoId, token);

        // Si el dispositivo no existe o no está disponible, lanzar error
        if (!devices || devices.length === 0) {
            throw new Error('El dispositivo no existe o no está disponible');
        }

        const device = devices[0]; // Asumimos que se devuelve un dispositivo como un arreglo

        // Cambiar el estado del dispositivo a "no disponible"
        await updateDeviceState(pacientData.dispositivoId, 'no disponible');

        // Asignar el paciente al especialista (usuario)
        await db.none(
            `INSERT INTO user_pacients (user_id, pacient_id) VALUES ($1, $2)`,
            [pacientData.especialistaId, result.id]
        );

        // Retornar el ID del paciente creado
        return result.id;
    } catch (error) {
        console.error('Error creating pacient:', error.message);
        throw error; // Lanzamos el error para que lo maneje el controlador
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
export const getPacientByIdService = async (id) => {
    try {
        const pacient = await db.oneOrNone('SELECT * FROM pacients WHERE id = $1', [id]);
        return pacient;
    } catch (err) {
        console.error('Error fetching pacient by ID:', err.message);
        throw err;
    }
};

export const updatePacientById = async (id, updatedPacient) => {
    try {
        await db.none(
            `UPDATE pacients SET name = $1, description = $2, treatment = $3, time_of_use = $4 WHERE id = $5`,
            [
                updatedPacient.nombreCompleto,
                updatedPacient.descripcion,
                updatedPacient.tratamiento,
                updatedPacient.tiempoUsoDiario,
                id
            ]
        );
    } catch (err) {
        console.error('Error updating pacient:', err.message);
        throw err;
    }
}

export const deletePacientById = async (id) => {
    try {
        await db.none('DELETE FROM pacients WHERE id = $1', [id]);
    } catch (err) {
        console.error('Error deleting pacient:', err.message);
        throw err;
    }
}

export default {
    createPacient,
    getAllPacients,
    getPacientByIdService,
    updatePacientById,
    deletePacientById
};
