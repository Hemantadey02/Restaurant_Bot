const { MessageFactory } = require('botbuilder');

function showAllReservationCard(reservations) {
    const cardTemplate = {
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.3",
        body: reservations.map(reservation => ({
            type: "Container",
            items: [
                {
                    type: "TextBlock",
                    text: "Reservation Confirmed",
                    weight: "Bolder",
                    size: "Large",
                    color: "Good"
                },
                {
                    type: "TextBlock",
                    text: `Restaurant ID : ${reservation.restaurant_id}`,
                    wrap: true
                },
                {
                    type: "TextBlock",
                    text: `Date : ${reservation.reservation_date}`,
                    wrap: true
                },
                {
                    type: "TextBlock",
                    text: `Special Requests : ${reservation.special_requests}`,
                    wrap: true
                }
            ],
            separator: true
        }))
    };

    return MessageFactory.attachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: cardTemplate
    });
}


module.exports = { showAllReservationCard };
