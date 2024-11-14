import argon2 from 'argon2';

export class encryptService {

    static async hashPassword(password) {
        try {
            const hashedPassword = await argon2.hash(password);
            console.log('Contraseña hasheada ' + hashedPassword);
            return hashedPassword;
        } catch (error) {
            console.log('Error al hashear la contraseña' + error);
            throw new Error('Error al hashear la contraseña');
        }
    }

    static async verifyPassword(hashedPassword, password) {
        try {
            const isPasswordValid = await argon2.verify(hashedPassword, password);
            if (!isPasswordValid) {
                console.log('Contraseña incorrecta');
                return false;
            } else {
                console.log('Contraseña correcta');
                return true;
            }
        } catch (error) {
            console.log('Error al verificar la contraseña' + error);
            throw new Error('Error al verificar la contraseña');
        }
    }
}
