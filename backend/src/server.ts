import { AuthController } from "controllers/AuthController.controller";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { HealthController } from "./controllers/Health.controller";
import { IssuesController } from "./controllers/Issues.controller";
import { App } from "./core";

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
    const app = new App({
      port: 5000,
      controllers: [HealthController, IssuesController, AuthController],
    });

    app.listen();
  })
  .catch((e) => console.log(e));
