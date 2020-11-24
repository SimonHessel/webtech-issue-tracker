import * as express from "express";
import { Application } from "express";
import IController from "./interfaces/IController.interface";

export default class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; controllers: any }) {
    this.app = express();
    this.port = appInit.port;

    this.routes(appInit.controllers);
  }

  private routes(controllers: {
    forEach: (arg0: (controller: IController) => void) => void;
  }) {
    controllers.forEach((controller) => {
      this.app.use("/" + controller.path, controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}
