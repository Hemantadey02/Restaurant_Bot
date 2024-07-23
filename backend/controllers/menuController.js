const Menu = require('../models/menuModel');

const addMenu = async (req, res, next) => {
    try {
        const restaurant_id = Number(req.params.restaurantId);
        const data = req.body;
        const id = await Menu.create(restaurant_id, data);
        res.status(201).send({
            message: "New item added successfully!",
            id,
        });
    } catch (error) {
        next(error);
    }
};

const getMenuByRestaurantId = async (req, res, next) => {
    try {
        const restaurantId = Number(req.params.restaurantId);
        const menus = await Menu.getByRestaurantId(restaurantId);
        res.status(200).send(menus);
    } catch (error) {
        next(error);
    }
};

module.exports = { addMenu, getMenuByRestaurantId };