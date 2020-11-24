import { IController, IMiddleware } from "core";
import * as express from "express";
import { Application } from "express";

export class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middleWares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: IMiddleware) => void) => void;
  }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: {
    forEach: (arg0: (controller: IController) => void) => void;
  }) {
    controllers.forEach((controller) => {
      controller.initRoutes();
      this.app.use("/" + controller.path, controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}
