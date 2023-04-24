import { mergePlugins } from "@standard-configs/plugin";
import { ignorePlugin } from "@standard-configs/plugin-ignore";
import { jsonPlugin } from "@standard-configs/plugin-json";
import { yamlPlugin } from "@standard-configs/plugin-yaml";
import { babelJSONConfigs } from "@standard-configs/prettier-plugin-babel";
import { bowerJSONConfigs } from "@standard-configs/prettier-plugin-bower";
import { dependabotYAMLConfigs } from "@standard-configs/prettier-plugin-dependabot";
import {
  eslintIgnoreConfigs,
  eslintJSONConfigs,
  eslintYAMLConfigs,
} from "@standard-configs/prettier-plugin-eslint";
import { firebaseJSONConfigs } from "@standard-configs/prettier-plugin-firebase";
import { gitIgnoreConfigs } from "@standard-configs/prettier-plugin-git";
import {
  gitHooksJSONConfigs,
  gitHooksYAMLConfigs,
} from "@standard-configs/prettier-plugin-git-hooks";
import { githubYAMLConfigs } from "@standard-configs/prettier-plugin-github";
import { npmIgnoreConfigs } from "@standard-configs/prettier-plugin-npm";
import { packageJSONConfigs } from "@standard-configs/prettier-plugin-package-json";
import {
  prettierIgnoreConfigs,
  prettierJSONConfigs,
  prettierYAMLConfigs,
} from "@standard-configs/prettier-plugin-prettier";
import { probotAutoAssignYAMLConfigs } from "@standard-configs/prettier-plugin-probot-auto-assign";
import { probotSettingsYAMLConfigs } from "@standard-configs/prettier-plugin-probot-settings";
import { sanityJSONConfigs } from "@standard-configs/prettier-plugin-sanity";
import {
  semanticReleaseJSONConfigs,
  semanticReleaseYAMLConfigs,
} from "@standard-configs/prettier-plugin-semantic-release";
import { tsconfigJSONConfigs } from "@standard-configs/prettier-plugin-tsconfig";
import { tsupJSONConfigs } from "@standard-configs/prettier-plugin-tsup";
import { vscodeJSONConfigs } from "@standard-configs/prettier-plugin-vscode";

export const { defaultOptions, languages, parsers, printers, options } =
  mergePlugins(
    ignorePlugin({
      ...eslintIgnoreConfigs,
      ...gitIgnoreConfigs,
      ...npmIgnoreConfigs,
      ...prettierIgnoreConfigs,
    }),
    jsonPlugin({
      ...babelJSONConfigs,
      ...bowerJSONConfigs,
      ...eslintJSONConfigs,
      ...firebaseJSONConfigs,
      ...gitHooksJSONConfigs,
      ...packageJSONConfigs,
      ...prettierJSONConfigs,
      ...sanityJSONConfigs,
      ...semanticReleaseJSONConfigs,
      ...tsconfigJSONConfigs,
      ...tsupJSONConfigs,
      ...vscodeJSONConfigs,
    }),
    yamlPlugin({
      ...dependabotYAMLConfigs,
      ...eslintYAMLConfigs,
      ...gitHooksYAMLConfigs,
      ...githubYAMLConfigs,
      ...prettierYAMLConfigs,
      ...probotAutoAssignYAMLConfigs,
      ...probotSettingsYAMLConfigs,
      ...semanticReleaseYAMLConfigs,
    })
  );
