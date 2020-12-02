import { classToPlain } from "class-transformer";
import { IMiddleware, Middleware, Options, Service } from "core";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";
import { NextFunction, Request, Response } from "express";

@Service()
export class SerializerMiddleware implements IMiddleware {
  constructor() {}

  private isInstanceOf(item: any) {
    if (item instanceof User) return ["user"];
    if (item instanceof Project) return ["project"];
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
    res.json = function (body: any, ...args) {
      const groups: string[] =
        body instanceof Array
          ? body.length > 0
            ? that.isInstanceOf(body[0])
            : []
          : that.isInstanceOf(body);

      const sanitized = classToPlain(body, {
        enableCircularCheck: true,
        groups,
      }) as any;
      return oldjson.apply(this, [sanitized], ...args);
    };
    next();
  }
}

export const Serializer = (options?: Options) =>
  Middleware<SerializerMiddleware>(SerializerMiddleware, options);
