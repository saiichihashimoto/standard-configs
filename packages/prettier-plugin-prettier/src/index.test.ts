import { formatIgnore } from "@configs/plugin-ignore/src/test-utils";
import { formatJSON } from "@configs/plugin-json/src/test-utils";
import { formatYAML } from "@configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

describe.each([
  { filename: ".prettierrc.json", format: formatJSON },
  { filename: ".prettierrc.json5", format: formatJSON },
  { filename: ".prettierrc", format: formatJSON },
  { filename: ".prettierrc", format: formatYAML },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://prettier.io/docs/en/plugins.html#using-plugins", () =>
    expectExample({
      parser: "foo",
      pluginSearchDirs: ["./dir-with-plugins"],
      plugins: ["prettier-plugin-foo"],
    }));

  it("https://prettier.io/docs/en/configuration.html#basic-configuration", () =>
    expectExample({
      trailingComma: "es5",
      tabWidth: 4,
      semi: false,
      singleQuote: true,
    }));

  it("https://prettier.io/docs/en/configuration.html#configuration-overrides", () =>
    expectExample({
      semi: false,
      overrides: [
        {
          files: "*.test.js",
          options: {
            semi: true,
          },
        },
        {
          files: ["*.html", "legacy/**/*.js"],
          options: {
            tabWidth: 4,
          },
        },
      ],
    }));

  it("https://prettier.io/docs/en/configuration.html#setting-the-parserdocsenoptionshtmlparser-option", () =>
    expectExample({
      overrides: [
        {
          files: ".prettierrc",
          options: { parser: "json" },
        },
      ],
    }));

  it("https://prettier.io/docs/en/configuration.html#setting-the-parserdocsenoptionshtmlparser-option flow", () =>
    expectExample({
      overrides: [
        {
          files: "*.js",
          options: {
            parser: "flow",
          },
        },
      ],
    }));
});

describe.each([
  { filename: ".prettierrc.yaml", format: formatYAML },
  { filename: ".prettierrc.yml", format: formatYAML },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://prettier.io/docs/en/configuration.html#basic-configuration", () =>
    expectExample(`
      # .prettierrc or .prettierrc.yaml
      trailingComma: "es5"
      tabWidth: 4
      semi: false
      singleQuote: true`));

  it("https://prettier.io/docs/en/configuration.html#configuration-overrides", () =>
    expectExample(`
      semi: false
      overrides:
        - files: "*.test.js"
          options:
            semi: true
        - files:
            - "*.html"
            - "legacy/**/*.js"
          options:
            tabWidth: 4`));
});

describe.each([{ filename: ".prettierignore", format: formatIgnore }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    it("sorts and uniqs", () =>
      expect(pluginFormat(["b", "a", "b"])).toStrictEqual(
        defaultFormat(["a", "b"])
      ));
  }
);
