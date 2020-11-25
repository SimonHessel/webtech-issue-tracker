import { App } from "./core";
import "reflect-metadata";

import { IssuesController } from "./controllers/Issues.controller";
import { HealthController } from "./controllers/Health.controller";

const app = new App({
  port: 5000,
  controllers: [new HealthController(), new IssuesController()],
  middleWares: [],
});

app.listen();
