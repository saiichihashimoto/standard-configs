import { mergePlugins } from "@configs/plugin";
import { ignorePlugin } from "@configs/plugin-ignore";
import { jsonPlugin } from "@configs/plugin-json";
import { yamlPlugin } from "@configs/plugin-yaml";
import { babelJSONConfigs } from "@configs/prettier-plugin-babel";
import { bowerJSONConfigs } from "@configs/prettier-plugin-bower";
import { dependabotYAMLConfigs } from "@configs/prettier-plugin-dependabot";
import {
  eslintIgnoreConfigs,
  eslintJSONConfigs,
  eslintYAMLConfigs,
} from "@configs/prettier-plugin-eslint";
import { firebaseJSONConfigs } from "@configs/prettier-plugin-firebase";
import { gitIgnoreConfigs } from "@configs/prettier-plugin-git";
import {
  gitHooksJSONConfigs,
  gitHooksYAMLConfigs,
} from "@configs/prettier-plugin-git-hooks";
import { githubYAMLConfigs } from "@configs/prettier-plugin-github";
import { npmIgnoreConfigs } from "@configs/prettier-plugin-npm";
import { packageJSONConfigs } from "@configs/prettier-plugin-package-json";
import {
  prettierIgnoreConfigs,
  prettierJSONConfigs,
  prettierYAMLConfigs,
} from "@configs/prettier-plugin-prettier";
import { probotAutoAssignYAMLConfigs } from "@configs/prettier-plugin-probot-auto-assign";
import { probotSettingsYAMLConfigs } from "@configs/prettier-plugin-probot-settings";
import { sanityJSONConfigs } from "@configs/prettier-plugin-sanity";
import {
  semanticReleaseJSONConfigs,
  semanticReleaseYAMLConfigs,
} from "@configs/prettier-plugin-semantic-release";
import { tsconfigJSONConfigs } from "@configs/prettier-plugin-tsconfig";
import { tsupJSONConfigs } from "@configs/prettier-plugin-tsup";
import { vscodeJSONConfigs } from "@configs/prettier-plugin-vscode";

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
