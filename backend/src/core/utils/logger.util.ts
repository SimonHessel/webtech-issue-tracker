import "colors";
export const log = (service: string, ...args: string[]) => {
  console.log(`[${service}]`.yellow, ...args.map((arg) => arg.green));
};
