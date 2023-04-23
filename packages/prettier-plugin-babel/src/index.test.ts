import { formatJSON } from "@configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([
  { filename: ".babelrc.json", format: formatJSON },
  { filename: ".babelrc", format: formatJSON },
  { filename: "babel.config.json", format: formatJSON },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://babeljs.io/docs/usage#overview", () =>
    expectExample({
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              // EDITED Sorted
              chrome: "67",
              edge: "17",
              firefox: "60",
              safari: "11.1",
            },
            useBuiltIns: "usage",
            corejs: "3.6.5",
          },
        ],
      ],
    }));

  it("https://babeljs.io/docs/configuration#whats-your-use-case", () =>
    expectExample({
      presets: [],
      plugins: [],
    }));

  it("https://babeljs.io/docs/options#caller", () =>
    expectExample({
      caller: {
        name: "my-custom-tool",
        supportsStaticESM: true,
      },
    }));

  it("https://babeljs.io/docs/options#ast 1", () =>
    expectExample({
      filename: "",
      ast: true,
      code: false,
    }));

  it("https://babeljs.io/docs/options#ast 2", () =>
    expectExample({
      filename: "",
      presets: ["minify"],
      babelrc: false,
      configFile: false,
    }));

  it("https://babeljs.io/docs/options#overrides", () =>
    expectExample({
      test: "./vendor/large.min.js",
      compact: true,
    }));

  it("https://babeljs.io/docs/options#assumptions", () =>
    expectExample({
      assumptions: {
        iterableIsArray: true,
      },
      presets: ["@babel/preset-env"],
    }));

  it("https://babeljs.io/docs/options#entryoptions", () =>
    expectExample({
      plugins: ["one", ["two", false], "three"],
      overrides: [
        {
          test: "./src",
          plugins: ["two"],
        },
      ],
    }));

  it("https://babeljs.io/docs/plugins#plugin-options 1", () =>
    expectExample({
      plugins: [
        [
          "transform-async-to-module-method",
          {
            module: "bluebird",
            method: "coroutine",
          },
        ],
      ],
    }));

  it("https://babeljs.io/docs/plugins#plugin-options 2", () =>
    expectExample({
      presets: [
        [
          "env",
          {
            loose: true,
            modules: false,
          },
        ],
      ],
    }));

  it("https://babeljs.io/docs/assumptions", () =>
    expectExample({
      targets: ">0.5%",
      assumptions: {
        noDocumentAll: true,
        noClassCalls: true,
      },
      presets: ["@babel/preset-env"],
    }));

  it("https://babeljs.io/docs/babel-preset-env#browserslist-integration", () =>
    expectExample({
      presets: [
        [
          "@babel/preset-env",
          {
            useBuiltIns: "entry",
            corejs: "3.22",
          },
        ],
      ],
    }));

  it("https://babeljs.io/docs/babel-preset-react#with-a-configuration-file-recommended", () =>
    expectExample({
      presets: [
        [
          "@babel/preset-react",
          {
            pragma: "dom", // default pragma is React.createElement (only in classic runtime)
            pragmaFrag: "DomFrag", // default is React.Fragment (only in classic runtime)
            throwIfNamespace: false, // defaults to true
            runtime: "classic", // defaults to classic
            importSource: "custom-jsx-library", // defaults to react (only in automatic runtime)
          },
        ],
      ],
    }));

  it("https://babeljs.io/docs/babel-plugin-transform-runtime#with-a-configuration-file-recommended", () =>
    expectExample({
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            absoluteRuntime: false,
            corejs: false,
            helpers: true,
            regenerator: true,
            version: "7.0.0-beta.0",
          },
        ],
      ],
    }));
});
