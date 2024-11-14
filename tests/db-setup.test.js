import db from '../config/db.js';

export const clearDatabase = async (done) => {
    try {
        await db.none("DELETE FROM users");
        console.log("Users table cleared.");
        done();
    } catch (err) {
        console.error('Error clearing the users table:', err);
        done(err);
    }
};
