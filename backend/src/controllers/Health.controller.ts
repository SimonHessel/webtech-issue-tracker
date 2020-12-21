import { Request, Response } from "express";
import { Controller, GET, ApiSummary } from "core";

@Controller("health")
export class HealthController {
  constructor() {}

  @GET("/")
  @ApiSummary("Health endpoint")
  public index(req: Request, res: Response) {
    res.send("Healthy");
  }
}
