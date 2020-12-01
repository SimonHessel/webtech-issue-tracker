import * as express from "express";
import { Application } from "express";
import { log } from "./utils";
import { Injector } from "./injector";

export class App {
  public app: Application;
  public port: number;
  private controllers: any[];

  constructor(appInit: { port: number; controllers: any[] }) {
    this.app = express();
    this.port = appInit.port;
    this.app.use(express.json());

    this.controllers = appInit.controllers.map((controller) =>
      Injector.resolve<any>(controller)
    );

    this.routes();
  }

  private routes() {
    this.controllers.forEach((controller) => {
      controller.initRoutes();
      this.app.use("/" + controller.path, controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      log("Application", `App listening on the http://localhost:${this.port}`);
    });
  }
}
