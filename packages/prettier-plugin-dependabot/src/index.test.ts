import { formatYAML } from "@configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: ".github/dependabot.yml", format: formatYAML }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#package-ecosystem", () =>
      expectExample(`
        # Basic set up for three package managers

        version: 2
        updates:
          # EDITED Sorted

          # Maintain dependencies for Composer
          - package-ecosystem: "composer"
            directory: "/"
            schedule:
              interval: "weekly"

          # Maintain dependencies for GitHub Actions
          - package-ecosystem: "github-actions"
            directory: "/"
            schedule:
              interval: "weekly"

          # Maintain dependencies for npm
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#directory", () =>
      expectExample(`
        # Specify location of manifest files for each package manager

        version: 2
        updates:
          # EDITED Sorted

          - package-ecosystem: "composer"
            # Files stored in repository root
            directory: "/"
            schedule:
              interval: "weekly"

          - package-ecosystem: "github-actions"
            # Workflow files stored in the
            # default location of \`.github/workflows\`
            directory: "/"
            schedule:
              interval: "weekly"

          - package-ecosystem: "npm"
            # Files stored in \`app\` directory
            directory: "/app"
            schedule:
              interval: "weekly"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#scheduleinterval", () =>
      expectExample(`
        # Set update schedule for each package manager

        version: 2
        updates:
          # EDITED Sorted

          - package-ecosystem: "composer"
            directory: "/"
            schedule:
              # Check for updates managed by Composer once a week
              interval: "weekly"

          - package-ecosystem: "github-actions"
            directory: "/"
            schedule:
              # Check for updates to GitHub Actions every weekday
              interval: "daily"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#allow", () =>
      expectExample(`
        # Use \`allow\` to specify which dependencies to maintain

        version: 2
        updates:
          # EDITED Sorted

          - package-ecosystem: "composer"
            directory: "/"
            schedule:
              interval: "weekly"
            allow:
              # Allow both direct and indirect updates for all packages
              - dependency-type: "all"

          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            allow:
              # Allow updates for Lodash
              - dependency-name: "lodash"
              # Allow updates for React and any packages starting "react"
              - dependency-name: "react*"

          - package-ecosystem: "pip"
            directory: "/"
            schedule:
              interval: "weekly"
            allow:
              # Allow only direct updates for
              # Django and any packages starting "django"
              - dependency-name: "django*"
                dependency-type: "direct"
              # Allow only production updates for Sphinx
              - dependency-name: "sphinx"
                dependency-type: "production"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#assignees", () =>
      expectExample(`
        # Specify assignees for pull requests

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            # Add assignees
            assignees:
              - "octocat"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#commit-message", () =>
      expectExample(`
        # Customize commit messages

        version: 2
        updates:
          # EDITED Sorted

          - package-ecosystem: "composer"
            directory: "/"
            schedule:
              interval: "weekly"
            # Prefix all commit messages with "Composer" plus its scope, that is, a
            # list of updated dependencies
            commit-message:
              prefix: "Composer"
              include: "scope"

          - package-ecosystem: "docker"
            directory: "/"
            schedule:
              interval: "weekly"
            commit-message:
              # Prefix all commit messages with "[docker] " (no colon, but a trailing whitespace)
              prefix: "[docker] "

          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            commit-message:
              # Prefix all commit messages with "npm: "
              prefix: "npm"

          - package-ecosystem: "pip"
            directory: "/"
            schedule:
              interval: "weekly"
            # Include a list of updated dependencies
            # with a prefix determined by the dependency group
            commit-message:
              prefix: "pip prod"
              prefix-development: "pip dev"
              include: "scope"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#ignore", () =>
      expectExample(`
        # Use \`ignore\` to specify dependencies that should not be updated

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            ignore:
              # EDITED Sorted
              - dependency-name: "aws-sdk"
                update-types: ["version-update:semver-patch"]
              - dependency-name: "express"
                # For Express, ignore all updates for version 4 and 5
                versions: ["4.x", "5.x"]
                # For Lodash, ignore all updates
              - dependency-name: "lodash"
                # For AWS SDK, ignore all patch updates`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#insecure-external-code-execution", () =>
      expectExample(`
        # Allow external code execution when updating dependencies from private registries

        version: 2
        registries:
          ruby-github:
            type: rubygems-server
            url: https://rubygems.pkg.github.com/octocat/github_api
            token: \${{secrets.MY_GITHUB_PERSONAL_TOKEN}}
        updates:
          - package-ecosystem: "bundler"
            directory: "/rubygems-server"
            insecure-external-code-execution: allow
            registries: "*"
            schedule:
              interval: "monthly"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#labels", () =>
      expectExample(`
        # Specify labels for pull requests

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            # Specify labels for npm pull requests
            labels:
              # EDITED Sorted
              - "dependencies"
              - "npm"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#milestone", () =>
      expectExample(`
        # Specify a milestone for pull requests

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            # Associate pull requests with milestone "4"
            milestone: 4`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#open-pull-requests-limit", () =>
      expectExample(`
        # Specify the number of open pull requests allowed

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            # Disable version updates for npm dependencies
            open-pull-requests-limit: 0

          - package-ecosystem: "pip"
            directory: "/"
            schedule:
              interval: "weekly"
            # Allow up to 10 open pull requests for pip dependencies
            open-pull-requests-limit: 10`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#pull-request-branch-nameseparator", () =>
      expectExample(`
        # Specify a different separator for branch names

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            pull-request-branch-name:
              # Separate sections of the branch name with a hyphen
              # for example, \`dependabot-npm_and_yarn-next_js-acorn-6.4.1\`
              separator: "-"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#rebase-strategy", () =>
      expectExample(`
        # Disable automatic rebasing

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            # Disable rebasing for npm pull requests
            rebase-strategy: "disabled"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#registries", () =>
      expectExample(`
        # Allow Dependabot to use one of the two defined private registries
        # when updating dependency versions for this ecosystem

        version: 2
        registries:
          maven-github:
            type: maven-repository
            url: https://maven.pkg.github.com/octocat
            username: octocat
            password: \${{secrets.MY_ARTIFACTORY_PASSWORD}}
          npm-npmjs:
            type: npm-registry
            url: https://registry.npmjs.org
            username: octocat
            password: \${{secrets.MY_NPM_PASSWORD}}
        updates:
          - package-ecosystem: "gitsubmodule"
            directory: "/"
            registries:
              - maven-github
            schedule:
              interval: "monthly"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#reviewers", () =>
      expectExample(`
        # Specify reviewers for pull requests

        version: 2
        updates:
          - package-ecosystem: "pip"
            directory: "/"
            schedule:
              interval: "weekly"
            # Add reviewers
            reviewers:
              # EDITED Sorted
              - "my-org/python-team"
              - "my-username"
              - "octocat"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#scheduleday", () =>
      expectExample(`
        # Specify the day for weekly checks

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
              # Check for npm updates on Sundays
              day: "sunday"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#scheduletime", () =>
      expectExample(`
        # Set a time for checks
        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
              # Check for npm updates at 9am UTC
              time: "09:00"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#scheduletimezone", () =>
      expectExample(`
        # Specify the timezone for checks

        version: 2
        updates:
          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
              time: "09:00"
              # Use Japan Standard Time (UTC +09:00)
              timezone: "Asia/Tokyo"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#target-branch", () =>
      expectExample(`
        # Specify a non-default branch for pull requests for pip

        version: 2
        updates:
          # EDITED Sorted

          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
              # Check for npm updates on Sundays
              day: "sunday"
            # Labels on pull requests for security and version updates
            labels:
              - "npm dependencies"

          - package-ecosystem: "pip"
            directory: "/"
            schedule:
              interval: "weekly"
            # Raise pull requests for version updates
            # to pip against the \`develop\` branch
            target-branch: "develop"
            # Labels on pull requests for version updates only
            labels:
              - "pip dependencies"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#vendor", () =>
      expectExample(`
        # Configure version updates for both dependencies defined in manifests and vendored dependencies

        version: 2
        updates:
          - package-ecosystem: "bundler"
            # Raise pull requests to update vendored dependencies that are checked in to the repository
            vendor: true
            directory: "/"
            schedule:
              interval: "weekly"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#versioning-strategy", () =>
      expectExample(`
        # Customize the manifest version strategy

        version: 2
        updates:
          # EDITED Sorted

          - package-ecosystem: "composer"
            directory: "/"
            schedule:
              interval: "weekly"
            # Increase the version requirements for Composer
            # only when required
            versioning-strategy: increase-if-necessary

          - package-ecosystem: "npm"
            directory: "/"
            schedule:
              interval: "weekly"
            # Update the npm manifest file to relax
            # the version requirements
            versioning-strategy: widen

          - package-ecosystem: "pip"
            directory: "/"
            schedule:
              interval: "weekly"
            # Only allow updates to the lockfile for pip and
            # ignore any version updates that affect the manifest
            versioning-strategy: lockfile-only`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#configuration-options-for-private-registries", () =>
      expectExample(`
        # Minimal settings to update dependencies in one private registry

        version: 2
        registries:
          dockerhub: # Define access for a private registry
            type: docker-registry
            url: registry.hub.docker.com
            username: octocat
            password: \${{secrets.DOCKERHUB_PASSWORD}}
        updates:
          - package-ecosystem: "docker"
            directory: "/docker-registry/dockerhub"
            registries:
              - dockerhub # Allow version updates for dependencies in this registry
            schedule:
              interval: "monthly"`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#composer-repository", () =>
      expectExample(`
        registries:
          composer:
            type: composer-repository
            url: https://repo.packagist.com/example-company/
            username: octocat
            password: \${{secrets.MY_PACKAGIST_PASSWORD}}`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#docker-registry", () =>
      expectExample(`
        registries:
          dockerhub:
            type: docker-registry
            url: https://registry.hub.docker.com
            username: octocat
            password: \${{secrets.MY_DOCKERHUB_PASSWORD}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#docker-registry ecr", () =>
      expectExample(`
        registries:
          ecr-docker:
            type: docker-registry
            url: https://1234567890.dkr.ecr.us-east-1.amazonaws.com
            username: \${{secrets.ECR_AWS_ACCESS_KEY_ID}}
            password: \${{secrets.ECR_AWS_SECRET_ACCESS_KEY}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#git", () =>
      expectExample(`
        registries:
          github-octocat:
            type: git
            url: https://github.com
            username: x-access-token
            password: \${{secrets.MY_GITHUB_PERSONAL_TOKEN}}`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#hex-organization", () =>
      expectExample(`
        registries:
          github-hex-org:
            type: hex-organization
            organization: github
            key: \${{secrets.MY_HEX_ORGANIZATION_KEY}}`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#hex-repository", () =>
      expectExample(`
        registries:
          github-hex-repository:
            type: hex-repository
            repo: private-repo
            url: https://private-repo.example.com
            auth-key: \${{secrets.MY_AUTH_KEY}}
            public-key-fingerprint: \${{secrets.MY_PUBLIC_KEY_FINGERPRINT}}`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#maven-repository", () =>
      expectExample(`
        registries:
          maven-artifactory:
            type: maven-repository
            url: https://artifactory.example.com
            username: octocat
            password: \${{secrets.MY_ARTIFACTORY_PASSWORD}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#npm-registry", () =>
      expectExample(`
        registries:
          npm-npmjs:
            type: npm-registry
            url: https://registry.npmjs.org
            username: octocat
            password: \${{secrets.MY_NPM_PASSWORD}}  # Must be an unencoded password
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#npm-registry token", () =>
      expectExample(`
        registries:
          npm-github:
            type: npm-registry
            url: https://npm.pkg.github.com
            token: \${{secrets.MY_GITHUB_PERSONAL_TOKEN}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#nuget-feed", () =>
      expectExample(`
        registries:
          nuget-example:
            type: nuget-feed
            url: https://nuget.example.com/v3/index.json
            username: octocat@example.com
            password: \${{secrets.MY_NUGET_PASSWORD}}`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#nuget-feed token", () =>
      expectExample(`
        registries:
          nuget-azure-devops:
            type: nuget-feed
            url: https://pkgs.dev.azure.com/.../_packaging/My_Feed/nuget/v3/index.json
            username: octocat@example.com
            password: \${{secrets.MY_AZURE_DEVOPS_TOKEN}}`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#python-index", () =>
      expectExample(`
        registries:
          python-example:
            type: python-index
            url: https://example.com/_packaging/my-feed/pypi/example
            username: octocat
            password: \${{secrets.MY_BASIC_AUTH_PASSWORD}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#python-index token", () =>
      expectExample(`
        registries:
          python-azure:
            type: python-index
            url: https://pkgs.dev.azure.com/octocat/_packaging/my-feed/pypi/example
            username: octocat@example.com
            password: \${{secrets.MY_AZURE_DEVOPS_TOKEN}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#rubygems-server", () =>
      expectExample(`
        registries:
          ruby-example:
            type: rubygems-server
            url: https://rubygems.example.com
            username: octocat@example.com
            password: \${{secrets.MY_RUBYGEMS_PASSWORD}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#rubygems-server token", () =>
      expectExample(`
        registries:
          ruby-github:
            type: rubygems-server
            url: https://rubygems.pkg.github.com/octocat/github_api
            token: \${{secrets.MY_GITHUB_PERSONAL_TOKEN}}
            replaces-base: true`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#terraform-registry", () =>
      expectExample(`
        registries:
          terraform-example:
            type: terraform-registry
            url: https://terraform.example.com
            token: \${{secrets.MY_TERRAFORM_API_TOKEN}}`));

    it("https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#enable-beta-ecosystems", () =>
      expectExample(
        `# Configure beta ecosystem

        version: 2
        enable-beta-ecosystems: true
        updates:
          - package-ecosystem: "beta-ecosystem"
            directory: "/"
            schedule:
              interval: "weekly"`
      ));
  }
);
