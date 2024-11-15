import express from 'express';
import {
    insertUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
} from '../controllers/userController.js';

const router = express.Router();

// Crear un usuario
router.post('/', insertUser);

// Obtener todos los usuarios
router.get('/', getAllUsers);

// Obtener un usuario por ID
router.get('/:id', getUserById);

// Actualizar un usuario
router.put('/:id', updateUser);

// Eliminar un usuario
router.delete('/:id', deleteUser);

router.post('/login', loginUser);

export default router;
