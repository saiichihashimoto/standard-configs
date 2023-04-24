import { formatJSON } from "@standard-configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([
  { filename: "THERE-IS-NO-AVA-JSON-CONFIG", format: formatJSON },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://github.com/avajs/ava/blob/main/docs/06-configuration.md#configuration", () =>
    expectExample({
      files: [
        "test/**/*",
        "!test/exclude-files-in-this-directory",
        "!**/exclude-files-with-this-name.*",
      ],
      match: ["*oo", "!foo"],
      concurrency: 5,
      failFast: true,
      failWithoutAssertions: false,
      environmentVariables: {
        MY_ENVIRONMENT_VARIABLE: "some value",
      },
      verbose: true,
      require: ["./my-helper-module.js"],
      nodeArguments: ["--trace-deprecation", "--napi-modules"],
    }));

  it("https://github.com/avajs/ava/blob/main/docs/recipes/babel.md", () =>
    expectExample({
      require: ["@babel/register"],
    }));

  it("https://github.com/avajs/ava/blob/main/docs/recipes/react.md#setting-up-babel", () =>
    expectExample({
      babel: {
        testOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    }));

  it("https://github.com/avajs/ava/blob/main/docs/recipes/react.md#configure-tests-to-use-enzyme", () =>
    expectExample({
      require: ["./test/_setup-enzyme-adapter.js"],
    }));

  it("https://github.com/avajs/ava/blob/main/docs/recipes/typescript.md#for-packages-with-type-module", () =>
    expectExample({
      extensions: {
        ts: "module",
      },
      nodeArguments: ["--loader=ts-node/esm"],
    }));

  it("https://github.com/avajs/ava/blob/main/docs/recipes/typescript.md#for-packages-without-type-module", () =>
    expectExample({
      extensions: ["ts"],
      require: ["ts-node/register"],
    }));

  it("https://github.com/avajs/ava/blob/main/docs/recipes/typescript.md#using-module-path-mapping", () =>
    expectExample({
      extensions: ["ts"],
      require: ["ts-node/register", "tsconfig-paths/register"],
    }));

  it("https://github.com/avajs/ava/blob/main/docs/recipes/vue.md#setup", () =>
    expectExample({
      require: ["./test/_setup.js"],
    }));

  it("https://github.com/avajs/babel#make-ava-skip-your-projects-babel-options", () =>
    expectExample({
      babel: {
        testOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    }));

  it("https://github.com/avajs/typescript#enabling-typescript-support", () =>
    expectExample({
      typescript: {
        rewritePaths: {
          "src/": "build/",
        },
        compile: false,
      },
    }));

  it("https://github.com/avajs/typescript#add-additional-extensions", () =>
    expectExample({
      typescript: {
        extensions: ["ts", "tsx"],
        rewritePaths: {
          "src/": "build/",
        },
      },
    }));

  it("sorts babel.testOptions like a babel config", () =>
    expectExample({
      babel: {
        extensions: ["js", "jsx"],
        testOptions: {
          presets: [],
          plugins: [],
        },
      },
    }));
});
