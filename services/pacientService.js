import db from '../config/db.js';
import { getDevices } from './thingsboardService.js';
import { updateDeviceState } from './deviceService.js';
import { calculateMovingHours } from './thingsboardService.js';
import { updateDeviceStateAvailable } from './deviceService.js';

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

export const getTimeOfUse = async (id, device_id, token) => {
    try {
        const movingHours = await calculateMovingHours(device_id, token);
        const pacient = await db.oneOrNone('SELECT * FROM pacients WHERE id = $1', [id]);
        return {
            pacientId: pacient.id,  // id del paciente
            timeOfUse: pacient.time_of_use,  // tiempo de uso
            movingHours  // horas de movimiento
        };
    } catch (err) {
        console.error('Error fetching moving hours:', err.message);
        throw err;
    }

};

//crear servicio que sea capaz de obtener la cantidad de pacientes que completo las horas de tratamiento diario con el servicio getMovingHours y con GetAllPacients, cuando getMovingHours sea mayor o igual a tiempoUsoDiario de cada paciente, se debe contar como un paciente que completo el tratamiento
export const getCompletedTreatments = async (token) => {
    console.log('Getting completed treatments...');
    try {
        console.log('Getting all pacients...');
        const pacients = await getAllPacients();
        console.log(pacients);
        let completedTreatments = 0;
        for (let pacient of pacients) {
            const movingHours = await calculateMovingHours(pacient.device_id, token);
            if (movingHours >= pacient.time_of_use) {
                completedTreatments++;
            }
        }
        return completedTreatments;
    } catch (err) {
        console.error('Error fetching completed treatments:', err.message);
        throw err;
    }
};

// Función para obtener las IDs de los pacientes asociados a un user_id
const getPacientIds = async (userId) => {
    console.log(`Obteniendo todas las IDs de los pacientes asociados al usuario con ID: ${userId}`);
    const pacientIds = await db.any(`
        SELECT pacient_id FROM user_pacients WHERE user_id = $1
    `, [userId]);

    console.log(`Pacientes asociados encontrados: ${pacientIds.length}`);
    return pacientIds.map(p => p.pacient_id);
};

// Función para obtener los pacientes con sus dispositivos
const getPacientsWithDevices = async (pacientIdsList) => {
    console.log(`Obteniendo pacientes con dispositivos asociados...`);
    return await db.any(`
        SELECT id, device_id FROM pacients WHERE id IN ($1:csv)
    `, [pacientIdsList]);
};

// Función para eliminar los pacientes por sus IDs
const deletePacientsByIds = async (pacientIdsList) => {
    console.log(`Eliminando pacientes...`);
    await db.none(`
        DELETE FROM pacients WHERE id IN ($1:csv)
    `, [pacientIdsList]);
    console.log(`Pacientes eliminados.`);
};

// Función principal para eliminar los pacientes al eliminar un usuario (especialista)
export const deletePacients = async (userId) => {
    try {
        // Obtener las IDs de los pacientes asociados al usuario
        const pacientIdsList = await getPacientIds(userId);

        if (pacientIdsList.length === 0) {
            console.log(`No se encontraron pacientes asociados al usuario con ID: ${userId}`);
            return false; // Si no hay pacientes, retornamos false
        }

        // Obtener los pacientes con dispositivos asociados
        const pacients = await getPacientsWithDevices(pacientIdsList);

        // Si no hay pacientes con dispositivos asociados, devolver false
        if (pacients.length === 0) {
            console.log(`No se encontraron pacientes con dispositivos asociados.`);
            return false;
        }

        // Actualizar los dispositivos a "disponible"
        for (let pacient of pacients) {
            await updateDeviceStateAvailable(pacient.device_id);
        }

        // Eliminar los pacientes
        await deletePacientsByIds(pacientIdsList);

        console.log(`Pacientes eliminados correctamente para el usuario con ID: ${userId}`);

        return true; // Si todo el proceso fue exitoso, retornamos true
    } catch (err) {
        console.error('Error al eliminar pacientes:', err.message);
        return false; // En caso de error, retornamos false
    }
};


export default {
    createPacient,
    getAllPacients,
    getPacientByIdService,
    updatePacientById,
    deletePacientById,
    getTimeOfUse,
    getCompletedTreatments,
    deletePacients
};
