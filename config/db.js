import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

const db = pgp(process.env.DB_URL);

// Initialize database tables
const initDb = async () => {
    try {
        // Create users table
        await db.none(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
        `);
        console.log('Table "users" created/verified.');

        // Create devices table
        await db.none(`
            CREATE TABLE IF NOT EXISTS devices (
                id UUID PRIMARY KEY,
                state TEXT NOT NULL
            );
        `);
        console.log('Table "devices" created/verified.');

        await db.none(`
            INSERT INTO devices (id, state) VALUES ('f83f4410-bfe0-11ef-af67-a38a7671daf5', 'disponible')
            ON CONFLICT (id) DO NOTHING;
        `);
        console.log('Initial device inserted.');

        // Create pacients table
        await db.none(`
            CREATE TABLE IF NOT EXISTS pacients (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                description TEXT NOT NULL,
                treatment TEXT NOT NULL,
                time_of_use TEXT NOT NULL,
                device_id UUID REFERENCES devices(id) ON DELETE SET NULL
            );
        `);
        console.log('Table "pacients" created/verified with "device_id" as UUID.');

        // Create user_pacients table
        await db.none(`
            CREATE TABLE IF NOT EXISTS user_pacients (
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                pacient_id INTEGER REFERENCES pacients(id) ON DELETE CASCADE,
                PRIMARY KEY (user_id, pacient_id)
            );
        `);
        console.log('Table "user_pacients" created/verified.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initDb();

export default db;
