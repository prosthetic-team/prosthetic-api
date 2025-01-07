import express from 'express';
import userRoutes from './routes/userRoutes.js';
import thingsboardRoutes from './routes/thingsboardRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import pacientRoutes from './routes/pacientRoutes.js';
import cors from 'cors';

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Configuración de CORS
app.use(cors());

// Rutas de la API
app.use('/users', userRoutes);  // Asegúrate de que esta ruta esté bien configurada
app.use('/thingsboard', thingsboardRoutes);  // Asegúrate de que esta ruta esté bien configurada
app.use('/devices', deviceRoutes);  // Asegúrate de que esta ruta esté bien configurada
app.use('/pacients', pacientRoutes);  // Asegúrate de que esta ruta esté bien configurada

// Middleware para manejar errores (si ocurre algún error en el servidor)
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ message: err.message });  // Arreglé un pequeño error en el campo 'message'
});

// Puerto donde el servidor va a escuchar
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
