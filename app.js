import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ message: err.messaje });
});

app.listen(8080, function(){
    console.log('CORS-enabled web server listening on port 8080');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
