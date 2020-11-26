import { Router } from "express";

export interface IController {
  initRoutes(): void;
  router: Router;
  path: string;
}
