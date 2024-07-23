const db = require('../config/db');

const Restaurant = {
    create: async (data) => {
        const result = await db.query(
            "INSERT INTO restaurants SET ?",
            [data]
        );
        const insertId = result[0].insertId;
        return insertId;
    },
    getAll: async () => {
        const restaurantsResult = await db.query("SELECT * FROM restaurants");
        const restaurants = restaurantsResult[0];
        return restaurants;
    },
    getById: async (id) => {
        const restaurantResult = await db.query(
            "SELECT * FROM restaurants WHERE id = ?",
            [id]
        );
        const restaurant = restaurantResult[0][0];
        return restaurant;
    },
};


module.exports = Restaurant;