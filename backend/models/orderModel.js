const db = require('../config/db');

const Order = {
    create: async (data) => {
        const { user_id, restaurant_id, order_date, status, items } = data;
        const result = await db.query(
            "INSERT INTO orders (user_id, restaurant_id, order_date, status, total_amount) VALUES (?, ?, ?, ?, 0);",
            [user_id, restaurant_id, order_date, status]
        );
        const insertId = result[0].insertId;
        const order_id = insertId;
        let total_amount = 0;
        for (let item of items) {
            const priceResult = await db.query(
                "SELECT price FROM menus where id = ?",
                [item.menu_id]
            );
            const price = priceResult[0][0].price;
            const prices = price * item.quantity;
            total_amount += prices;
            await db.query(
                "INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)",
                [order_id, item.menu_id, item.quantity, prices]
            );
        }
        await db.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
            total_amount,
            order_id,
        ]);
        return order_id;
    },
    getByUserId: async (userId) => {
        const ordersResult = await db.query(
            "SELECT * FROM orders WHERE user_id = ?",
            [userId]
        );
        const orders = ordersResult[0];
        const orderPromises = orders.map(async (order) => {
            const itemsResult = await db.query(
                "SELECT * FROM order_items WHERE order_id = ?",
                [order.id]
            );
            order.items = itemsResult[0];
            return order;
        });
        const detailedOrders = await Promise.all(orderPromises);
        return detailedOrders;
    },
    update: async (id, data) => {
        await db.query("UPDATE orders SET ? WHERE id = ?", [data, id]);
    },
    delete: async (id) => {
        await db.query("DELETE FROM orders WHERE id = ?", [id]);
    },
};


module.exports = Order;
