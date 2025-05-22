import { Document } from "mongoose";

export interface TContent {
  id: string;
  content: string;
  role: "assistant" | "user";
  isShow: boolean | null;
  timestamp: Date;
}

export interface TConversation extends Document {
  _id: any;
  topicId: string;
  title: string;
  content: TContent[];
  __v: number;
}

export type PartialConversation = Partial<TConversation>;
