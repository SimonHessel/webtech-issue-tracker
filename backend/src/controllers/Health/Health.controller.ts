import Controller from "../../core/decorators/controller.decorator";
import { GET } from "../../core/decorators/method.decorator";
import { Request, Response } from "express";

@Controller("health")
export class HealthController {
  constructor() {}

  @GET()
  public index(req: Request, res: Response) {
    res.send("Healthy");
  }
}
