import { sortBy } from "lodash/fp";
import { z } from "zod";

import {
  type Config,
  elementsZod,
  indexOf,
  sortAndUniqBy,
} from "@standard-configs/config";
import { yamlPlugin } from "@standard-configs/plugin-yaml";

const dependabotConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf(["version", "enable-beta-ecosystems", "registries", "updates"]),
      ],
    },
    {
      path: /^registries\.[^.]+$/,
      sortKeys: [
        indexOf([
          "type",
          "repo",
          "url",
          "auth-key",
          "public-key-fingerprint",
          "username",
          "password",
          "organization",
          "key",
          "token",
          "replaces-base",
        ]),
      ],
    },
    {
      path: /^updates\[\d+]$/,
      sortKeys: [
        indexOf([
          "package-ecosystem",
          "vendor",
          "directory",
          "insecure-external-code-execution",
          "registries",
          "schedule",
          "allow",
          "assignees",
          "commit-message",
          "ignore",
          "target-branch",
          "labels",
          "milestone",
          "open-pull-requests-limit",
          "pull-request-branch-name",
          "rebase-strategy",
          "reviewers",
          "versioning-strategy",
        ]),
      ],
    },
    {
      path: /^updates\[\d+]\.commit-message$/,
      sortKeys: [indexOf(["prefix", "prefix-development", "include"])],
    },
    {
      path: /^updates\[\d+]\.ignore\[\d+]$/,
      sortKeys: [indexOf(["dependency-name", "versions", "update-types"])],
    },
    {
      path: /^updates\[\d+]\.schedule$/,
      sortKeys: [indexOf(["interval", "day", "time", "timezone"])],
    },
    {
      path: /^updates$/,
      overElements: elementsZod(
        z.object({
          "directory": z.string(),
          "package-ecosystem": z.string(),
        }),
        sortBy(
          ({ value: { directory, "package-ecosystem": packageEcosystem } }) => [
            packageEcosystem,
            directory,
          ]
        )
      ),
    },
    {
      path: /^updates\[\d+]\.(allow|ignore)$/,
      overElements: elementsZod(
        z.object({ "dependency-name": z.string() }),
        sortBy(({ value: { "dependency-name": name } }) => name)
      ),
    },
    {
      path: /^updates\[\d+]\.(assignees|labels|registries|reviewers|ignore\[\d+]\.(update-types|versions))$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
  ],
};

export const dependabotYAMLConfigs = {
  ".github/dependabot.yml": dependabotConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  yamlPlugin(dependabotYAMLConfigs);
