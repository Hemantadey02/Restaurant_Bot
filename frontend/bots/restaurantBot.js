const { ActivityHandler, MessageFactory, MemoryStorage, ConversationState } = require('botbuilder');
const { DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const { MenuDialog } = require('../dialogs/menuDialog');
const { OrderDialog } = require('../dialogs/orderDialog');
const { ReservationDialog } = require('../dialogs/reservationDialog');
const { RestaurantDialog } = require('../dialogs/restaurantDialog');
const { RootDialog } = require('../dialogs/rootDialog');

const DIALOG_STATE_PROPERTY = 'dialogState';

class RestaurantBot extends ActivityHandler {
  constructor() {
    super();

    // Initialize MemoryStorage and ConversationState
    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

    this.dialogs = new DialogSet(this.dialogState);
    this.dialogs.add(new RootDialog());
    this.dialogs.add(new MenuDialog());
    this.dialogs.add(new OrderDialog());
    this.dialogs.add(new ReservationDialog());
    this.dialogs.add(new RestaurantDialog());

    this.onMessage(async (context, next) => {
      const dialogContext = await this.dialogs.createContext(context);
      const result = await dialogContext.continueDialog();

      if (context.activity.value) {
        switch (context.activity.value.title) {
          case "Visit Menu":
            await context.sendActivity(`You selected : ${context.activity.value.title}`);
            await dialogContext.beginDialog("menuDialog", {
              restaurantId: context.activity.value.restaurantId,
            });
            break;
            case "Book Reservation":
            await context.sendActivity(`You selected : ${context.activity.value.title}`);
            await dialogContext.beginDialog("reservationDialog", {
              restaurantId: context.activity.value.restaurantId,
            });
            break;
        }
      } else if (result.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog("rootDialog");
      }

      await this.conversationState.saveChanges(context);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const welcomeMessage = 'Welcome to the Restaurant Bot! How can I assist you today?';
      await context.sendActivity(MessageFactory.text(welcomeMessage, welcomeMessage));
      await next();
    });
  }
}

module.exports.RestaurantBot = RestaurantBot;
