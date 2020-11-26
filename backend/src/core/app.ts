import { IController, IMiddleware } from "core";
import * as express from "express";
import { Application } from "express";
import { Injector } from "./injector";

export class App {
  public app: Application;
  public port: number;
  private controllers: any[];

  constructor(appInit: { port: number; middleWares: any; controllers: any[] }) {
    this.app = express();
    this.port = appInit.port;
    this.app.use(express.json());

    this.controllers = appInit.controllers.map((controller) =>
      Injector.resolve<any>(controller)
    );

    this.middlewares(appInit.middleWares);
    this.routes();
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: IMiddleware) => void) => void;
  }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes() {
    this.controllers.forEach((controller) => {
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
