import { uniqBy } from "lodash/fp";
import { z } from "zod";

import {
  type Config,
  elementsZod,
  indexOf,
  sortAndUniqBy,
} from "@configs/config";
import { mergePlugins } from "@configs/plugin";
import { ignorePlugin } from "@configs/plugin-ignore";
import { jsonPlugin } from "@configs/plugin-json";
import { yamlPlugin } from "@configs/plugin-yaml";

export const prettierConfig: Config = {
  operations: [
    {
      path: /^(overrides\[\d+]\.options)?$/,
      sortKeys: [
        indexOf((unmatched) => [
          "parser",
          "pluginSearchDirs",
          "plugins",
          "filepath",
          "rangeStart",
          "rangeEnd",
          "requirePragma",
          "insertPragma",
          "printWidth",
          "trailingComma",
          "tabWidth",
          "useTabs",
          "semi",
          "singleQuote",
          "quoteProps",
          "jsxSingleQuote",
          "bracketSpacing",
          "bracketSameLine",
          "jsxBracketSameLine",
          "arrowParens",
          "proseWrap",
          "htmlWhitespaceSensitivity",
          "vueIndentScriptAndStyle",
          "endOfLine",
          "embeddedLanguageFormatting",
          "singleAttributePerLine",
          unmatched,
          "overrides",
        ]),
      ],
    },
    {
      path: /^overrides\[\d+]$/,
      sortKeys: [indexOf(["files", "options"])],
    },
    {
      path: /^overrides\[\d+]\.files$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
    {
      path: /^(overrides\[\d+]\.options\.)?(plugins|pluginSearchDirs)$/,
      overElements: elementsZod(
        z.string(),
        uniqBy(({ value }) => value)
      ),
    },
  ],
};

export const prettierIgnoreConfig: Config = {
  parsers: ["ignore"],
  operations: [
    {
      path: /^$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
  ],
};

export const prettierIgnoreConfigs = {
  ".prettierignore": { ...prettierIgnoreConfig, parsers: ["ignore"] },
};

export const prettierJSONConfigs = {
  ".prettierrc.json": prettierConfig,
  ".prettierrc.json5": prettierConfig,
  ".prettierrc": { parsers: ["json"], ...prettierConfig },
};

export const prettierYAMLConfigs = {
  ".prettierrc.yaml": prettierConfig,
  ".prettierrc.yml": prettierConfig,
  ".prettierrc": { parsers: ["yaml"], ...prettierConfig },
};

export const { defaultOptions, languages, options, parsers, printers } =
  mergePlugins(
    ignorePlugin(prettierIgnoreConfigs),
    jsonPlugin(prettierJSONConfigs),
    yamlPlugin(prettierYAMLConfigs)
  );
