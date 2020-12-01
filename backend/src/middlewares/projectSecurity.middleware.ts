import { NextFunction, Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Middleware, IMiddleware, Service, Options } from "core";
import { User } from "entities/user.entity";
import { TokenData } from "interfaces/tokenData.interface";
import { JWTService } from "services/jwt.service";

@Service()
export class ProjectSecurityMiddleware implements IMiddleware {
  private userRepository: Repository<User>;
  constructor(private jwtService: JWTService) {
    this.userRepository = getRepository(User);
  }
  async middleware(
    req: Request<{ projectID: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    const projectID = parseInt(req.params.projectID);
    const tokenData: TokenData = res.locals.tokenData;
    if (tokenData.projects.some((id) => id === projectID)) next();
    else {
      const [user] = await this.userRepository.find({
        relations: ["projects"],
        where: {
          username: tokenData.username,
        },
      });
      if (!user) return res.status(403).send("User does not exist.");
      if (user.projects.some((project) => project.id === projectID)) {
        this.jwtService.updateToken(
          res,
          {
            projects: user.projects.map((project) => project.id),
          },
          tokenData
        );
        next();
      } else res.status(403).send("No permissions for this project");
    }
  }
}

export const ProjectSecurity = (options?: Options) =>
  Middleware<ProjectSecurityMiddleware>(ProjectSecurityMiddleware, options);
