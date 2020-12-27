import { RequestMethod } from "./enums";

export interface Tag {
  name: string;
  description: string;
  externalDocs?: { description: string; url: string };
}

export type ContentType = "application/json";

export type MethodType = "post" | "get" | "patch" | "put" | "delete";

export interface Schema {
  ref: string;
  type?: "array";
  items?: { ref: string };
}

export interface Response {
  description: string;
  schema?: Schema;
}

export interface Parameter {
  in: ParameterType;
  name: string;
  type: "string";
  required: boolean;
  description: string;
  schema?: Schema;
  responses: { [key in "200" | "400"]: Response };
}

export type ParameterType = "body" | "path";

export interface Method {
  tags: string[];
  summary: string;
  description: string;

  operationId: string;
  consumes: ContentType[];
  produces: ContentType[];
  parameters: Parameter[];
}

export type Type = "integer" | "string";
export type Format = "int64" | "int32" | "date-time";

export interface Definition {
  type: "object";
  properties: {
    [key: string]: {
      type: Type;
      format: Format;
      enum?: string[];
      default?: unknown;
    };
  }[];
}

export const RequestMethodToMethodType = (
  method: RequestMethod
): MethodType => {
  switch (method) {
    case RequestMethod.GET:
      return "get";
    case RequestMethod.POST:
      return "post";
    case RequestMethod.PATCH:
      return "patch";
    case RequestMethod.PUT:
      return "put";
    case RequestMethod.DELETE:
      return "delete";
    default:
      return "get";
  }
};

export class SwaggerGenerator {
  public tags: Tag[] = [];
  public schemas: ["http"?, "http"?] = [];
  public paths: { [key: string]: { [key in MethodType]: Method } } = {};
  public definitions: { [key: string]: Definition } = {};
  constructor(
    public description: string,
    public version: string,
    public title: string,
    public host: string,
    public basePath: string,
    public controllers: {
      generateSwagger(): { [key: string]: { [key in MethodType]: Method } };
    }[]
  ) {}

  public export() {
    this.controllers.forEach((controller) => {
      this.paths = { ...controller.generateSwagger(), ...this.paths };
    });

    this.tags = [
      ...new Set(
        Object.values(this.paths)
          .map((path) => Object.values(path).map(({ tags }) => tags))
          .flat()
          .flat()
      ).values(),
    ].map((tag) => ({
      description: `Everything about ${tag}.`,
      name: tag,
    }));

    const json = JSON.stringify(
      {
        swagger: "2.0",
        info: {
          description: this.description,
          version: this.version,
          title: this.title,
          host: this.host,
          basePath: this.basePath,
        },
        paths: this.paths,
        tags: this.tags,
        schemas: this.schemas,
        definitions: this.definitions,
      },
      null,
      2
    );

    return JSON.parse(json);
  }
}
