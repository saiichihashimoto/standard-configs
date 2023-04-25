import { flow, sortBy, uniqBy } from "lodash/fp";
import { z } from "zod";

import { elementsZod, indexOf, sortAndUniqBy } from "@standard-configs/config";
import type { Config } from "@standard-configs/config";
import { yamlPlugin } from "@standard-configs/plugin-yaml";

const permissionLevel = indexOf([
  "admin",
  "maintain",
  "push",
  "triage",
  "pull",
]);

const probotSettingsConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "repository",
          "labels",
          "milestones",
          "collaborators",
          "environments",
          "teams",
          "branches",
        ]),
      ],
    },
    {
      path: /^branches\[\d+]\.protection$/,
      sortKeys: [
        indexOf([
          "required_pull_request_reviews",
          "required_status_checks",
          "enforce_admins",
          "required_linear_history",
          "restrictions",
        ]),
      ],
    },
    {
      path: /^branches\[\d+]\.protection\.required_pull_request_reviews$/,
      sortKeys: [
        indexOf([
          "required_approving_review_count",
          "dismiss_stale_reviews",
          "require_code_owner_reviews",
          "dismissal_restrictions",
        ]),
      ],
    },
    {
      path: /^branches\[\d+]\.protection\.(required_pull_request_reviews\.dismissal_restrictions|restrictions)$/,
      sortKeys: [indexOf(["apps", "users", "teams"])],
    },
    {
      path: /^branches\[\d+]\.protection\.required_status_checks$/,
      sortKeys: [indexOf(["strict", "contexts"])],
    },
    {
      path: /^collaborators\[\d+]$/,
      sortKeys: [indexOf(["username", "permission"])],
    },
    {
      path: /^environments\[\d+]$/,
      sortKeys: [
        indexOf([
          "name",
          "wait_timer",
          "reviewers",
          "deployment_branch_policy",
        ]),
      ],
    },
    {
      path: /^labels\[\d+]$/,
      sortKeys: [indexOf(["name", "color", "description"])],
    },
    {
      path: /^milestones\[\d+]$/,
      sortKeys: [indexOf(["title", "description", "state"])],
    },
    {
      path: /^repository$/,
      sortKeys: [
        indexOf([
          "name",
          "description",
          "homepage",
          "topics",
          "private",
          "has_issues",
          "has_projects",
          "has_wiki",
          "has_downloads",
          "default_branch",
          "allow_squash_merge",
          "allow_merge_commit",
          "allow_rebase_merge",
          "delete_branch_on_merge",
          "enable_automated_security_fixes",
          "enable_vulnerability_alerts",
        ]),
      ],
    },
    {
      path: /^branches$/,
      overElements: elementsZod(
        z.object({ name: z.string() }),
        flow(
          sortBy(({ value: { name } }) => [indexOf(["master"])(name), name]),
          uniqBy(({ value: { name } }) => name)
        )
      ),
    },
    {
      path: /^branches\[\d+]\.protection\.((required_pull_request_reviews\.dismissal_restrictions|restrictions)\.(apps|teams|users)|required_status_checks\.contexts)$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
    {
      path: /^collaborators$/,
      overElements: elementsZod(
        z.object({ permission: z.string(), username: z.string() }),
        flow(
          sortBy(({ value: { permission, username } }) => [
            permissionLevel(permission),
            username,
          ]),
          uniqBy(({ value: { username } }) => username)
        )
      ),
    },
    {
      path: /^environments$/,
      overElements: elementsZod(
        z.object({ name: z.string() }),
        flow(
          sortBy(({ value: { name } }) => [
            indexOf(["production", "development"])(name),
            name,
          ]),
          uniqBy(({ value: { name } }) => name)
        )
      ),
    },
    {
      path: /^environments\[\d+]\.deployment_branch_policy\.custom_branches$/,
      overElements: elementsZod(
        z.string(),
        flow(
          sortBy(({ value }) => [indexOf(["main", "dev/*"])(value), value]),
          uniqBy(({ value }) => value)
        )
      ),
    },
    {
      path: /^labels$/,
      overElements: elementsZod(
        z.object({ name: z.string() }),
        uniqBy(({ value: { name } }) => name)
      ),
    },
    {
      path: /^milestones$/,
      overElements: elementsZod(
        z.object({ title: z.string() }),
        sortAndUniqBy(({ value: { title } }) => title)
      ),
    },
    {
      path: /^teams$/,
      overElements: elementsZod(
        z.object({ name: z.string(), permission: z.string() }),
        flow(
          sortBy(({ value: { name, permission } }) => [
            permissionLevel(permission),
            name,
          ]),
          uniqBy(({ value: { name } }) => name)
        )
      ),
    },
  ],
};

export const probotSettingsYAMLConfigs = {
  ".github/settings.yml": probotSettingsConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  yamlPlugin(probotSettingsYAMLConfigs);
