import { PATH_METADATA, METHOD_METADATA, METHODS_METADATA } from "../constants";
import { RequestMethod } from "../enums/request-method.enum";

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
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    const currentMethods = Reflect.getMetadata(METHODS_METADATA, target);
    const methods = currentMethods ? [...currentMethods, key] : [key];
    Reflect.defineMetadata(METHODS_METADATA, methods, target);
    return descriptor;
  };
};

const createMethodDecorator = (method: RequestMethod) => (
  path?: string
): MethodDecorator => {
  return RequestMapping({
    path: path,
    method: method,
  });
};

export const POST = createMethodDecorator(RequestMethod.POST);

export const GET = createMethodDecorator(RequestMethod.GET);

export const DELETE = createMethodDecorator(RequestMethod.DELETE);

export const PUT = createMethodDecorator(RequestMethod.PUT);

export const PATCH = createMethodDecorator(RequestMethod.PATCH);
