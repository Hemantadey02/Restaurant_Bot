const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const axios = require('axios');
const { createRestaurantCard } = require('../adaptiveCards/restaurantCard');
const { MessageFactory } = require('botbuilder-core');

const RESTAURANT_DIALOG = 'restaurantDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
const TEXT_PROMPT = 'textPrompt';

class RestaurantDialog extends ComponentDialog {
    constructor() {
        super(RESTAURANT_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                // this.promptForCuisine.bind(this),
                this.searchRestaurants.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    // async promptForCuisine(step) {
    //     return await step.prompt(TEXT_PROMPT, 'What type of cuisine are you looking for?');
    // }

    async searchRestaurants(step) {
        try {
            // const cuisine = step.result;
            const response = await axios.get(`http://localhost:3000/api/restaurants`);
            const restaurants = response.data;
            // console.log(restaurants);

            if (restaurants && restaurants.length > 0) {
                const attachments = restaurants.map((restaurant) => {
                    const card = createRestaurantCard(restaurant);
                    const attachment = {
                        contentType: "application/vnd.microsoft.card.adaptive",
                        content: card,
                    };
                    return attachment;
                });
                // console.log(attachments);
                let message = 'Here are some restaurants I found : ';
                await step.context.sendActivity(message);
                await step.context.sendActivity({ attachments });
            } else {
                await step.context.sendActivity('Sorry, I couldn\'t find any restaurants matching your criteria.');
            }
        } catch (err) {
            await step.context.sendActivity('Sorry, I couldn\'t find any restaurants matching your criteria.');
        }

        return await step.endDialog();
    }
}

module.exports.RestaurantDialog = RestaurantDialog;
