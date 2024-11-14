import pgPromise from 'pg-promise';

const pgp = pgPromise();

const db = pgp({
    user: 'psync',
    host: 'localhost',
    database: 'psync_db',
    password: 'psync123',
    port: 5432
});

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
