const fsExtra = require("fs");
const path = require("path");
const tsConfigPaths = require("tsconfig-paths");

const tsConfig = new Function(
  `return ${fsExtra.readFileSync(
    path.join(__dirname, "tsconfig.json"),
    "utf-8"
  )}`
)();
const baseUrl = path.join(__dirname, tsConfig.compilerOptions.baseUrl);

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
  addMatchAll: false,
});
