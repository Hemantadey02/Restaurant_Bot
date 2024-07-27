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
        // this.promptForRestaurantId.bind(this),
        this.displayMenu.bind(this)
      ]));

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async promptForRestaurantId(step) {
    return await step.prompt(TEXT_PROMPT, 'Please provide the restaurant ID to explore the menu.');
  }

  async displayMenu(step) {
    const { restaurantId } = step.options;
    // console.log(restaurantId);
    try {
      const response = await axios.get(`http://localhost:3000/api/restaurants/${restaurantId}/menus`);
      const menus = response.data;
      // console.log(menus);
      if (menus && menus.length > 0) {
        const attachments = menus.map((menu) => {
          const card = createMenuCard(menu);
          const attachment = {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: card,
          };
          return attachment;
        });
        // console.log(attachments);
        let message = 'Here are the menu items of the choosen restaurant : ';
        await step.context.sendActivity(message);
        await step.context.sendActivity({ attachments });
      }
      else {
        await step.context.sendActivity('Sorry, I couldn\'t find any menus for this restaurant.');
      }
    } catch (error) {
      await step.context.sendActivity('Sorry, I couldn\'t find any menus for this restaurant.');
    }
    return await step.endDialog();
  }
}

module.exports.MenuDialog = MenuDialog;
