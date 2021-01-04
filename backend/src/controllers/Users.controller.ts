import { Controller, DELETE, PATCH, POST } from "core";
import { User } from "entities/user.entity";
import { Request, Response } from "express";
import { UserDTO } from "interfaces/User.dto";
import { JWT } from "middlewares/jwt.middleware";
import { Serializer } from "middlewares/serlizer.middleware";
import { UserService } from "services/user.service";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@JWT()
@Serializer()
@Controller("users")
export class UsersController {
  constructor(private userService: UserService) {}

  @POST("/")
  public async create(
    req: Request<{ projectid: number }, unknown, UserDTO>,
    res: Response<User>
  ) {
    res.sendStatus(200);
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
    req: Request<{ id: number }, unknown, unknown>,
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
