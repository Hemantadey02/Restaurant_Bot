const db = require('../config/db');

const Reservation = {
    create: async (data) => {
        const result = await db.query(
            "INSERT INTO reservations SET ?",
            [data]
        );
        const insertId = result[0].insertId;
        return insertId;
    },
    getByUserId: async (userId) => {
        const reservationsResult = await db.query(
            "SELECT * FROM reservations WHERE user_id = ?",
            [userId]
        );
        const reservations = reservationsResult[0];
        return reservations;
    },
    update: async (id, data) => {
        await db.query("UPDATE reservations SET ? WHERE id = ?", [data, id]);
    },
    delete: async (id) => {
        await db.query("DELETE FROM reservations WHERE id = ?", [id]);
    },
};


module.exports = Reservation;
