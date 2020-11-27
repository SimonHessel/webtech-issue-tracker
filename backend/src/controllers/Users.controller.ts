import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Controller, DELETE, GET, Middleware, PATCH, POST } from "../core";
import { User } from "../entities";
import { UserDTO } from "../interfaces";
import { loggerMiddleware } from "../middleware";

@Middleware(loggerMiddleware)
@Controller("users")
export class UsersController {
  userRepository = getRepository(User);
  constructor() {}

  @POST("/")
  public async create(
    req: Request<{ projectid: number }, {}, UserDTO>,
    res: Response<User>
  ) {
    res.sendStatus(200);
  }

  @GET("/")
  public async read(req: Request<{}, {}, any>, res: Response<User[]>) {
    const users = await this.userRepository.find();
    res.send(users);
  }

  @PATCH("/:id")
  public async update(
    req: Request<{ id: number }, {}, UserDTO>,
    res: Response<User>
  ) {
    const { id } = req.params;
    const user = req.body;

    const updatedUser = await this.userRepository.save({ id, ...user });
    res.send(updatedUser);
  }

  @DELETE("/:id")
  public async delete(req: Request<{ id: number }, {}, any>, res: Response) {
    const { id } = req.params;
    const result = await this.userRepository.delete(id);
    if (result) res.sendStatus(200);
    else res.sendStatus(404);
  }
}
