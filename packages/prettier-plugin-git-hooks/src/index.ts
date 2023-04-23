import gitHooks from "git-hooks-list";

import { type Config, indexOf } from "@configs/config";
import { mergePlugins } from "@configs/plugin";
import { jsonPlugin } from "@configs/plugin-json";
import { yamlPlugin } from "@configs/plugin-yaml";

export const huskyConfig: Config = {
  operations: [
    {
      // https://github.com/typicode/husky/tree/v4.3.8
      path: /^hooks$/,
      sortKeys: [indexOf(gitHooks)],
    },
  ],
};

export const simpleGitHooksConfig: Config = {
  operations: [
    {
      // https://www.npmjs.com/package/simple-git-hooks
      path: /^$/,
      sortKeys: [indexOf(gitHooks)],
    },
  ],
};

export const gitHooksJSONConfigs = {
  ".huskyrc.json": huskyConfig,
  ".huskyrc": { parsers: ["json"], ...huskyConfig },
  ".simple-git-hooks.json": simpleGitHooksConfig,
  "simple-git-hooks.json": simpleGitHooksConfig,
};

export const gitHooksYAMLConfigs = {
  ".huskyrc.yaml": huskyConfig,
  ".huskyrc.yml": huskyConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  mergePlugins(
    jsonPlugin(gitHooksJSONConfigs),
    yamlPlugin(gitHooksYAMLConfigs)
  );
