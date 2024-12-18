import db from '../config/db.js';
import { encryptService } from './encryptService.js';

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

// Función para eliminar un usuario
export const deleteUser = async (id) => {
    try {
        await db.none(`DELETE FROM users WHERE id = $1`, [id]);
    } catch (err) {
        console.error('Error deleting user:', err.message);
    }
};

export const loginUser = async (email, password, callback) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const [user] = await db.query(query, [email]);

        if (user && await bcrypt.compare(password, user.password)) {
            callback(null, { id: user.id, name: user.name, email: user.email });
        } else {
            callback(new Error('Invalid credentials'));
        }
    } catch (error) {
        callback(error);
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
