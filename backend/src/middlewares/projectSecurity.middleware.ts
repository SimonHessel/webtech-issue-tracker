import {
  IMiddleware,
  Injectable,
  InjectRepository,
  Middleware,
  Options,
} from "core";
import { NextFunction, Request, Response } from "express";
import { TokenData } from "interfaces/tokenData.interface";
import { UserRepository } from "repositories/user.repository";
import { JWTService } from "services/jwt.service";

@Injectable()
export class ProjectSecurityMiddleware implements IMiddleware {
  constructor(
    private jwtService: JWTService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
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
      try {
        const user = await this.userRepository.findByUsername(
          tokenData.username
        );

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
      } catch (error) {
        return res.status(403).send("User does not exist.");
      }
    }
  }
}

export const ProjectSecurity = (options?: Options) =>
  Middleware<ProjectSecurityMiddleware>(ProjectSecurityMiddleware, options);
