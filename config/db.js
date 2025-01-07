import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

const db = pgp(process.env.DB_URL);

db.none(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
`)
.then(() => {
    console.log('Connected to PostgreSQL and "users" table created/verified.');
})
.catch(error => {
    console.error('Error setting up the database:', error);
});

export default db;
