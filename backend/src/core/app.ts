import { IMiddleware } from "core/interfaces";
import { isMultiMiddleware } from "./utils/middlware.util";
import * as express from "express";
import { Application } from "express";
import { Injector } from "./injector";
import { log } from "./utils";
import { SwaggerGenerator } from "./Swagger";
import * as swaggerUi from "swagger-ui-express";

export class App {
  public app: Application;
  public port: number;
  private controllers: any[];

  constructor(appInit: {
    port: number;
    controllers: any[];
    middlewares: (
      | IMiddleware["middleware"]
      | { path: string; middlewares: IMiddleware["middleware"][] }
    )[];
  }) {
    this.app = express();
    this.port = appInit.port;

    this.app.use(express.json());

    appInit.middlewares.forEach((middleware) =>
      isMultiMiddleware(middleware)
        ? this.app.use(middleware.path, ...middleware.middlewares)
        : this.app.use(middleware)
    );

    this.controllers = appInit.controllers.map((controller) =>
      Injector.resolve<any>(controller)
    );

    if (process.env.NODE_ENV !== "production") this.initSwagger();

    this.routes();
  }

  private initSwagger() {
    const swagger = new SwaggerGenerator(
      "Swagger UI",
      "v1.0.0",
      "IssueTracker",
      "localhost:5000",
      "/api-docs",
      this.controllers
    ).export();

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
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
