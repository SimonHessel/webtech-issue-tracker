import { Controller, GET, POST, BaseStructure } from "core";
import { Request, Response } from "express";
import { Login } from "interfaces/login.interface";
import { AuthService } from "services/auth.service";
import { JWTService } from "services/jwt.service";

@Controller("auth")
export class AuthController extends BaseStructure {
  constructor(
    private jwtService: JWTService,
    private authService: AuthService
  ) {
    super();
  }

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
      const user = await this.authService.findbyUsernameOrEmailAndPassword(
        usernameOrEmail,
        password
      );

      if (!user.isVerified)
        return res
          .status(400)
          .send(
            "You need to confirm your email address before being able to login."
          );

      if (
        !this.jwtService.updateToken(res, {
          username: user.username,
          email: user.email,
          projects: user.projects.map((project) => project.id),
        })
      )
        return res.status(400).send("Malformed JWT token.");

      await this.jwtService.setRefreshToken(res, user);
    } catch (error) {
      this.error(error);
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
      res.sendStatus(200);
    } catch (error) {
      this.error(error);
      return res.status(400).send(error);
    }
  }

  @GET("/refresh")
  public async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];

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
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: false,
      path: "/api/auth/refresh",
      maxAge: 0,
    });
    res.status(200).send();
  }
  @POST("/:usernameOrEmail")
  public async forgotPassword(req: Request, res: Response) {
    const { usernameOrEmail } = req.params;
    try {
      await this.authService.sendPasswordRecoveryEmail(usernameOrEmail);
      res.sendStatus(202);
    } catch (error) {
      return res.status(401).send(error);
    }
  }

  @POST("/passwordreset/:passwordToken")
  public async resetPassword(req: Request, res: Response) {
    const { passwordToken } = req.params;
    const { newPassword } = req.body;
    if (!passwordToken)
      return res.status(401).send("You need to specify a token!");

    try {
      await this.authService.recoverPassword(passwordToken, newPassword);
      res.sendStatus(202);
    } catch (error) {
      return res.status(401).send(error);
    }
  }

  @POST("/confirm/:confirmationToken")
  public async confirmEmail(req: Request, res: Response) {
    const { confirmationToken } = req.params;
    if (!confirmationToken)
      return res.status(401).send("You need to specify a token!");

    try {
      await this.authService.confirmEmail(confirmationToken);
      res.sendStatus(202);
    } catch (error) {
      return res.status(401).send(error);
    }
  }
}
