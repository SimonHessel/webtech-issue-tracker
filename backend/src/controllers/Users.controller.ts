import { BaseStructure, Controller, DELETE, GET, PATCH } from "core";
import { User } from "entities/user.entity";
import { Request, Response } from "express";
import { JWT } from "middlewares/jwt.middleware";
import { Serializer } from "middlewares/serlizer.middleware";
import { UserService } from "services/user.service";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@JWT()
@Serializer()
@Controller("users")
export class UsersController extends BaseStructure {
  constructor(private userService: UserService) {
    super();
  }

  @GET("/")
  public async search(
    req: Request<unknown, unknown, unknown, { search: string }>,
    res: Response
  ) {
    const { search } = req.query;

    if (!search) return res.status(400).send();

    try {
      const users = await this.userService.findUsers(search);
      return res.send(users);
    } catch (error) {
      this.error(error);
      res.status(400).send();
    }
  }

  @PATCH("/")
  public async update(
    req: Request<{ id: string }, unknown, QueryDeepPartialEntity<User>>,
    res: Response<User | string>
  ) {
    const { username } = res.locals.tokenData;
    if (!username) return res.status(400).send("JWT malformed.");

    const updatedUser = req.body;
    if (!updatedUser) return res.status(400).send("Body malformed.");
    try {
      const user = await this.userService.updateUser(username, updatedUser);
      return res.send(user);
    } catch (error) {
      res.status(501).send(`${error}`);
    }
  }

  @DELETE("/:id")
  public async delete(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response
  ) {
    const { username } = res.locals.tokenData;
    if (!username) return res.status(400).send("JWT malformed.");

    try {
      if (await this.userService.deleteUserByUsername(username))
        return res.status(200).send();

      res.status(404).send();
    } catch (error) {
      res.status(500).send(`${error}`);
    }
  }
}
