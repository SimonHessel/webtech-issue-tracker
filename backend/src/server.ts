import "reflect-metadata";
import App from "./core/app";

import { HealthController } from "./controllers/Health/Health.controller";

const app = new App({
  port: 5000,
  controllers: [new HealthController()],
});

app.listen();
