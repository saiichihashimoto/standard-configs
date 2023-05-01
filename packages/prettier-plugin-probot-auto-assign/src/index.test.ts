import { formatYAML } from "@standard-configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: ".github/auto_assign.yml", format: formatYAML }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://github.com/kentaro-m/auto-assign/#single-reviewers-list", () =>
      expectExample(`
        # Set to true to add reviewers to pull requests
        addReviewers: true

        # Set to true to add assignees to pull requests
        addAssignees: false

        # A list of reviewers to be added to pull requests (GitHub user name)
        reviewers:
          - reviewerA
          - reviewerB
          - reviewerC

        # A number of reviewers added to the pull request
        # Set 0 to add all the reviewers (default: 0)
        numberOfReviewers: 0

        # A list of assignees, overrides reviewers if set
        # assignees:
        #   - assigneeA

        # A number of assignees to add to the pull request
        # Set to 0 to add all of the assignees.
        # Uses numberOfReviewers if unset.
        # numberOfAssignees: 2

        # A list of keywords to be skipped the process that add reviewers if pull requests include it
        # skipKeywords:
        #   - wip

        # A list of users to be skipped by both the add reviewers and add assignees processes
        # skipUsers:
        #   - dependabot[bot]`));

    it("https://github.com/kentaro-m/auto-assign/#add-github-team-to-single-reviewers-list", () =>
      expectExample(`
        # Set to true to add reviewers to pull requests
        addReviewers: true

        # Set to true to add assignees to pull requests
        addAssignees: false

        # A list of team reviewers to be added to pull requests (GitHub team slug)
        reviewers:
          - org/teamReviewerA
          - org/teamReviewerB
          - /teamReviewerC

        # Number of reviewers has no impact on Github teams
        # Set 0 to add all the reviewers (default: 0)
        numberOfReviewers: 0

        # A list of assignees, overrides reviewers if set
        # assignees:
        #   - assigneeA

        # A number of assignees to add to the pull request
        # Set to 0 to add all of the assignees.
        # Uses numberOfReviewers if unset.
        # numberOfAssignees: 2

        # A list of keywords to be skipped the process that add reviewers if pull requests include it
        # skipKeywords:
        #   - wip`));

    it("https://github.com/kentaro-m/auto-assign/#multiple-reviewers-list", () =>
      expectExample(`
        # Set to true to add reviewers to pull requests
        addReviewers: true

        # Set to true to add assignees to pull requests
        addAssignees: false

        # A number of reviewers added to the pull request
        # Set 0 to add all the reviewers (default: 0)
        numberOfReviewers: 1

        # A number of assignees to add to the pull request
        # Set to 0 to add all of the assignees.
        # Uses numberOfReviewers if unset.
        # numberOfAssignees: 2

        # Set to true to add reviewers from different groups to pull requests
        useReviewGroups: true

        # A list of reviewers, split into different groups, to be added to pull requests (GitHub user name)
        reviewGroups:
          groupA:
            - reviewerA
            - reviewerB
            - reviewerC
          groupB:
            - reviewerD
            - reviewerE
            - reviewerF

        # Set to true to add assignees from different groups to pull requests
        useAssigneeGroups: false

        # A list of assignees, split into different froups, to be added to pull requests (GitHub user name)
        # assigneeGroups:
        #   groupA:
        #     - assigneeA
        #     - assigneeB
        #     - assigneeC
        #   groupB:
        #     - assigneeD
        #     - assigneeE
        #     - assigneeF

        # A list of keywords to be skipped the process that add reviewers if pull requests include it
        # skipKeywords:
        #   - wip`));

    it("_extends before everything", () =>
      expectExample(`
        _extends: someone
        addReviewers: true`));
  }
);
