const { ComponentDialog, WaterfallDialog, WaterfallStepContext, DialogTurnResult, TextPrompt } = require('botbuilder-dialogs');
const axios = require('axios');

const ORDER_DIALOG = 'orderDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
const TEXT_PROMPT = 'textPrompt';

class OrderDialog extends ComponentDialog {
  constructor() {
    super(ORDER_DIALOG);

    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
        this.promptForOrderDetails.bind(this),
        this.processOrder.bind(this)
      ]));

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async promptForOrderDetails(step) {
    return await step.prompt(TEXT_PROMPT, 'Please provide the details of your order.');
  }

  async processOrder(step) {
    const orderDetails = step.result;
    try {
      const response = await axios.post('http://localhost:3000/api/orders', { orderDetails });
      const order = response.data;

      await step.context.sendActivity(`Your order has been placed successfully! Order ID: ${order.id}`);
    } catch (error) {
      await step.context.sendActivity('Sorry, I couldn\'t place your order at this time.');
    }
    return await step.endDialog();
  }
}

module.exports.OrderDialog = OrderDialog;
