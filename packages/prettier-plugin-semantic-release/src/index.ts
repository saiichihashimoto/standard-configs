import { indexOf } from "@standard-configs/config";
import type { Config } from "@standard-configs/config";
import { mergePlugins } from "@standard-configs/plugin";
import { jsonPlugin } from "@standard-configs/plugin-json";
import { yamlPlugin } from "@standard-configs/plugin-yaml";

export const semanticReleaseConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "branches",
          "repositoryUrl",
          "extends",
          "tagFormat",
          "plugins",
          "dryRun",
          "ci",
          "debug",
          "githubUrl",
          "githubApiPathPrefix",
        ]),
      ],
    },
    {
      path: /^branches\[\d+]$/,
      sortKeys: [indexOf(["name", "range", "channel", "prerelease"])],
    },
  ],
};

export const semanticReleaseJSONConfigs = {
  ".releaserc.json": semanticReleaseConfig,
  ".releaserc": { parsers: ["json"], ...semanticReleaseConfig },
};

export const semanticReleaseYAMLConfigs = {
  ".releaserc.yaml": semanticReleaseConfig,
  ".releaserc.yml": semanticReleaseConfig,
  // TODO ".releaserc": { parsers: ["yaml"], ...semanticReleaseConfig },
};

export const { defaultOptions, languages, options, parsers, printers } =
  mergePlugins(
    jsonPlugin(semanticReleaseJSONConfigs),
    yamlPlugin(semanticReleaseYAMLConfigs)
  );
