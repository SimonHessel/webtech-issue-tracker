import { Request, Response } from "express";
import { Controller, GET, ApiSummary, BaseStructure } from "core";

@Controller("health")
export class HealthController extends BaseStructure {
  constructor() {
    super();
  }

  @GET("/")
  @ApiSummary("Health endpoint")
  public index(req: Request, res: Response) {
    res.send("Healthy");
  }
}
