import { Request, Response } from "express";
import { Controller, DELETE, GET, PATCH, POST } from "../core";
import { ProjectDTO } from "../interfaces/Project.dto";
import { TokenData } from "../interfaces/tokenData.interface";
import { JWT } from "../middleware/jwt.middleware";
import { JWTService, ProjectService } from "../services";
import { UserService } from "../services/user.service";

@JWT()
@Controller("projects")
export class ProjectsController {
  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private jwtService: JWTService
  ) {}

  @POST("/")
  public async create(
    req: Request<Record<string, never>, unknown, ProjectDTO>,
    res: Response
  ) {
    const { username, projects } = res.locals.tokenData as TokenData;
    const { title, description } = req.body;
    if (!title || !description)
      res.status(400).send("Title or description are not defined");
    try {
      const project = await this.projectService.createProject(
        title,
        description,
        username
      );
      this.jwtService.updateToken(
        res,
        { projects: [...projects, project.id] },
        res.locals.tokenData
      );
      res.send(project);
    } catch (error) {
      console.log("error:", error);
      res.status(400).send(error);
    }
  }

  @GET("/")
  public async read(req: Request, res: Response) {
    console.log(res.locals.tokenData);
    const { username } = res.locals.tokenData as TokenData;
    const user = await this.userService.findUserByName(username);
    res.send(!user ? [] : user.projects);
  }

  @PATCH("/:id")
  public update(req: Request, res: Response) {
    res.send();
  }

  @DELETE("/:id")
  public delete(req: Request, res: Response) {
    res.send();
  }
}
