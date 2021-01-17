import { BaseStructure, Controller, DELETE, GET, PATCH, POST } from "core";
import { Issue } from "entities/issue.entity";
import { Request, Response } from "express";
import { IssueDTO } from "interfaces/Issue.dto";
import { JWT } from "middlewares/jwt.middleware";
import { ProjectSecurity } from "middlewares/projectSecurity.middleware";
import { Serializer } from "middlewares/serlizer.middleware";
import { IssueService } from "services/issue.service";

@JWT()
@ProjectSecurity()
@Serializer()
@Controller("issues")
export class IssuesController extends BaseStructure {
  constructor(private issueService: IssueService) {
    super();
  }

  @POST("/:projectID")
  public async create(
    req: Request<{ projectID: string }, unknown, IssueDTO>,
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
    req: Request<
      { projectID: string },
      unknown,
      unknown,
      {
        skip?: string;
        take?: string;
        assignee?: string;
        status: string;
        search: string;
        priority: string;
      }
    >,
    res: Response
  ) {
    const { projectID } = req.params;
    const skip = parseInt(req.query.skip || "0", 10);
    const take = parseInt(req.query.take || "50", 10);

    const { assignee, search } = req.query;
    const filter: Parameters<IssueService["getProjectIssues"]>[3] = {
      assignee,
      search,
    };

    const priority = parseInt(req.query.priority);
    if (!isNaN(priority)) filter.priority = priority;

    const status = parseInt(req.query.status);
    if (!isNaN(status)) filter.status = status;

    const issues = await this.issueService.getProjectIssues(
      projectID,
      skip,
      take,
      filter
    );
    res.send(issues);
  }

  @GET("/:projectID/:id")
  public async singleIssue(
    req: Request<{ projectID: string; id: string }, unknown, unknown>,
    res: Response
  ) {
    const { id } = req.params;
    try {
      const issue = await this.issueService.getIssueByID(id);
      res.send(issue);
    } catch (error) {
      this.error(error);
      res.status(400).send("Issue not found");
    }
  }

  @PATCH("/:projectID/:id")
  public async update(
    req: Request<
      { projectID: string; id: string },
      unknown,
      Parameters<IssueService["updateIssue"]>[1]
    >,
    res: Response
  ) {
    const { id } = req.params;
    const issuePartial = req.body;

    try {
      const issue = await this.issueService.updateIssue(id, issuePartial);
      res.send(issue);
    } catch (error) {
      this.error(error);
      res.status(400).send("Issue not found");
    }
  }

  @PATCH("/:projectID/:id/reorder")
  public async move(
    req: Request<
      { projectID: string; id: string },
      unknown,
      {
        position: number;
        status: number;
      }
    >,
    res: Response
  ) {
    const { id, projectID } = req.params;

    const { position, status } = req.body;
    if (!id || !projectID || !position)
      return res.status(400).send("IDs and or Position are undefined.");
    try {
      await this.issueService.updateIssueStatusAndOrder(
        projectID,
        id,
        position,
        status
      );
      return res.sendStatus(200);
    } catch (error) {
      return res.status(400).send(error);
    }
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
