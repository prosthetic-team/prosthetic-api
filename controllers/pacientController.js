import { getAllPacients, createPacient, getPacientByIdService, deletePacientById, updatePacientById } from '../services/pacientService.js';
import { getDevices } from '../services/thingsboardService.js';

// Crear paciente
export const insertPacient = async (req, res) => {
    const { nombreCompleto, email, descripcion, tratamiento, tiempoUsoDiario, dispositivoId, especialistaId } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    try {
        // Verificar si el dispositivo existe
        const devices = await getDevices(dispositivoId, token);

        if (!devices || devices.length === 0) {
            return res.status(404).json({ message: 'Dispositivo no encontrado o no disponible' });
        }

        // Crear el paciente
        const pacientId = await createPacient(
            { nombreCompleto, email, descripcion, tratamiento, tiempoUsoDiario, dispositivoId, especialistaId },
            token
        );

        // Retornar el ID del paciente creado
        res.status(201).json({ pacientId });
    } catch (error) {
        console.error('Error al crear el paciente:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los pacientes
export const getPacients = async (req, res) => {
    try {
        const pacients = await getAllPacients();
        res.status(200).json(pacients);
    } catch (error) {
        console.error('Error al obtener pacientes:', error.message);
        res.status(500).json({ message: 'Error al obtener pacientes' });
    }
};

// Obtener paciente por id
export const getPacientById = async (req, res) => {
    const pacientId = req.params.id;

    try {
        const pacient = await getPacientByIdService(pacientId);
        if (!pacient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.status(200).json(pacient);
    } catch (error) {
        console.error('Error al obtener el paciente:', error.message);
        res.status(500).json({ message: 'Error al obtener el paciente' });
    }
};

// Actualizar paciente
export const updatePacient = async (req, res) => {
    const pacientId = req.params.id;
    const updatedPacient = req.body;

    try {
        await updatePacientById(pacientId, updatedPacient);
        res.status(200).json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error.message);
        res.status(500).json({ message: 'Error al actualizar el paciente' });
    }
};

// Eliminar un paciente
export const deletePacient = async (req, res) => {
    const pacientId = req.params.id;

    try {
        await deletePacientById(pacientId);
        res.status(200).json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el paciente:', error.message);
        res.status(500).json({ message: 'Error al eliminar el paciente' });
    }
};
