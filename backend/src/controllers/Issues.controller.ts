import { Project } from "../entities/project.entity";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Controller, DELETE, GET, Middleware, PATCH, POST } from "../core";
import { Issue } from "../entities/issue.entity";
import loggerMiddleware from "../middleware/logger";
import { IssueDTO } from "../interfaces/Issue.dto";

@Middleware(loggerMiddleware)
@Controller("issues")
export class IssuesController {
  issueRepository = getRepository(Issue);
  projectRepository = getRepository(Project);
  constructor() {}

  @POST("/:projectID")
  public async create(
    req: Request<{ projectID: string }, {}, IssueDTO>,
    res: Response<Issue>
  ) {
    const { projectID } = req.params;
    const issue = req.body;
    res.sendStatus(200);
  }

  @GET("/:projectID")
  public read(
    req: Request<{ projectID: string }, {}, any>,
    res: Response<Issue[]>
  ) {
    const { projectID } = req.params;
    res.sendStatus(200);
  }

  @PATCH("/:projectID/:id")
  public update(
    req: Request<{ projectID: string; id: string }, {}, IssueDTO>,
    res: Response<Issue>
  ) {
    const { projectID, id } = req.params;
    res.sendStatus(200);
  }

  @DELETE("/:projectID/:id")
  public delete(
    req: Request<{ projectID: string; id: string }, {}, any>,
    res: Response
  ) {
    const { projectID, id } = req.params;
    res.sendStatus(200);
  }
}
