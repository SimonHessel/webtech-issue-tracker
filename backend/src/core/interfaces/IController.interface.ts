import { Router } from "express";

export default interface IController {
  initRoutes(): any;
  router: Router;
  path: string;
}
