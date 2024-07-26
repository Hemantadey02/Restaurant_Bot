const { MessageFactory } = require('botbuilder');

function createRestaurantCard(restaurants) {
    const cardTemplate = {
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.3",
        body: restaurants.map(restaurant => ({
            type: "Container",
            items: [
                {
                    type: "ColumnSet",
                    columns: [
                        {
                            type: "Column",
                            width: 2,
                            items: [
                                {
                                    type: "TextBlock",
                                    text: restaurant.name,
                                    weight: "Bolder",
                                    size: "ExtraLarge",
                                    color: "Warning",
                                    style: "Heading"
                                },
                                {
                                    type: "ColumnSet",
                                    columns: [
                                        {
                                            type: "Column",
                                            width: 1,
                                            items: [
                                                {
                                                    type: "TextBlock",
                                                    text: restaurant.location,
                                                    weight: "Bolder",
                                                    color: "Good"
                                                },
                                            ]
                                        },
                                        {
                                            type: "Column",
                                            width: 1,
                                            items: [
                                                {
                                                    type: "TextBlock",
                                                    text: restaurant.cuisine,
                                                    weight: "Bolder",
                                                    color: "Good"
                                                },

                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "ColumnSet",
                                    columns: [
                                        {
                                            type: "Column",
                                            width: 1,
                                            items: [
                                                {
                                                    type: "TextBlock",
                                                    text: `${restaurant.rating} starts`,
                                                    weight: "Bolder",
                                                    color: "Dark"
                                                },

                                            ]
                                        },
                                        {
                                            type: "Column",
                                            width: 1,
                                            items: [
                                                {
                                                    type: "TextBlock",
                                                    text: restaurant.price_range,
                                                    weight: "Bolder",
                                                    color: "Dark"
                                                },

                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "TextBlock",
                                    text: restaurant.description,
                                    size: "Small",
                                    color: "Accent",
                                    // style: "Heading"
                                }
                            ]
                        },
                        {
                            type: "Column",
                            width: 1,
                            items: [
                                {
                                    type: "Image",
                                    url: restaurant.image_url,
                                    size: "Medium",
                                    horizontalAlignment: "Right",
                                    altText: restaurant.name
                                }
                            ]
                        }
                    ]
                }
            ]
        }))
    };

    return MessageFactory.attachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: cardTemplate
    });
}

module.exports = { createRestaurantCard };
