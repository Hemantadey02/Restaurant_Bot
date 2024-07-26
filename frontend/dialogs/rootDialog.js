const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');

const ROOT_DIALOG = 'rootDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
const TEXT_PROMPT = 'textPrompt';

class RootDialog extends ComponentDialog {
  constructor() {
    super(ROOT_DIALOG);

    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
        this.promptForAction.bind(this),
        this.routeToDialog.bind(this)
      ]));

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async promptForAction(step) {
    return await step.prompt(TEXT_PROMPT, 'Would you like to make a reservation, place an order, or explore the restaurants and menus?');
  }

  async routeToDialog(step) {
    const action = step.result.toLowerCase();

    if (action.includes('reservation')) {
      return await step.beginDialog('reservationDialog');
    } else if (action.includes('order')) {
      return await step.beginDialog('orderDialog');
    } else if (action.includes('menu')) {
      return await step.beginDialog('menuDialog');
    } else if (action.includes('restaurant')) {
      return await step.beginDialog('restaurantDialog');
    } else {
      await step.context.sendActivity('I\'m sorry, I didn\'t understand that. Please choose to make a reservation, place an order, or explore the menu.');
      return await step.replaceDialog(ROOT_DIALOG);
    }
  }
}

module.exports.RootDialog = RootDialog;
