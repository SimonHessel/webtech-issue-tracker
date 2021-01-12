import {
  BaseStructure,
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
export class ProjectSecurityMiddleware
  extends BaseStructure
  implements IMiddleware {
  constructor(
    private jwtService: JWTService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }
  async middleware(
    req: Request<{ projectID: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    const { projectID } = req.params;
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
        this.error(error);
        return res.status(403).send("User does not exist.");
      }
    }
  }
}

export const ProjectSecurity = (options?: Options) =>
  Middleware<ProjectSecurityMiddleware>(ProjectSecurityMiddleware, options);
