const Order = require('../models/orderModel');

const createOrder = async (req, res, next) => {
    try {
        const data = req.body;
        const order_id = await Order.create(data);
        res.status(201).send({
            message: "Order created successfully",
            id: order_id,
        });
    } catch (error) {
        next(error);
    }
};

const getOrdersByUserId = async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const orders = await Order.getByUserId(userId);
        res.status(200).send(orders);
    } catch (error) {
        next(error);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        await Order.update(Number(id), data);
        res.status(200).send({ message: "Order updated successfully" });
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Order.delete(Number(id));
        res.status(200).send({ message: "Order deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getOrdersByUserId, updateOrder, deleteOrder };