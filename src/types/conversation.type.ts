import { Document } from "mongoose";

export interface TContent {
  id: string;
  content: string;
  role: "assistant" | "user";
  isShow?: boolean;
  timestamp: Date;
}

export interface TConversation extends Document {
  _id: any;
  userId: string;
  title: string;
  content: TContent[];
  __v: number;
}

export type PartialConversation = Partial<TConversation>;
export type OmitConversation = Omit<TConversation, "_id" | "__v">;
