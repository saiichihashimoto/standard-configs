import { type Config, indexOf } from "@configs/config";
import { mergePlugins } from "@configs/plugin";
import { jsonPlugin } from "@configs/plugin-json";
import { yamlPlugin } from "@configs/plugin-yaml";

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
