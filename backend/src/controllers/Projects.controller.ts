import { Controller, DELETE, GET, MethodMiddleware, PATCH, POST } from "core";
import { Project } from "entities/project.entity";
import { Request, Response } from "express";
import { ProjectDTO } from "interfaces/Project.dto";
import { TokenData } from "interfaces/tokenData.interface";
import { JWT } from "middlewares/jwt.middleware";
import {
  ProjectSecurity,
  ProjectSecurityMiddleware,
} from "middlewares/projectSecurity.middleware";
import { Serializer } from "middlewares/serlizer.middleware";
import { JWTService } from "services/jwt.service";
import { ProjectService } from "services/project.service";
import { UserService } from "services/user.service";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@JWT()
@ProjectSecurity({ all: false })
@Serializer()
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
  public async read(
    req: Request<
      unknown,
      unknown,
      unknown,
      { skip?: string; take?: string; search?: string }
    >,
    res: Response
  ) {
    const { projects: ids } = res.locals.tokenData as TokenData;
    const skip = parseInt(req.query.skip || "0", 10);
    const take = parseInt(req.query.take || "10", 10);
    const { search } = req.query;

    if (isNaN(skip) || isNaN(take))
      return res.status(400).send("id not a number");

    try {
      const projects = await this.projectService.findByIDs(
        ids,
        skip,
        take,
        search
      );
      res.send(projects);
    } catch (error) {
      res.status(501).send(`${error}`);
    }
  }

  @MethodMiddleware(ProjectSecurityMiddleware)
  @GET("/:projectID")
  public async project(
    req: Request<{ projectID: string }, unknown, unknown>,
    res: Response
  ) {
    const id = parseInt(req.params.projectID);
    if (isNaN(id)) return res.status(400).send("id not a number");

    try {
      const project = await this.projectService.findByID(id);
      res.send(project);
    } catch (error) {
      res.status(501).send(`${error}`);
    }
  }

  @MethodMiddleware(ProjectSecurityMiddleware)
  @PATCH("/:projectID")
  public async update(
    req: Request<
      { projectID: string },
      unknown,
      QueryDeepPartialEntity<Project>
    >,
    res: Response<Project | string>
  ) {
    const id = parseInt(req.params.projectID);
    if (isNaN(id)) return res.status(400).send("id not a number");
    const updatedProject = req.body;
    if (!updatedProject) return res.status(400).send("Body malformed.");
    try {
      const project = await this.projectService.updateProject(
        id,
        updatedProject
      );
      res.send(project);
    } catch (error) {
      res.status(501).send(`${error}`);
    }
  }

  @DELETE("/:projectID")
  public async delete(req: Request<{ projectID: string }>, res: Response) {
    const id = parseInt(req.params.projectID);
    if (isNaN(id)) return res.status(400).send("id not a number");
    try {
      if (this.projectService.deleteProject(id)) return res.status(200).send();

      res.status(404).send();
    } catch (error) {
      res.status(500).send(`${error}`);
    }
  }
}
