import { type Config, indexOf } from "@standard-configs/config";
import { jsonPlugin } from "@standard-configs/plugin-json";

export const sanityConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "root",
          "project",
          "api",
          "plugins",
          "parts",
          "server",
          "env",
        ]),
      ],
    },
    {
      path: /^api$/,
      sortKeys: [indexOf(["projectId", "dataset"])],
    },
    {
      path: /^project$/,
      sortKeys: [indexOf(["name", "basePath"])],
    },
  ],
};

export const sanityJSONConfigs = {
  "sanity.json": sanityConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(sanityJSONConfigs);
