import Conversation from "../models/Conversation";
import { Request, Response } from "express";
import {
  TConversation,
  OmitConversation,
  TContent,
} from "../types/conversation.type";
import { JwtPayload } from "../types/auth.types";
import { verifyToken } from "../middleware/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

class ConversationController {
  public createConversation = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const conversation: OmitConversation = req.body as OmitConversation;
        const { _id }: { _id?: string } = req.user as JwtPayload;
        if (!conversation.title || !conversation.content || !_id) {
          res.status(400).json({
            status: 400,
            message: "All field is required",
          });
          return;
        }

        const newConversation = new Conversation({
          userId: _id,
          title: conversation.title,
          content: conversation.content,
        });

        await newConversation.save();

        res.status(201).json({
          status: 201,
          data: newConversation,
          message: "Conversation successfully created",
        });

        return;
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
        });

        return;
      }
    },
  ];

  public getConversationByConversationId = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const {
          conversationId,
        }: { conversationId: string | null | undefined } = req.params as {
          conversationId: string;
        };

        if (!conversationId) {
          res.status(400).json({
            status: 400,
            message: "Conversation Id is required, but not provide",
          });
          return;
        }

        const conversation: TConversation | null = await Conversation.findById(
          conversationId
        );

        if (!conversation) {
          res.status(404).json({
            status: 404,
            message: "Conversation not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          data: conversation,
          message: "Conversation founded",
        });

        return;
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    },
  ];

  public getConversationsByUserId = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { _id }: { _id?: string } = req.user as JwtPayload;
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const skip: number = (page - 1) * limit;

        if (!_id) {
          res.status(400).json({
            status: 400,
            message: "Auth ID is required, but not provided",
          });
          return;
        }

        const total = await Conversation.countDocuments({ userId: _id });

        const conversations: TConversation[] = await Conversation.find({
          userId: _id,
        })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }); // opsional: urutkan dari terbaru

        if (conversations.length === 0) {
          res.status(404).json({
            status: 404,
            message: "Conversations not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          data: conversations,
          totalData: total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          message: `${
            conversations.length === 1
              ? "1 conversation"
              : conversations.length + " conversations"
          } founded`,
        });

        return;
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
        return;
      }
    },
  ];

  public deleteConversationByConversationId = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { conversationId }: { conversationId?: string } = req.params as {
          conversationId: string;
        };

        if (!conversationId) {
          res.status(400).json({
            status: 400,
            message: "Conversation ID is required, but not provided",
          });
          return;
        }

        const deletedConversation: TConversation | null =
          await Conversation.findByIdAndDelete(conversationId);

        if (!deletedConversation) {
          res.status(404).json({
            status: 404,
            message: "Conversation not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "Conversation successfully deleted",
        });

        return;
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    },
  ];

  public addContentByConversationId = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { conversationId }: { conversationId?: string } = req.params as {
          conversationId: string;
        };

        const { id, content, role, timestamp }: TContent = req.body as TContent;

        if (!conversationId) {
          res.status(400).json({
            status: 400,
            message: "Conversation ID is required, but no provided",
          });
          return;
        }

        if (!id || !content || !role || !timestamp) {
          res.status(400).json({
            status: 400,
            message: "All field is required",
          });
          return;
        }

        const conversation: TConversation | null = await Conversation.findById(
          conversationId
        );

        if (!conversation) {
          res.status(404).json({
            status: 404,
            message: "Conversation not found",
          });
          return;
        }

        const addNewContent: TContent[] = [
          ...conversation.content,
          { id, content, role, timestamp },
        ];

        conversation.set("content", [...addNewContent]);

        await conversation.save();

        res.status(200).json({
          status: 200,
          data: conversation.content,
          message: "Add content successfully",
        });
        return;
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    },
  ];
}

export default new ConversationController();
