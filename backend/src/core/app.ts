import { IMiddleware } from "core/interfaces";
import * as express from "express";
import { Application } from "express";
import { Injector } from "./injector";
import { log } from "./utils";

export class App {
  public app: Application;
  public port: number;
  private controllers: any[];

  constructor(appInit: {
    port: number;
    controllers: any[];
    middlewares: IMiddleware["middleware"][];
  }) {
    this.app = express();
    this.port = appInit.port;

    this.app.use(express.json());

    appInit.middlewares.forEach((middleware) => this.app.use(middleware));

    this.controllers = appInit.controllers.map((controller) =>
      Injector.resolve<any>(controller)
    );

    this.routes();
  }

  private routes() {
    this.controllers.forEach((controller) => {
      controller.initRoutes();
      this.app.use("/api/" + controller.path, controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      log("Application", `App listening on the http://localhost:${this.port}`);
    });
  }
}
