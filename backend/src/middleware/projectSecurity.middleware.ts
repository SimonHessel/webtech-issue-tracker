import { Request } from "express";
import { TokenData } from "interfaces";
import { ControllerMiddleware, IMiddleware } from "../core";

export const ProjectSecurityMiddleware: IMiddleware = async (
  req: Request<{ projectID: string }, unknown, unknown>,
  res,
  next
) => {
  const projectID = parseInt(req.params.projectID);
  const tokenData: TokenData = res.locals.tokenData;
  if (tokenData.projects.some((id) => id === projectID)) next();
  else res.status(403).send("No permissions for this project");
};

export const ProjectSecurity = ControllerMiddleware(ProjectSecurityMiddleware);
