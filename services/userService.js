import db from '../config/db.js';
import { encryptService } from './encryptService.js';
import { loginToThingsboard } from './thingsboardService.js';
import { deletePacients } from './pacientService.js';

// Función para insertar un usuario con contraseña encriptada
export const insertUser = async (userData, callback) => {
    try {
        const hashedPassword = await encryptService.hashPassword(userData.password);
        const result = await db.one(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`,
            [userData.name, userData.email, hashedPassword]
        );
        callback(null, result.id);
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error.message);
        callback(error);
    }
};

// Función para obtener todos los usuarios
export const getAllUsers = async () => {
    try {
        const users = await db.any(`SELECT id, name, email FROM users`);
        return users;
    } catch (err) {
        console.error('Error fetching users:', err.message);
        throw err;
    }
};

// Función para obtener un usuario por ID
export const getUserById = async (id) => {
    try {
        const user = await db.oneOrNone(`SELECT id, name, email FROM users WHERE id = $1`, [id]);
        return user;
    } catch (err) {
        console.err('Error fetching user by ID:', err.message);
        throw err;
    }
};

// Función para actualizar un usuario
export const updateUser = async (id, updatedData) => {
    try {
        await db.none(
            `UPDATE users SET name = $1, email = $2 WHERE id = $3`,
            [updatedData.name, updatedData.email, id]
        );
    } catch (err) {
        console.error('Error updating user:', err.message);
        throw err;
    }
};

// Funciones asociadas a la eliminación de un usuario
export const deleteUser = async (id) => {
    try {
        // Primero, eliminamos los pacientes asociados al usuario
        const pacientesEliminados = await deletePacients(id);

        if (!pacientesEliminados) {
            console.log('Error: No se pudieron eliminar los pacientes antes de eliminar al usuario.');
            return; // Si no se eliminaron los pacientes, detenemos el flujo
        }

        // Luego, eliminamos las relaciones entre el usuario y los pacientes
        await deleteUserPacientsRelations(id);

        // Finalmente, eliminamos al usuario
        await db.none(`DELETE FROM users WHERE id = $1`, [id]);

        console.log(`Usuario con ID ${id} eliminado correctamente.`);
    } catch (err) {
        console.error('Error deleting user:', err.message);
    }
};

// Función para eliminar las relaciones entre el usuario y los pacientes
const deleteUserPacientsRelations = async (userId) => {
    try {
        await db.none(`
            DELETE FROM user_pacients WHERE user_id = $1
        `, [userId]);
        console.log(`Relaciones entre usuario y pacientes eliminadas.`);
    } catch (err) {
        console.error('Error deleting user-pacients relations:', err.message);
        throw err;
    }
};

//-----------------------------------------------------------------

export const loginUser = async (email, password) => {
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValid = await encryptService.verifyPassword(user.password, password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = await loginToThingsboard();

        return { id: user.id, token };
    } catch (error) {
        console.error('Error during login:', error.message);
        throw error;
    }
};

// Exportar todas las funciones como un objeto para importación predeterminada
export default {
    insertUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
};
