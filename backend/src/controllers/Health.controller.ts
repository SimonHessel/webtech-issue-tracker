import { Request, Response } from "express";
import { Controller, GET } from "../core";

@Controller("health")
export class HealthController {
  constructor() {}

  @GET()
  public index(req: Request, res: Response) {
    res.send("Healthy");
  }
}
