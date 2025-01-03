import express from 'express';
import {
    insertPacient,
    getAllPacients,
    getPacientById,
    updatePacient,
    deletePacient
} from '../controllers/pacientController.js';

const router = express.Router();

// Crear un paciente
router.post('/', insertPacient);

// Obtener todos los pacientes
router.get('/', getAllPacients);

// Obtener un paciente por ID
router.get('/:id', getPacientById);

// Actualizar un paciente
router.put('/:id', updatePacient);

// Eliminar un paciente
router.delete('/:id', deletePacient);

export default router;
