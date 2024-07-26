const { ComponentDialog, WaterfallDialog, WaterfallStepContext, DialogTurnResult, TextPrompt } = require('botbuilder-dialogs');
const axios = require('axios');
const { createReservationCard } = require('../adaptiveCards/reservationCard');
const { showAllReservationCard } = require('../adaptiveCards/showAllReservationCard');

const RESERVATION_DIALOG = 'reservationDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
const TEXT_PROMPT = 'textPrompt';

class ReservationDialog extends ComponentDialog {
    constructor() {
        super(RESERVATION_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.promptForRestaurantId.bind(this),
                this.promptForReservationDate.bind(this),
                this.promptForSpecialRequests.bind(this),
                this.makeReservation.bind(this),
                this.showReservation.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async promptForRestaurantId(step) {
        return await step.prompt(TEXT_PROMPT, 'Please provide the restaurant ID for your reservation.');
    }

    async promptForReservationDate(step) {
        step.values.restaurantId = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please provide the date and time for your reservation (e.g., 2024-07-13 19:00).');
    }

    async promptForSpecialRequests(step) {
        step.values.reservationDate = step.result;
        return await step.prompt(TEXT_PROMPT, 'Do you have any special requests for your reservation?');
    }

    async makeReservation(step) {
        const { restaurantId, reservationDate } = step.values;
        const specialRequests = step.result;

        try {
            const response = await axios.post('http://localhost:3000/api/reservations', {
                user_id: 1,
                restaurant_id: restaurantId,
                reservation_date: reservationDate,
                special_requests: specialRequests
            });
            // console.log(response.data);
            const reservationCard = createReservationCard(restaurantId, reservationDate, specialRequests);

            await step.context.sendActivity(reservationCard);
        } catch (error) {
            await step.context.sendActivity('Sorry, I couldn\'t make a reservation at this time.');
        }
        return await step.prompt(TEXT_PROMPT, 'Do you want to see all reservations ? (yes or no)');
    }

    async showReservation(step) {
        const choice = step.result.toLowerCase();
        // console.log(choice);
        if (choice == 'yes') {
            const response = await axios.get('http://localhost:3000/api/reservations/user/1');
            const reservations = response.data;
            // console.log(reservations);
            const reservationCard = showAllReservationCard(reservations);
            await step.context.sendActivity(reservationCard);
        }
        return await step.endDialog();
    }
}

module.exports.ReservationDialog = ReservationDialog;
