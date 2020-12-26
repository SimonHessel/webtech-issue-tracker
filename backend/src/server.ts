import { AuthController } from "controllers/AuthController.controller";
import { HealthController } from "controllers/Health.controller";
import { IssuesController } from "controllers/Issues.controller";
import { ProjectsController } from "controllers/Projects.controller";
import { UsersController } from "controllers/Users.controller";
import { App, log } from "core";

import * as cookieParser from "cookie-parser";
import * as cors from "cors";

import "reflect-metadata";
import { createConnection } from "typeorm";

console.time("start");
createConnection({
  name: "default",
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  dropSchema: false,
  logging: process.env.LOGGING!.toLocaleLowerCase() === "true",
  synchronize: process.env.DATABASE_SYNCHRONIZE!.toLocaleLowerCase() === "true",
})
  .then(() => {
    console.timeEnd("start");
    log("DatabaseService", "Initlized");
    const app = new App({
      port: 5000,
      controllers: [
        HealthController,
        IssuesController,
        ProjectsController,
        AuthController,
        UsersController,
      ],
      middlewares: [
        cookieParser(),
        cors({
          credentials: true,
          exposedHeaders: process.env.ACCESS_TOKEN_HEADER_NAME!,
          origin: process.env.FRONTEND_DOMAINS!.split(","),
        }),
      ],
    });

    app.listen();
  })
  .catch((e) => console.log(e));
