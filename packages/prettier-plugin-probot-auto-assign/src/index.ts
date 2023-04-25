import { flow, sortBy, uniqBy } from "lodash/fp";
import { z } from "zod";

import { elementsZod, indexOf, sortAndUniqBy } from "@standard-configs/config";
import type { Config } from "@standard-configs/config";
import { yamlPlugin } from "@standard-configs/plugin-yaml";

const probotAutoAssignConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "addReviewers",
          "addAssignees",
          "reviewers",
          "numberOfReviewers",
          "assignees",
          "numberOfAssignees",
          "useReviewGroups",
          "reviewGroups",
          "useAssigneeGroups",
          "assigneeGroups",
          "skipKeywords",
          "skipUsers",
        ]),
      ],
    },
    {
      path: /^assignees|reviewers|(assigneeGroups|reviewGroups)\.[^.]+$/,
      overElements: elementsZod(
        z.string(),
        flow(
          sortBy(({ value }) => {
            const parts = value.split("/");

            return parts.length === 1
              ? ["zzzzzzzzzz", ...parts]
              : parts[0] === ""
              ? ["zzzzzzzzzy", ...parts.slice(1)]
              : parts;
          }),
          uniqBy(({ value }) => value)
        )
      ),
    },
    {
      path: /^skipKeywords|skipUsers$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
  ],
};

export const probotAutoAssignYAMLConfigs = {
  ".github/auto_assign.yml": probotAutoAssignConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  yamlPlugin(probotAutoAssignYAMLConfigs);
