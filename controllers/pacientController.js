import pacientService from '../services/pacientService.js';
import thingsboardService from '../services/thingsboardService.js';  // Para obtener la información de los dispositivos

// Crear paciente
export const insertPacient = async (req, res) => {
    const { nombreCompleto, email, descripcion, tratamiento, tiempoUsoDiario, dispositivoId, especialistaId, token } = req.body;

    try {
        const devices = await thingsboardService.getDevices(dispositivoId, token);

        if (!devices || devices.length === 0) {
            return res.status(404).json({ message: 'Dispositivo no encontrado o no disponible' });
        }

        // Crear el paciente
        const pacientId = await new Promise((resolve, reject) => {
            pacientService.insertPacient({ nombreCompleto, email, descripcion, tratamiento, tiempoUsoDiario, dispositivoId, especialistaId }, (err, id) => {
                if (err) return reject(err);
                resolve(id);
            });
        });

        // Asignar dispositivo al paciente
        await pacientService.assignDeviceToPacient(pacientId, dispositivoId);

        // Asignar paciente al especialista
        await pacientService.assignPacientToEspecialista(pacientId, especialistaId);

        res.status(201).json({ pacientId });
    } catch (error) {
        console.error('Error al crear el paciente:', error.message);
        res.status(500).json({ message: 'Error al crear el paciente' });
    }
};

// Obtener todos los pacientes
export const getAllPacients = async (req, res) => {
    try {
        const pacients = await pacientService.getAllPacients();
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
        const pacient = await pacientService.getPacientById(pacientId);
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
        await pacientService.updatePacient(pacientId, updatedPacient);
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
        await pacientService.deletePacient(pacientId);
        res.status(200).json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el paciente:', error.message);
        res.status(500).json({ message: 'Error al eliminar el paciente' });
    }
};
