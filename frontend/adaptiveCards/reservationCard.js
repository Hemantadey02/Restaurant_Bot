const { MessageFactory } = require('botbuilder');

function createReservationCard(restaurant_id,reservation_date,special_requests) {
    const cardTemplate = {
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.3",
        body: [
            {
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
                        text: `Restaurant ID : ${restaurant_id}`,
                        wrap: true
                    },
                    {
                        type: "TextBlock",
                        text: `Reservation Date : ${reservation_date}`,
                        wrap: true
                    },
                    {
                        type: "TextBlock",
                        text: `Special Requests : ${special_requests}`,
                        wrap: true
                    },
                ],
                separator: true
            }
        ]
    };

    return MessageFactory.attachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: cardTemplate
    });
}

module.exports = { createReservationCard };