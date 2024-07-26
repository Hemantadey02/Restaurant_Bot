const { MessageFactory } = require('botbuilder');

function createMenuCard(menuItems) {
    const cardTemplate = {
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.3",
        body: menuItems.map(item => ({
            type: "Container",
            items: [
                {
                    type: "TextBlock",
                    text: item.name,
                    weight: "Bolder",
                    size: "Medium"
                },
                {
                    type: "TextBlock",
                    text: item.description,
                    wrap: true
                },
                {
                    type: "TextBlock",
                    text: `$${item.price}`,
                    weight: "Bolder",
                    color: "Good"
                },
                {
                    type: "Image",
                    url: item.image_url,
                    size: "Medium",
                    altText: item.name
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

module.exports = { createMenuCard };
