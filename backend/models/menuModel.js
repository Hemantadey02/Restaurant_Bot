const db = require('../config/db');

const Menu = {
    create: async (restaurant_id, data) => {
        const result = await db.query(
            "INSERT INTO menus SET restaurant_id = ?, ?",
            [restaurant_id, data]
        );
        const insertId = result[0].insertId;
        return insertId;
    },
    getByRestaurantId: async (restaurantId) => {
        const [menus] = await db.query(
            "SELECT * FROM menus WHERE restaurant_id = ?",
            [restaurantId]
        );
        return menus;
    },
};


module.exports = Menu;