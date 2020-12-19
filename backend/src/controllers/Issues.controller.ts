import { Controller, DELETE, GET, InjectRepository, PATCH, POST } from "core";
import { Issue } from "entities/issue.entity";
import { Request, Response } from "express";
import { IssueDTO } from "interfaces/Issue.dto";
import { JWT } from "middlewares/jwt.middleware";
import { ProjectSecurity } from "middlewares/projectSecurity.middleware";
import { IssueService } from "services/issue.service";
import { ProjectService } from "services/project.service";
import { UserService } from "services/user.service";

@JWT()
@ProjectSecurity({ all: false })
@Controller("issues")
export class IssuesController {
  constructor(
    private issueService: IssueService,
    private userService: UserService,
    @InjectRepository() private projectService: ProjectService
  ) {}

  @POST("/:projectID")
  public async create(
    req: Request<{ projectID: number }, unknown, IssueDTO>,
    res: Response<Issue>
  ) {
    const { projectID } = req.params;

    const { assignee, ...issue } = req.body;

    const [user, project] = await Promise.all([
      this.userService.findUserByName(assignee),
      this.projectService.findByID(projectID),
    ]);

    if (!user || !project) return res.sendStatus(404);

    console.log(user, project);

    // const createdIssue = await this.issueRepository.save({
    //   ...issue,
    //   assignee: user,
    //   project,
    // });
    // res.send(createdIssue);
    res.sendStatus(200);
  }

  @GET("/:projectID")
  public async read(
    req: Request<{ projectID: number }, unknown, Record<string, never>>,
    res: Response<Issue[]>
  ) {
    console.log(req.body);
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
