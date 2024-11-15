import userService from '../services/userService.js';

export const insertUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Crear el usuario
        const userId = await new Promise((resolve, reject) => {
            userService.insertUser({ name, email, password }, (err, id) => {
                if (err) return reject(err);
                resolve(id);
            });
        });

        res.status(201).json({ userId });
    } catch (error) {
        console.error('Error al crear el usuario:', error.message);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Obtener usuario por id
export const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error.message);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;

    try {
        await userService.updateUser(userId, updatedUser);
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error.message);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await userService.deleteUser(userId);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error.message);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await new Promise((resolve, reject) => {
            userService.loginUser(email, password, (err, user) => {
                if (err) return reject(err);
                resolve(user);
            });
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Error during login' });
    }
};