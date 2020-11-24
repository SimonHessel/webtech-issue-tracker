import { Middleware, Controller, GET } from "../../core";
import { Request, Response } from "express";
import loggerMiddleware from "../../middleware/logger";

@Middleware(loggerMiddleware)
@Controller("health")
export class HealthController {
  constructor() {}

  @GET()
  public index(req: Request, res: Response) {
    res.send("Healthy");
  }
}
