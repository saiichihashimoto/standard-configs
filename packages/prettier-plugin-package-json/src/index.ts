import { flow, over, replace, uniqBy } from "lodash/fp";
import { z } from "zod";

import {
  type Config,
  elementsZod,
  indexOf,
  nestConfig,
  sortAndUniqBy,
} from "@configs/config";
import { jsonPlugin } from "@configs/plugin-json";
import { avaConfig } from "@configs/prettier-plugin-ava";
import { babelConfig } from "@configs/prettier-plugin-babel";
import {
  eslintConfig,
  eslintIgnoreConfig,
} from "@configs/prettier-plugin-eslint";
import {
  huskyConfig,
  simpleGitHooksConfig,
} from "@configs/prettier-plugin-git-hooks";
import { prettierConfig } from "@configs/prettier-plugin-prettier";
import { semanticReleaseConfig } from "@configs/prettier-plugin-semantic-release";
import { tsupConfig } from "@configs/prettier-plugin-tsup";

const packageConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "name",
          "displayName",
          "version",
          "private",
          "description",
          "categories",
          "keywords",
          "homepage",
          "bugs",
          "repository",
          "funding",
          "license",
          "licenses",
          "qna",
          "author",
          "maintainers",
          "contributors",
          "publisher",
          "sideEffects",
          "type",
          "imports",
          "exports",
          "main",
          "svelt",
          "umd:main",
          "jsdeliver",
          "unpkg",
          "module",
          "source",
          "jsnext:main",
          "browser",
          "react-native",
          "types",
          "typesVersions",
          "typings",
          "style",
          "example",
          "examplestyle",
          "assets",
          "bin",
          "man",
          "directories",
          "files",
          "workspaces",
          "binary",
          "scripts",
          "betterScripts",
          "contributes",
          "activationEvents",
          "husky",
          "simple-git-hooks",
          "pre-commit",
          "commitlint",
          "lint-staged",
          "config",
          "nodemonConfig",
          "browserify",
          "babel",
          "tsup",
          "browserslist",
          "xo",
          "prettier",
          "eslintConfig",
          "eslintIgnore",
          "npmpkgjsonlint",
          "npmPackageJsonLintConfig",
          "npmpackagejsonlint",
          "release",
          "remarkConfig",
          "stylelint",
          "ava",
          "jest",
          "jest-junit",
          "jest-stare",
          "mocha",
          "nyc",
          "c8",
          "tap",
          "resolutions",
          "dependencies",
          "devDependencies",
          "devDependenciesMeta",
          "peerDependencies",
          "peerDependenciesMeta",
          "optionalDependencies",
          "bundledDependencies",
          "bundleDependencies",
          "overrides",
          "extensionPack",
          "extensionDependencies",
          "flat",
          "packageManager",
          "engines",
          "engineStrict",
          "volta",
          "languageName",
          "os",
          "cpu",
          "preferGlobal",
          "publishConfig",
          "icon",
          "badges",
          "galleryBanner",
          "preview",
          "markdown",
        ]),
      ],
    },
    {
      path: /^activationEvents|categories|files|keywords$/,
      overElements: elementsZod(
        z.string(),
        uniqBy(({ value }) => value)
      ),
    },
    {
      path: /^author|((contributors|maintainers)\[\d+])$/,
      sortKeys: [indexOf(["name", "email", "url"])],
    },
    {
      path: /^badges\[\d+]$/,
      sortKeys: [indexOf(["url", "href", "description"])],
    },
    {
      path: /^betterScripts|scripts$/,
      sortKeys: [
        over<number | string>([
          flow(
            replace(/^(pre|post)(?!pare|publish|publishOnly)/g, ""),
            replace(/^(.*?):.*$/, "$1")
          ),
          (value: string) =>
            value.startsWith("pre") &&
            !/^pre(pare|publish|publishOnly)/g.test(value)
              ? 0
              : value.startsWith("post")
              ? 3
              : value.includes(":")
              ? 2
              : 1,
        ]),
      ],
    },
    {
      path: /^binary$/,
      sortKeys: [
        indexOf([
          "module_name",
          "module_path",
          "remote_path",
          "package_name",
          "host",
        ]),
      ],
    },
    { path: /^bugs$/, sortKeys: [indexOf(["url", "email"])] },
    {
      path: /^directories$/,
      sortKeys: [indexOf(["lib", "bin", "man", "doc", "example", "test"])],
    },
    {
      path: /^extensionDependencies|extensionPack$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
    {
      path: /^funding|license|repository|((funding|licenses)\[\d+])$/,
      sortKeys: [indexOf(["type", "url", "directory"])],
    },
    ...nestConfig(/^ava$/, avaConfig),
    ...nestConfig(/^babel$/, babelConfig),
    ...nestConfig(/^eslintConfig$/, eslintConfig),
    ...nestConfig(/^eslintIgnore$/, eslintIgnoreConfig),
    ...nestConfig(/^husky$/, huskyConfig),
    ...nestConfig(/^prettier$/, prettierConfig),
    ...nestConfig(/^release$/, semanticReleaseConfig),
    ...nestConfig(/^simple-git-hooks$/, simpleGitHooksConfig),
    ...nestConfig(/^tsup$/, tsupConfig),
  ],
};

export const packageJSONConfigs = {
  "package.json": packageConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(packageJSONConfigs);
