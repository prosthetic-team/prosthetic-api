import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10)
});

// Crear la tabla "users"
db.none(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
`)
    .then(() => {
        console.log('Table "users" created/verified.');
    })
    .catch(error => {
        console.error('Error creating "users" table:', error);
    });

// Crear la tabla "devices"
db.none(`
    CREATE TABLE IF NOT EXISTS devices (
        id UUID PRIMARY KEY,
        state TEXT NOT NULL
    );
`)
    .then(() => {
        console.log('Table "devices" created/verified.');
    })
    .catch(error => {
        console.error('Error creating "devices" table:', error);
    });

// Crear la tabla "pacients"
db.none(`
    CREATE TABLE IF NOT EXISTS pacients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        description TEXT NOT NULL,
        treatment TEXT NOT NULL,
        time_of_use TEXT NOT NULL,
        device_id UUID REFERENCES devices(id) ON DELETE SET NULL
    );
`)
    .then(() => {
        console.log('Table "pacients" created/verified with "device_id" as UUID.');
    })
    .catch(error => {
        console.error('Error creating "pacients" table with "device_id":', error);
    });

// Crear la tabla intermedia "user_pacients"
db.none(`
    CREATE TABLE IF NOT EXISTS user_pacients (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        pacient_id INTEGER REFERENCES pacients(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, pacient_id)
    );
`)
    .then(() => {
        console.log('Table "user_pacients" created/verified.');
    })
    .catch(error => {
        console.error('Error creating "user_pacients" table:', error);
    });

export default db;
