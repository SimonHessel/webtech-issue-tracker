import { Controller, GET, POST } from "core";
import { Request, Response } from "express";
import { Login } from "interfaces/login.interface";
import { AuthService } from "services/auth.service";
import { JWTService } from "services/jwt.service";

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
        .status(400)
        .send("Username/Email or Password were not defined");

    try {
      const user = await this.authService.findUsernameOrEmailAndPassword(
        usernameOrEmail,
        password
      );

      if (
        !this.jwtService.updateToken(res, {
          username: user.username,
          email: user.email,
          projects: user.projects.map((project) => project.id),
        })
      )
        return res.status(400).send("Malformed JWT token.");

      await this.jwtService.setRefreshToken(res, user.username);
    } catch (error) {
      return res.status(400).send(error);
    }
    res.status(200).send();
  }

  @POST("/register")
  public async register(req: Request, res: Response) {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res.status(400).send("Username/Email/Password were not defined.");

    try {
      await this.authService.registerUser(email, username, password);
    } catch (error) {
      return res.status(400).send(error);
    }
    res.sendStatus(200);
  }

  @GET("/refresh")
  public async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies[process.env.RFRESH_TOKEN_COKKIE_NAME];

    if (!refreshToken) return res.status(401).send("No Refreshtoken.");
    try {
      const {
        username,
        email,
        projects,
      } = await this.jwtService.checkRefreshToken(refreshToken);

      this.jwtService.updateToken(res, {
        email,
        username,
        projects: projects.map((project) => project.id),
      });
      res.sendStatus(200);
    } catch (error) {
      return res.status(401).send(error);
    }
  }

  @GET("/logout")
  public async logout(req: Request, res: Response) {
    res.cookie(process.env.RFRESH_TOKEN_COKKIE_NAME, "", {
      httpOnly: true,
      secure: false,
      path: "/api/auth/refresh",
      maxAge: 0,
    });
    res.status(200).send();
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
