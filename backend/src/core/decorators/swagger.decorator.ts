import { SUMMARY_METADATA } from "../constants";

const SwaggerMapping = <Metadata>(
  metadata: Metadata,
  metadataKey: string
): MethodDecorator => {
  return (target, key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(metadataKey, metadata, descriptor.value);
    return descriptor;
  };
};
/**
 * createSwaggerDecorator factory to create decorator for a specifc http Method
 */
const createSwaggerDecorator = <Metadata>(metadataKey: string) => (
  metadata: Metadata
): MethodDecorator => {
  return SwaggerMapping<Metadata>(metadata, metadataKey);
};

// create all Swagger decorators

export const ApiSummary = createSwaggerDecorator<string>(SUMMARY_METADATA);
