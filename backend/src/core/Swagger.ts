interface Tag {
  name: string;
  description: string;
  externalDocs: { description: string; url: string };
}

type ContentType = "application/json";

type MethodType = "post" | "get" | "patch" | "put" | "delete";

interface Schema {
  ref: string;
  type?: "array";
  items?: { ref: string };
}

interface Response {
  description: string;
  schema?: Schema;
}

interface Parameter {
  in: ParameterType;
  name: string;
  required: boolean;
  description: string;
  schema?: Schema;
  responses: { [key in "200" | "400"]: Response };
}

type ParameterType = "body" | "path";

interface Method {
  tags: string[];
  summary: string;
  description: string;

  operationId: string;
  consumes: ContentType[];
  produces: ContentType[];
  parameters: Parameter[];
}

type Type = "integer" | "string";
type Format = "int64" | "int32" | "date-time";

interface Definition {
  type: "object";
  properties: {
    [key: string]: {
      type: Type;
      format: Format;
      enum?: string[];
      default?: any;
    };
  }[];
}

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
    public basePath: string
  ) {}

  public toString() {
    // return JSON.stringify()
  }
}
