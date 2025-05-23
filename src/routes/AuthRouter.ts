import express from "express";
import AuthController from "../controllers/AuthController";

class AuthRouter {
  private authRouter;

  constructor() {
    this.authRouter = express.Router();
    this.routes();
  }

  public getAuthRouter = (): express.Router => {
    return this.authRouter;
  };

  private routes() {
    this.authRouter.post("/", AuthController.register);
    this.authRouter.post("/login", AuthController.login);
    this.authRouter.post("/logout", AuthController.logout);
  }
}

export default new AuthRouter().getAuthRouter();
