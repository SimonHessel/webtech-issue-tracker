import { Controller, DELETE, GET, PATCH, POST } from "core";
import { Project } from "entities/project.entity";
import { Request, Response } from "express";
import { ProjectDTO } from "interfaces/Project.dto";
import { TokenData } from "interfaces/tokenData.interface";
import { JWT } from "middlewares/jwt.middleware";
import { JWTService } from "services/jwt.service";
import { ProjectService } from "services/project.service";
import { UserService } from "services/user.service";

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
    const { username } = res.locals.tokenData as TokenData;
    const user = await this.userService.findUserByName(username);
    res.send(!user ? [] : user.projects);
  }

  @PATCH("/:id")
  public async update(req: Request<{ id: number }>, res: Response<Project>) {
    const { id } = req.params;
    const oldProject = await this.projectService.findByID(id);
    if (!!oldProject) {
      const project = await this.projectService.updateProject(id, oldProject);
      res.send(project);
    }
    res.status(400);
  }

  @DELETE("/:id")
  public delete(req: Request, res: Response) {
    res.sendStatus(200);
  }
}
