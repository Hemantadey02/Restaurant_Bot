const Reservation = require('../models/reservationModel');

const createReservation = async (req, res, next) => {
    try {
        const data = req.body;
        const id = await Reservation.create(data);
        res.status(201).send({
            message: "Reservation created successfully!",
            id,
        });
    } catch (error) {
        next(error);
    }
};

const getReservationsByUserId = async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const reservations = await Reservation.getByUserId(userId);
        res.status(200).send(reservations);
    } catch (error) {
        next(error);
    }
};

const updateReservation = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        await Reservation.update(id, data);
        res.status(200).send({
            message: "Reservation updated successfully!",
        });
    } catch (error) {
        next(error);
    }
};

const deleteReservation = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await Reservation.delete(id);
        res.status(200).send({
            message: "Reservation deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createReservation, getReservationsByUserId, updateReservation, deleteReservation };