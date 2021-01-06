import { classToPlain } from "class-transformer";
import {
  IMiddleware,
  Middleware,
  Options,
  Injectable,
  BaseStructure,
} from "core";
import { Issue } from "entities/issue.entity";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class SerializerMiddleware extends BaseStructure implements IMiddleware {
  constructor() {
    super();
  }

  private isInstanceOf(item: unknown) {
    if (item instanceof User) return ["user"];
    if (item instanceof Project) return ["project"];
    if (item instanceof Issue) return ["issue"];
    return [];
  }
  async middleware(
    req: Request<{ projectID: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const oldjson = res.json;
    res.json = function (body: unknown, ...args) {
      const groups: string[] =
        body instanceof Array
          ? body.length > 0
            ? that.isInstanceOf(body[0])
            : []
          : that.isInstanceOf(body);

      const sanitized = classToPlain(body, {
        enableCircularCheck: true,
        groups,
      }) as unknown;
      return oldjson.apply(this, [sanitized], ...args);
    };
    next();
  }
}

export const Serializer = (options?: Options) =>
  Middleware<SerializerMiddleware>(SerializerMiddleware, options);
