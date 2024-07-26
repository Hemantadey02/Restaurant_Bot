const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const axios = require('axios');
const { createRestaurantCard } = require('../adaptiveCards/restaurantCard');

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
        // const cuisine = step.result;
        const response = await axios.get(`http://localhost:3000/api/restaurants`);
        const restaurants = response.data;
        // console.log(restaurants);

        if (restaurants) {
            let message = 'Here are some restaurants I found: \n';
            const restaurantCard = createRestaurantCard(restaurants);
            await step.context.sendActivity(message);
            await step.context.sendActivity(restaurantCard);
        } else {
            await step.context.sendActivity('Sorry, I couldn\'t find any restaurants matching your criteria.');
        }

        return await step.endDialog();
    }
}

module.exports.RestaurantDialog = RestaurantDialog;
