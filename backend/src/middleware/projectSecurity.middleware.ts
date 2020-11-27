import { Request, Response } from "express";
import { TokenData } from "interfaces";
import { ControllerMiddleware } from "../core";

export const ProjectSecurityMiddleware = async (
  req: Request<{ projectID: string }, {}, {}>,
  res: Response,
  next: Function
) => {
  const projectID = parseInt(req.params.projectID);
  const tokenData: TokenData = res.locals.tokenData;
  console.log(
    projectID,
    tokenData,
    tokenData.projects.some((id) => id === projectID)
  );
  if (tokenData.projects.some((id) => id === projectID)) next();
  else res.status(403).send("No permissions for this project");
};

export const ProjectSecurity = ControllerMiddleware(ProjectSecurityMiddleware);
