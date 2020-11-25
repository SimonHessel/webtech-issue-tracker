import { App } from "./core";
import "reflect-metadata";

import { HealthController } from "./controllers/Health.controller";

const app = new App({
  port: 5000,
  controllers: [new HealthController()],
  middleWares: [],
});

app.listen();
