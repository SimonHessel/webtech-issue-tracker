import { Request, Response } from "express";
import { AuthService } from "services/auth.service";
import { JWTService } from "services/jwt.service";
import { Controller, POST, Login } from "../core";

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

    const token = this.jwtService.updateToken({
      username: user.username,
      email: user.email,
      projects: (user as any).projects.map((project: any) => project.id),
    });
    res.send({ token });
  }

  @POST("/register")
  public async register(req: Request, res: Response) {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res.status(401).send("Username/Email/Password were not defined.");

    const apiResponse = await this.authService.registerUser(
      email,
      username,
      password
    );
    if (!apiResponse) return res.status(401).send("Something didn't work out.");
    res.sendStatus(200);
  }

  @POST("/:userID")
  public forgotPassword(req: Request, res: Response) {
    res.sendStatus(200);
  }

  @POST("/:passwordToken")
  public resetPassword(req: Request, res: Response) {
    res.sendStatus(200);
  }
}
