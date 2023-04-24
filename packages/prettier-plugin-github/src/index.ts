import { flow, keyBy, map, toPairs } from "lodash/fp";
import { array as toposort } from "toposort";
import { z } from "zod";

import {
  type Config,
  type Operation,
  indexOf,
  nestConfig,
  propertiesZod,
} from "@standard-configs/config";
import { yamlPlugin } from "@standard-configs/plugin-yaml";

const githubIssueTemplateConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "name",
          "description",
          "title",
          "labels",
          "assignees",
          "body",
        ]),
      ],
    },
    {
      path: /^body\[\d+]$/,
      sortKeys: [indexOf(["type", "id", "attributes", "validations"])],
    },
    {
      path: /^body\[\d+]\.attributes$/,
      sortKeys: [
        indexOf([
          "label",
          "description",
          "multiple",
          "options",
          "placeholder",
          "value",
          "render",
        ]),
      ],
    },
  ],
};

const githubIssueTemplateConfigConfig: Config = {
  operations: [
    {
      path: /^contact_links\[\d+]$/,
      sortKeys: [indexOf(["name", "url", "about"])],
    },
  ],
};

const rootGithubActionsConfig: Config = {
  operations: [
    {
      path: /^concurrency$/,
      sortKeys: [indexOf(["group", "cancel-in-progress"])],
    },
    {
      path: /^permissions$/,
      sortKeys: [
        indexOf([
          "actions",
          "checks",
          "contents",
          "deployments",
          "id-token",
          "issues",
          "discussions",
          "packages",
          "pages",
          "pull-requests",
          "repository-projects",
          "security-events",
          "statuses",
        ]),
      ],
    },
  ],
};

const githubActionsConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "name",
          "run-name",
          "on",
          "permissions",
          "env",
          "defaults",
          "concurrency",
          "jobs",
          "timeout-minutes",
        ]),
      ],
    },
    {
      path: /^jobs$/,
      overProperties: propertiesZod(
        z.optional(
          z.object({
            needs: z.optional(z.union([z.string(), z.array(z.string())])),
          })
        ),
        (properties) => {
          const propertyByKey = keyBy(({ key }) => key, properties);

          return toposort(
            properties.map(({ key }) => key),
            properties.flatMap(({ key, value: { needs = [] } = {} }) =>
              (typeof needs === "string" ? [needs] : needs).map(
                (need) => [need, key] as [string, string]
              )
            )
          ).map((key) => propertyByKey[key]!);
        }
      ),
    },
    {
      path: /^jobs\.[^.]+$/,
      sortKeys: [
        indexOf((unmatched) => [
          "name",
          "if",
          "needs",
          "runs-on",
          "permissions",
          "continue-on-error",
          "environment",
          "concurrency",
          "outputs",
          "env",
          "defaults",
          "container",
          "services",
          "steps",
          "uses",
          "with",
          "secrets",
          unmatched,
          "strategy",
        ]),
      ],
      overProperties: propertiesZod(z.any(), (properties) => {
        // Puts strategy before any fields that reference the matrix
        const strategy = properties.at(-1)!;

        if (strategy.key !== "strategy") {
          return properties;
        }

        const firstReferenceIndex = properties.findIndex(({ value }) =>
          JSON.stringify(value).includes("matrix.")
        );

        if (firstReferenceIndex === -1) {
          return properties;
        }

        return [
          ...properties.slice(0, firstReferenceIndex),
          strategy,
          ...properties.slice(firstReferenceIndex, -1),
        ];
      }),
    },
    {
      path: /^jobs\.[^.]+\.(container|services\.[^.]+)$/,
      sortKeys: [
        indexOf(["image", "credentials", "env", "ports", "volumes", "options"]),
      ],
    },
    {
      path: /^jobs\.[^.]+\.services\.[^.]+\.credentials$/,
      sortKeys: [indexOf(["username", "password"])],
    },
    {
      path: /^jobs\.[^.]+\.steps\[\d+]$/,
      sortKeys: [
        indexOf([
          "name",
          "id",
          "if",
          "uses",
          "env",
          "run",
          "shell",
          "with",
          "continue-on-error",
          "timeout-minutes",
        ]),
      ],
    },
    {
      path: /^jobs\.[^.]+\.strategy$/,
      sortKeys: [indexOf(["fail-fast", "max-parallel", "matrix"])],
    },
    {
      path: /^jobs\.[^.]+\.strategy\.matrix(\.(exclude|include)\[\d+])?$/,
      sortKeys: [
        indexOf((unmatched) => [unmatched, unmatched, "include", "exclude"]),
        null,
      ],
    },
    {
      path: /^on$/,
      sortKeys: [indexOf(["label", "push", "page_build"])],
    },
    {
      path: /^on\.pull_request$/,
      sortKeys: [indexOf(["types", "paths"])],
    },
    {
      path: /^on\.workflow_call\.inputs\.[^.]+$/,
      sortKeys: [
        indexOf(["description", "default", "required", "type", "options"]),
      ],
    },
    {
      path: /^on\.workflow_dispatch\.inputs$/,
      sortKeys: [null],
    },
    {
      path: /^on\.workflow_dispatch\.inputs\.[^.]+$/,
      sortKeys: [
        indexOf(["description", "required", "default", "type", "options"]),
      ],
    },
    {
      path: /^on\.workflow_run$/,
      sortKeys: [
        indexOf(["workflows", "types", "branches", "branches-ignore"]),
      ],
    },
    ...flow(
      toPairs<Omit<Operation, "if" | "path">>,
      map(
        ([actionName, config]): Operation => ({
          path: /^jobs\.[^.]+\.steps\[\d+]\.with$/,
          if: ({ getParentValue }) =>
            z
              .object({
                uses: z.string().startsWith(actionName),
              })
              .safeParse(getParentValue(2)).success,
          ...config,
        })
      )
    )({
      "actions/cache": {
        sortKeys: [
          indexOf([
            "path",
            "key",
            "restore-keys",
            "enableCrossOsArchive",
            "fail-on-cache-miss",
            "lookup-only",
          ]),
        ],
      },
      "actions/checkout": {
        sortKeys: [
          indexOf([
            "repository",
            "ref",
            "token",
            "ssh-key",
            "ssh-known-hosts",
            "ssh-strict",
            "persist-credentials",
            "path",
            "clean",
            "fetch-depth",
            "lfs",
            "submodules",
            "set-safe-directory",
            "github-server-url",
          ]),
        ],
      },
      "actions/setup-node": {
        sortKeys: [
          indexOf([
            "token",
            "node-version",
            "node-version-file",
            "cache",
            "cache-dependency-path",
            "check-latest",
            "architecture",
            "registry-url",
          ]),
        ],
      },
      "octo-org/action-name": {
        sortKeys: [indexOf(["entrypoint", "args"])],
      },
      "peter-evans/create-pull-request": {
        sortKeys: [
          indexOf([
            "token",
            "path",
            "add-paths",
            "commit-message",
            "committer",
            "author",
            "signoff",
            "branch",
            "delete-branch",
            "branch-suffix",
            "base",
            "push-to-fork",
            "title",
            "body",
            "labels",
            "assignees",
            "reviewers",
            "team-reviewers",
            "milestone",
            "draft",
          ]),
        ],
      },
    }),
    ...nestConfig(/^$/, rootGithubActionsConfig),
    ...nestConfig(/^jobs\.[^.]+$/, rootGithubActionsConfig),
  ],
};

export const githubYAMLConfigs = {
  ".github/ISSUE_TEMPLATE/!(config).yml": githubIssueTemplateConfig,
  ".github/ISSUE_TEMPLATE/config.yml": githubIssueTemplateConfigConfig,
  ".github/workflows/*.yml": githubActionsConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  yamlPlugin(githubYAMLConfigs);
