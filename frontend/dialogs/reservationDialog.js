const { ComponentDialog, WaterfallDialog, WaterfallStepContext, DialogTurnResult, TextPrompt } = require('botbuilder-dialogs');
const axios = require('axios');

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
                this.makeReservation.bind(this)
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
                // user_id: 1,
                restaurant_id: restaurantId,
                reservation_date: reservationDate,
                special_requests: specialRequests
            });

            const reservation = response.data;
            const card = {
                type: "AdaptiveCard",
                body: [
                    { type: "TextBlock", text: "Reservation Confirmed", weight: "Bolder", size: "Medium" },
                    { type: "TextBlock", text: `Restaurant ID: ${reservation.restaurant_id}` },
                    { type: "TextBlock", text: `Date and Time: ${reservation.reservation_date}` },
                    { type: "TextBlock", text: `Special Requests: ${reservation.special_requests || 'None'}` }
                ],
                actions: [],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: "1.2"
            };

            await step.context.sendActivity({ attachments: [{ contentType: "application/vnd.microsoft.card.adaptive", content: card }] });
        } catch (error) {
            await step.context.sendActivity('Sorry, I couldn\'t make a reservation at this time.');
        }

        return await step.endDialog();
    }
}

module.exports.ReservationDialog = ReservationDialog;
