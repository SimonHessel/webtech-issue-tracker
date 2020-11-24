import { Router } from "express";

export interface IController {
  initRoutes(): any;
  router: Router;
  path: string;
}
