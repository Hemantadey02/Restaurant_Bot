const Restaurant = require('../models/restaurantModel');

const createRestaurant = async (req, res, next) => {
    try {
        const data = req.body;
        const id = await Restaurant.create(data);
        res.status(201).send({
            message: "Restaurant created successfully!",
            id,
        });
    } catch (error) {
        next(error);
    }
};

const getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.getAll();
        res.status(200).send(restaurants);
    } catch (error) {
        next(error);
    }
};

const getRestaurantById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const restaurant = await Restaurant.getById(id);
        res.status(200).send(restaurant);
    } catch (error) {
        next(error);
    }
};

module.exports = { createRestaurant, getRestaurants, getRestaurantById };