import express from 'express';
import {
    insertPacient,
    getPacients,
    getPacientById,
    updatePacient,
    deletePacient,
    getPacientTimeOfUse,
    getCompletedTreatmentsController
} from '../controllers/pacientController.js';

const router = express.Router();

// Crear un paciente
router.post('/', insertPacient);

// Obtener todos los pacientes
router.get('/', getPacients);

// Obtener un paciente por ID
router.get('/:id', getPacientById);

// Actualizar un paciente
router.put('/:id', updatePacient);

// Eliminar un paciente
router.delete('/:id', deletePacient);

// Obtener tiempo de uso de un paciente
router.get('/:id/time-of-use', getPacientTimeOfUse);

// Obtener tratamientos completados
router.get('/completed-treatments/all', getCompletedTreatmentsController);

export default router;
