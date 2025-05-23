import express from "express";
import ConversationController from "../controllers/ConversationController";

class ConversationRouter {
  private conversationRouter;

  constructor() {
    this.conversationRouter = express.Router();
    this.router();
  }

  private router = (): void => {
    this.conversationRouter.post(
      "/",
      ConversationController.createConversation
    );

    this.conversationRouter.get(
      "/:conversationId",
      ConversationController.getConversationByConversationId
    );

    this.conversationRouter.get(
      "/",
      ConversationController.getConversationsByUserId
    );

    this.conversationRouter.delete(
      "/:conversationId",
      ConversationController.deleteConversationByConversationId
    );

    this.conversationRouter.put(
      "/:conversationId",
      ConversationController.addContentByConversationId
    );
  };

  public getConversationRouter = (): express.Router => {
    return this.conversationRouter;
  };
}

export default new ConversationRouter().getConversationRouter();
