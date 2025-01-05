import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});

const clearDb = async () => {
    try {
        await db.tx(async t => {
            await t.none('DROP TABLE IF EXISTS user_pacients CASCADE;');
            console.log('Table "user_pacients" dropped.');

            await t.none('DROP TABLE IF EXISTS pacients CASCADE;');
            console.log('Table "pacients" dropped.');

            await t.none('DROP TABLE IF EXISTS devices CASCADE;');
            console.log('Table "devices" dropped.');

            await t.none('DROP TABLE IF EXISTS users CASCADE;');
            console.log('Table "users" dropped.');
        });

        console.log('All tables have been cleared.');
    } catch (error) {
        console.error('Error clearing the database:', error.message);
        process.exit(1); // Exit with a failure code
    } finally {
        pgp.end(); // Close the database connection pool
    }
};

// Run the script
clearDb();
