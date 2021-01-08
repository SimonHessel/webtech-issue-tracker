import colors from "colors";
const log = (
  color: (text: string) => string,
  service: string,
  ...args: unknown[]
) => {
  console.log(
    `[${service}]`.yellow,
    ...args.map((arg) => (typeof arg === "string" ? color(arg as string) : arg))
  );
};

export const error = (service: string, ...args: unknown[]) =>
  log(colors.red, service, ...args);

export const info = (service: string, ...args: unknown[]) =>
  log(colors.green, service, ...args);
