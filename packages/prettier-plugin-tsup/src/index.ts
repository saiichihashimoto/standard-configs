import { z } from "zod";

import {
  type Config,
  elementsZod,
  indexOf,
  nestConfig,
  sortAndUniqBy,
} from "@configs/config";
import { jsonPlugin } from "@configs/plugin-json";
import { compilerOptionsConfig } from "@configs/prettier-plugin-tsconfig";

export const tsupConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "name",
          "entryPoints",
          "entry",
          "legacyOutput",
          "target",
          "minify",
          "minifyWhitespace",
          "minifyIdentifiers",
          "minifySyntax",
          "keepNames",
          "watch",
          "ignoreWatch",
          "onSuccess",
          "jsxFactory",
          "jsxFragment",
          "outDir",
          "outExtension",
          "format",
          "globalName",
          "env",
          "define",
          "dts",
          "sourcemap",
          "noExternal",
          "external",
          "replaceNodeEnv",
          "splitting",
          "clean",
          "esbuildPlugins",
          "esbuildOptions",
          "silent",
          "skipNodeModulesBundle",
          "pure",
          "bundle",
          "inject",
          "metafile",
          "footer",
          "banner",
          "platform",
          "loader",
          "config",
          "tsconfig",
          "injectStyle",
          "shims",
          "plugins",
          "treeshake",
          "publicDir",
        ]),
      ],
    },
    {
      path: /^banner|footer$/,
      sortKeys: [indexOf(["js", "css"])],
    },
    {
      path: /^clean|entry|external|format|ignoreWatch|inject|noExternal|pure|target|watch$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
    {
      path: /^dts$/,
      sortKeys: [
        indexOf([
          "entry",
          "resolve",
          "only",
          "banner",
          "footer",
          "compilerOptions",
        ]),
      ],
    },
    {
      path: /^plugins\[\d+]$/,
      sortKeys: [
        indexOf([
          "name",
          "esbuildOptions",
          "buildStart",
          "renderChunk",
          "buildEnd",
        ]),
      ],
    },
    ...nestConfig(/^dts\.compilerOptions$/, compilerOptionsConfig),
  ],
};

export const tsupJSONConfigs = {
  "tsup.config.json": tsupConfig,
};

export const { defaultOptions, languages, parsers, printers, options } =
  jsonPlugin(tsupJSONConfigs);
