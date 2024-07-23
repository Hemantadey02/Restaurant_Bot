const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const menuController = require('../controllers/menuController');
const reservationController = require('../controllers/reservationController');
const orderController = require('../controllers/orderController');

// Restaurant routes
router.get('/restaurants', restaurantController.getRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);

// Menu routes
router.get('/restaurants/:restaurantId/menus', menuController.getMenuByRestaurantId);

// Reservation routes
router.post('/reservations', reservationController.createReservation);
router.get('/reservations/user/:userId', reservationController.getReservationsByUserId);
router.put('/reservations/:id', reservationController.updateReservation);
router.delete('/reservations/:id', reservationController.deleteReservation);

// Order routes
router.post('/orders', orderController.createOrder);
router.get('/orders/user/:userId', orderController.getOrdersByUserId);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
