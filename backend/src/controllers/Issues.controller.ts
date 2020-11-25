import { Middleware, Controller, GET, POST, PATCH, DELETE } from "../core";
import { Request, Response } from "express";
import loggerMiddleware from "../middleware/logger";
import { Issue } from "interfaces/Issue.interface";
import { Priority } from "../enums/priority.enum";

@Middleware(loggerMiddleware)
@Controller("issues")
export class IssuesController {
  constructor() {}

  @GET()
  public index(req: Request, res: Response) {
    res.send("Healthy");
  }

  @POST("/:projectID")
  public create(req: Request, res: Response) {
    const { projectID } = req.params;
    const issue: Issue = {
      assignee: 1,
      description: "idk",
      priority: Priority.low,
      status: "idk",
      title: "idk",
    };
    res.json(issue);
  }

  @GET("/:projectID")
  public read(req: Request, res: Response) {
    const issues: Issue[] = [
      {
        assignee: 1,
        description: "idk",
        priority: Priority.low,
        status: "idk",
        title: "idk",
      },
    ];
    res.json(issues);
  }

  @PATCH("/:projectID/:id")
  public update(req: Request, res: Response) {
    const issue: Issue = {
      assignee: 1,
      description: "idk",
      priority: Priority.low,
      status: "idk",
      title: "idk",
    };
    res.json(issue);
  }

  @DELETE("/:projectID/:id")
  public delete(req: Request, res: Response) {
    res.send(200);
  }
}
