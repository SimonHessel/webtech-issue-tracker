import { Router } from "express";

export interface IController {
  /**
   * Initlizes all routes present on the controller with their respective path and method
   */
  initRoutes(): void;

  router: Router;

  /**
   * Path under which the controller methods can be reached
   */
  path: string;
}
