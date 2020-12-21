import { Request, Response } from "express";
import { Login } from "interfaces/login.interface";
import { AuthService } from "services/auth.service";
import { JWTService } from "services/jwt.service";
import { Controller, POST } from "core";

@Controller("auth")
export class AuthController {
  constructor(
    private jwtService: JWTService,
    private authService: AuthService
  ) {}

  @POST("/login")
  public async login(
    req: Request<Record<string, never>, unknown, Login>,
    res: Response
  ) {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password)
      return res
        .status(401)
        .send("Username/Email or Password were not defined");

    const user = await this.authService.findUsernameOrEmailAndPassword(
      usernameOrEmail,
      password
    );

    if (!user)
      return res
        .status(401)
        .send(
          "No user with that username/email and password combination has been found."
        );

    if (
      !this.jwtService.updateToken(res, {
        username: user.username,
        email: user.email,
        projects: (user as any).projects.map((project: any) => project.id),
      })
    )
      return res.status(401).send("Malformed JWT token.");
    res.status(200).send();
  }

  @POST("/register")
  public async register(req: Request, res: Response) {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res.status(401).send("Username/Email/Password were not defined.");

    try {
      await this.authService.registerUser(email, username, password);
    } catch (error) {
      return res.status(401).send(error);
    }
    res.sendStatus(200);
  }

  @POST("/:userID")
  public async forgotPassword(req: Request, res: Response) {
    res.sendStatus(404);
  }

  @POST("/:passwordToken")
  public async resetPassword(req: Request, res: Response) {
    res.sendStatus(404);
  }
}
