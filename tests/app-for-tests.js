import express from 'express';
import userRoutes from "../routes/userRoutes.js";
import thingsboardRoutes from "../routes/thingsboardRoutes.js";

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/thingsboard', thingsboardRoutes);

export default app;
