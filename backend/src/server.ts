import { App } from "./core";
import "reflect-metadata";

import { HealthController } from "./controllers/Health/Health.controller";
import { IssuesController } from "./controllers/Issues.controller";

const app = new App({
  port: 5000,
  controllers: [new HealthController(), new IssuesController()],
  middleWares: [],
});

app.listen();
