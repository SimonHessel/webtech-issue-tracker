import {
  ENDPOINTS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from "../constants";
import { RequestMethod } from "../enums";

const defaultMetadata = {
  path: "/",
  method: RequestMethod.GET,
};

const RequestMapping = (
  metadata: {
    path?: string;
    method?: RequestMethod;
  } = defaultMetadata
): MethodDecorator => {
  const pathMetadata = metadata[PATH_METADATA];
  const path = pathMetadata && pathMetadata.length ? pathMetadata : "/";
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;

  return (target, key, descriptor: PropertyDescriptor) => {
    // set path of controller endpoint
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);

    // set request method of controller endpoint
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);

    // get current endpoints on controller and add the method
    const currentEndpoints =
      Reflect.getMetadata(ENDPOINTS_METADATA, target) || [];
    Reflect.defineMetadata(
      ENDPOINTS_METADATA,
      [...currentEndpoints, key],
      target
    );

    return descriptor;
  };
};
/**
 * MethodDecorator factory to create decorator for a specifc http Method
 */
const createMethodDecorator = (method: RequestMethod) => (
  path?: string
): MethodDecorator => {
  return RequestMapping({
    path: path,
    method: method,
  });
};

// create all http method decorators

export const POST = createMethodDecorator(RequestMethod.POST);

export const GET = createMethodDecorator(RequestMethod.GET);

export const DELETE = createMethodDecorator(RequestMethod.DELETE);

export const PUT = createMethodDecorator(RequestMethod.PUT);

export const PATCH = createMethodDecorator(RequestMethod.PATCH);
