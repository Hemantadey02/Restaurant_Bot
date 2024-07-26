const { ComponentDialog, WaterfallDialog, WaterfallStepContext, DialogTurnResult, TextPrompt } = require('botbuilder-dialogs');
// const { CardFactory } = require('botbuilder-core');
const axios = require('axios');
const { createMenuCard } = require('../adaptiveCards/menuCard');

const MENU_DIALOG = 'menuDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
const TEXT_PROMPT = 'textPrompt';

class MenuDialog extends ComponentDialog {
  constructor() {
    super(MENU_DIALOG);

    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
        this.promptForRestaurantId.bind(this),
        this.displayMenu.bind(this)
      ]));

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async promptForRestaurantId(step) {
    return await step.prompt(TEXT_PROMPT, 'Please provide the restaurant ID to explore the menu.');
  }

  async displayMenu(step) {
    const restaurantId = step.result;
    try {
      const response = await axios.get(`http://localhost:3000/api/restaurants/${restaurantId}/menus`);
      const menuItems = response.data;
      // console.log(menuItems);

      const menuCard = createMenuCard(menuItems);
      // console.log(card);

      await step.context.sendActivity(menuCard);
    } catch (error) {
      await step.context.sendActivity('Sorry, I couldn\'t find any menus for this restaurant.');
    }
    return await step.endDialog();
  }
}

module.exports.MenuDialog = MenuDialog;
