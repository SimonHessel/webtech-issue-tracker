import { Request, Response } from "express";
import {
  Controller,
  DELETE,
  GET,
  InjectRepository,
  MethodMiddleware,
  PATCH,
  POST,
} from "../core";
import { Issue } from "../entities";
import { IssueDTO } from "../interfaces";
import {
  JWT,
  JWTMiddleware,
  ProjectSecurity,
  ProjectSecurityMiddleware,
} from "../middleware";
import { IssueService, ProjectService, UserService } from "../services";

@JWT()
@ProjectSecurity({ all: false })
// @ProjectSecurity
@Controller("issues")
export class IssuesController {
  constructor(
    // private userRepository: Repository<User>,
    // private projectRepository: Repository<Project>,
    // private issueRepository: Repository<Issue>
    private issueService: IssueService,
    private userService: UserService,
    @InjectRepository() private projectService: ProjectService
  ) {}

  @MethodMiddleware(JWTMiddleware)
  @MethodMiddleware(ProjectSecurityMiddleware)
  @POST("/:projectID")
  public async create(
    req: Request<{ projectID: number }, {}, IssueDTO>,
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

  @MethodMiddleware(JWTMiddleware)
  @MethodMiddleware(ProjectSecurityMiddleware)
  @GET("/:projectID")
  public async read(
    req: Request<{ projectID: number }, {}, any>,
    res: Response<Issue[]>
  ) {
    const { projectID } = req.params;
    const issues = await this.issueService.getProjectIssues(projectID);
    res.send(issues);
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
