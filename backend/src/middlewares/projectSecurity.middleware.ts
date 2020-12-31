import {
  IMiddleware,
  InjectRepository,
  Middleware,
  Options,
  Injectable,
} from "core";
import { User } from "entities/user.entity";
import { NextFunction, Request, Response } from "express";
import { TokenData } from "interfaces/tokenData.interface";
import { JWTService } from "services/jwt.service";
import { Repository } from "typeorm";

@Injectable()
export class ProjectSecurityMiddleware implements IMiddleware {
  constructor(
    private jwtService: JWTService,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
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
