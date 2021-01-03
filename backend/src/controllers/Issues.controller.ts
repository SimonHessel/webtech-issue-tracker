import { Controller, DELETE, GET, PATCH, POST } from "core";
import { Issue } from "entities/issue.entity";
import { Request, Response } from "express";
import { IssueDTO } from "interfaces/Issue.dto";
import { JWT } from "middlewares/jwt.middleware";
import { ProjectSecurity } from "middlewares/projectSecurity.middleware";
import { IssueService } from "services/issue.service";

@JWT()
@ProjectSecurity()
@Controller("issues")
export class IssuesController {
  constructor(private issueService: IssueService) {}

  @POST("/:projectID")
  public async create(
    req: Request<{ projectID: number }, unknown, IssueDTO>,
    res: Response<Issue>
  ) {
    const { projectID } = req.params;

    const issue = req.body;

    try {
      const createdIssue = await this.issueService.createProjectIssue(
        projectID,
        issue
      );
      return res.send(createdIssue);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  @GET("/:projectID")
  public async read(
    req: Request<{ projectID: number }, unknown, Record<string, never>>,
    res: Response<Issue[]>
  ) {
    const { projectID } = req.params;
    const issues = await this.issueService.getProjectIssues(projectID);
    res.send(issues);
  }

  @PATCH("/:projectID/:id")
  public update(
    req: Request<{ projectID: string; id: string }, unknown, IssueDTO>,
    res: Response<Issue>
  ) {
    const { projectID, id } = req.params;
    res.sendStatus(200);
  }

  @DELETE("/:projectID/:id")
  public delete(
    req: Request<
      { projectID: string; id: string },
      unknown,
      Record<string, never>
    >,
    res: Response
  ) {
    const { projectID, id } = req.params;
    res.sendStatus(200);
  }
}
