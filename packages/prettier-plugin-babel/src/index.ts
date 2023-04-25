import { flow, map, toPairs } from "lodash/fp";
import { z } from "zod";

import { indexOf, nestConfig } from "@standard-configs/config";
import type { Config, Operation } from "@standard-configs/config";
import { jsonPlugin } from "@standard-configs/plugin-json";

const rootConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf((unmatched) => [
          "cwd",
          "caller",
          "filename",
          "filenameRelative",
          "ast",
          "code",
          "cloneInputAst",
          "root",
          "rootMode",
          "envName",
          "babelrcRoots",
          "targets",
          "assumptions",
          "presets",
          "babelrc",
          "configFile",
          "test",
          "plugins",
          "passPerPreset",
          "browserslistConfigFile",
          "browserslistEnv",
          "extends",
          "env",
          "include",
          "exclude",
          "ignore",
          "only",
          "inputSourceMap",
          "sourceMaps",
          "sourceMap",
          "sourceFileName",
          "sourceRoot",
          "sourceType",
          "highlightCode",
          "wrapPluginVisitorMethod",
          "parserOpts",
          "generatorOpts",
          "retainLines",
          "compact",
          "minified",
          "auxiliaryCommentBefore",
          "auxiliaryCommentAfter",
          "comments",
          "shouldPrintComment",
          "moduleIds",
          "moduleId",
          "getModuleId",
          "moduleRoot",
          unmatched,
          "overrides",
        ]),
      ],
    },
    {
      path: /^assumptions$/,
      sortKeys: [indexOf(["noDocumentAll", "noClassCalls"])],
    },
    {
      path: /^plugins\[\d+]\[1]$/,
      sortKeys: [indexOf(["module", "method"])],
    },
    ...flow(
      toPairs<Omit<Operation, "if" | "path">>,
      map(
        ([presetName, config]): Operation => ({
          path: /^presets\[\d+]\[1]$/,
          if: ({ getParentValue }) =>
            z
              .tuple([z.literal(presetName), z.any()])
              .safeParse(getParentValue()).success,
          ...config,
        })
      )
    )({
      "@babel/preset-env": {
        sortKeys: [
          indexOf([
            "targets",
            "bugfixes",
            "spec",
            "loose",
            "modules",
            "debug",
            "include",
            "exclude",
            "useBuiltIns",
            "corejs",
            "forceAllTransforms",
            "configPath",
            "ignoreBrowserslistConfig",
            "browserslistEnv",
            "shippedProposals",
          ]),
        ],
      },
      "@babel/preset-flow": {
        sortKeys: [indexOf(["all", "allowDeclareFields"])],
      },
      "@babel/preset-react": {
        sortKeys: [
          indexOf([
            "pragma",
            "pragmaFrag",
            "throwIfNamespace",
            "runtime",
            "development",
            "pure",
            "importSource",
            "useBuiltIns",
            "useSpread",
          ]),
        ],
      },
      "@babel/preset-typescript": {
        sortKeys: [
          indexOf([
            "isTSX",
            "jsxPragma",
            "jsxPragmaFrag",
            "allExtensions",
            "allowNamespaces",
            "allowDeclareFields",
            "disallowAmbiguousJSXLike",
            "onlyRemoveTypeImports",
            "optimizeConstEnums",
          ]),
        ],
      },
    }),
  ],
};

export const babelConfig: Config = {
  operations: [
    ...nestConfig(/^$/, rootConfig),
    ...nestConfig(/^overrides\[\d+]$/, rootConfig),
  ],
};

export const babelJSONConfigs = {
  ".babelrc.json": babelConfig,
  ".babelrc": babelConfig,
  "babel.config.json": babelConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(babelJSONConfigs);
