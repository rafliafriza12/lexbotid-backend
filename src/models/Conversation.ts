import mongoose, { Schema } from "mongoose";
import { PartialConversation } from "../types/conversation.type";

class ConversationSchema {
  private Conversation: mongoose.Schema<PartialConversation>;

  constructor() {
    this.Conversation = this.initialSchema();
  }

  private initialSchema = (): mongoose.Schema<PartialConversation> => {
    return new Schema<PartialConversation>(
      {
        topicId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        content: {
          type: [
            {
              id: {
                type: String,
                required: true,
              },
              content: {
                type: String,
                required: true,
              },
              role: {
                type: String,
                enum: ["assistant", "user"],
                required: true,
              },
              isShow: {
                type: Boolean,
                default: true,
              },
              timestamp: {
                type: Date,
                required: true,
              },
            },
          ],
          required: true,
        },
      },
      { timestamps: true }
    );
  };

  public getSchema = (): mongoose.Model<PartialConversation> => {
    return mongoose.model("conversations", this.Conversation);
  };
}

export default new ConversationSchema().getSchema();
