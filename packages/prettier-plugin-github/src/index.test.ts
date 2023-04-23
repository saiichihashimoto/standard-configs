import { formatYAML } from "@configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

describe.each([
  { filename: ".github/ISSUE_TEMPLATE/arbitrary.yml", format: formatYAML },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#about-yaml-syntax-for-issue-forms", () =>
    expectExample(`
      name: Bug Report
      description: File a bug report
      title: "[Bug]: "
      labels: ["bug", "triage"]
      assignees:
        - octocat
      body:
        - type: markdown
          attributes:
            value: |
              Thanks for taking the time to fill out this bug report!
        - type: input
          id: contact
          attributes:
            label: Contact Details
            description: How can we get in touch with you if we need more info?
            placeholder: ex. email@example.com
          validations:
            required: false
        - type: textarea
          id: what-happened
          attributes:
            label: What happened?
            description: Also tell us, what did you expect to happen?
            placeholder: Tell us what you see!
            value: "A bug happened!"
          validations:
            required: true
        - type: dropdown
          id: version
          attributes:
            label: Version
            description: What version of our software are you running?
            options:
              - 1.0.2 (Default)
              - 1.0.3 (Edge)
          validations:
            required: true
        - type: dropdown
          id: browsers
          attributes:
            label: What browsers are you seeing the problem on?
            multiple: true
            options:
              - Firefox
              - Chrome
              - Safari
              - Microsoft Edge
        - type: textarea
          id: logs
          attributes:
            label: Relevant log output
            description: Please copy and paste any relevant log output. This will be automatically formatted into code, so no need for backticks.
            render: shell
        - type: checkboxes
          id: terms
          attributes:
            label: Code of Conduct
            description: By submitting this issue, you agree to follow our [Code of Conduct](https://example.com)
            options:
              - label: I agree to follow this project's Code of Conduct
                required: true`));

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#yaml-issue-form-template", () =>
    expectExample(`
      name: 🐞 Bug
      description: File a bug/issue
      title: "[BUG] <title>"
      labels: [Bug, Needs Triage]
      body:
      - type: checkboxes
        attributes:
          label: Is there an existing issue for this?
          description: Please search to see if an issue already exists for the bug you encountered.
          options:
          - label: I have searched the existing issues
            required: true
      - type: textarea
        attributes:
          label: Current Behavior
          description: A concise description of what you're experiencing.
        validations:
          required: false
      - type: textarea
        attributes:
          label: Expected Behavior
          description: A concise description of what you expected to happen.
        validations:
          required: false
      - type: textarea
        attributes:
          label: Steps To Reproduce
          description: Steps to reproduce the behavior.
          placeholder: |
            1. In this environment...
            2. With this config...
            3. Run '...'
            4. See error...
        validations:
          required: false
      - type: textarea
        attributes:
          label: Environment
          description: |
            examples:
              - **OS**: Ubuntu 20.04
              - **Node**: 13.14.0
              - **npm**: 7.6.3
          value: |
              - OS:
              - Node:
              - npm:
          render: markdown
        validations:
          required: false
      - type: textarea
        attributes:
          label: Anything else?
          description: |
            Links? References? Anything that will give us more context about the issue you are encountering!

            Tip: You can attach images or log files by clicking this area to highlight it and then dragging files in.
        validations:
          required: false`));

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#about-githubs-form-schema", () =>
    expectExample(`
      body:
      - type: textarea
        attributes:
          label: Operating System
          description: What operating system are you using?
          placeholder: "Example: macOS Big Sur"
          value: operating system
        validations:
          required: true
      - type: dropdown
        attributes:
          label: Version
          description: What version of our software are you running?
          multiple: false
          options:
            - 1.0.2 (Default)
            - 1.0.3 (Edge)
        validations:
          required: true
      - type: checkboxes
        attributes:
          label: Code of Conduct
          description: The Code of Conduct helps create a safe space for everyone. We require
            that everyone agrees to it.
          options:
            - label: I agree to follow this project's [Code of Conduct](link/to/coc)
              required: true
      - type: markdown
        attributes:
          value: "Thanks for completing our form!"`));

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#example-of-markdown", () =>
    expectExample(`
      body:
      - type: markdown
        attributes:
          value: "## Thank you for contributing to our project!"
      - type: markdown
        attributes:
          value: |
            Thanks for taking the time to fill out this bug report.`));

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#validations-for-textarea", () =>
    expectExample(`
      body:
      - type: textarea
        id: repro
        attributes:
          label: Reproduction steps
          description: "How do you trigger this bug? Please walk us through it step by step."
          value: |
            1.
            2.
            3.
            ...
          render: bash
        validations:
          required: true`));

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#input", () =>
    expectExample(`
      body:
      - type: input
        id: prevalence
        attributes:
          label: Bug prevalence
          description: "How often do you or others encounter this bug?"
          placeholder: "Example: Whenever I visit the personal account page (1-2 times a week)"
        validations:
          required: true`));

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#dropdown", () =>
    expectExample(`
      body:
      - type: dropdown
        id: download
        attributes:
          label: How did you download the software?
          options:
            - Homebrew
            - MacPorts
            - apt-get
            - Built from source
        validations:
          required: true`));

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#checkboxes", () =>
    expectExample(`
      body:
      - type: checkboxes
        id: operating-systems
        attributes:
          label: Which operating systems have you used?
          description: You may select more than one.
          options:
            - label: macOS
            - label: Windows
            - label: Linux`));
});

describe.each([
  { filename: ".github/ISSUE_TEMPLATE/config.yml", format: formatYAML },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#configuring-the-template-chooser", () =>
    expectExample(`
      blank_issues_enabled: false
      contact_links:
        - name: GitHub Community Support
          url: https://github.com/orgs/community/discussions
          about: Please ask and answer questions here.
        - name: GitHub Security Bug Bounty
          url: https://bounty.github.com/
          about: Please report security vulnerabilities here.`));
});

describe.each([
  { filename: ".github/workflows/arbitrary.yml", format: formatYAML },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://docs.github.com/en/actions/using-workflows/about-workflows#create-an-example-workflow", () =>
    expectExample(`
      name: learn-github-actions
      run-name: \${{ github.actor }} is learning GitHub Actions
      on: [push]
      jobs:
        check-bats-version:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                node-version: '14'
            - run: npm install -g bats
            - run: bats -v`));

  it("https://docs.github.com/en/actions/using-workflows/about-workflows#storing-secrets", () =>
    expectExample(`
      jobs:
        example-job:
          runs-on: ubuntu-latest
          steps:
            - name: Retrieve secret
              env:
                super_secret: \${{ secrets.SUPERSECRET }}
              run: |
                example-command "$super_secret"`));

  it("https://docs.github.com/en/actions/using-workflows/about-workflows#creating-dependent-jobs", () =>
    expectExample(`
      jobs:
        setup:
          runs-on: ubuntu-latest
          steps:
            - run: ./setup_server.sh
        build:
          needs: setup
          runs-on: ubuntu-latest
          steps:
            - run: ./build_server.sh
        test:
          needs: build
          runs-on: ubuntu-latest
          steps:
            - run: ./test_server.sh`));

  it("https://docs.github.com/en/actions/using-workflows/about-workflows#using-a-matrix", () =>
    expectExample(`
      jobs:
        build:
          runs-on: ubuntu-latest
          strategy:
            matrix:
              node: [12, 14, 16]
          steps:
            - uses: actions/setup-node@v3
              with:
                node-version: \${{ matrix.node }}`));

  it("https://docs.github.com/en/actions/using-workflows/about-workflows#caching-dependencies", () =>
    expectExample(`
      jobs:
        example-job:
          steps:
            - name: Cache node modules
              uses: actions/cache@v3
              env:
                cache-name: cache-node-modules
              with:
                path: ~/.npm
                key: \${{ runner.os }}-build-\${{ env.cache-name }}-\${{ hashFiles('**/package-lock.json') }}
                restore-keys: |
                  \${{ runner.os }}-build-\${{ env.cache-name }}-`));

  it("https://docs.github.com/en/actions/using-workflows/about-workflows#using-databases-and-service-containers", () =>
    expectExample(`
      jobs:
        container-job:
          runs-on: ubuntu-latest
          container: node:10.18-jessie
          services:
            postgres:
              image: postgres
          steps:
            - name: Check out repository code
              uses: actions/checkout@v3
            - name: Install dependencies
              run: npm ci
            - name: Connect to PostgreSQL
              # EDITED Put env before run
              env:
                POSTGRES_HOST: postgres
                POSTGRES_PORT: 5432
              run: node client.js`));

  it("https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow", () =>
    expectExample(`
      on:
        issues:
          types:
            - opened

      jobs:
        label_issue:
          runs-on: ubuntu-latest
          steps:
            - env:
                GITHUB_TOKEN: \${{ secrets.MY_TOKEN }}
                ISSUE_URL: \${{ github.event.issue.html_url }}
              run: |
                gh issue edit $ISSUE_URL --add-label "triage"`));

  it("https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#using-activity-types-and-filters-with-multiple-events", () =>
    expectExample(`
      on:
        label:
          types:
            - created
        push:
          branches:
            - main
        page_build:`));

  it("https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#using-filters-to-target-specific-branches-for-workflow-run-events", () =>
    expectExample(`
      on:
        workflow_run:
          workflows: ["Build"]
          types: [requested]
          branches:
            - 'releases/**'`));

  it("https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#using-filters-to-target-specific-branches-for-workflow-run-events branches-ignore", () =>
    expectExample(`
      on:
        workflow_run:
          workflows: ["Build"]
          types: [requested]
          branches-ignore:
            - "canary"`));

  it("https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#defining-inputs-for-manually-triggered-workflows", () =>
    expectExample(`
      on:
        workflow_dispatch:
          inputs:
            logLevel:
              description: 'Log level'
              required: true
              default: 'warning'
              type: choice
              options:
              - info
              - warning
              - debug
            print_tags:
              description: 'True to print to STDOUT'
              required: true
              type: boolean
            tags:
              description: 'Test scenario tags'
              required: true
              type: string
            environment:
              description: 'Environment to run tests against'
              # EDITED Put required before type
              required: true
              type: environment

      jobs:
        print-tag:
          # EDITED Put if before runs-on
          if:  \${{ inputs.print_tags }}
          runs-on: ubuntu-latest
          steps:
            - name: Print the input tag to STDOUT
              run: echo  The tags are \${{ inputs.tags }}`));

  it("https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#accessing-and-using-event-properties", () =>
    expectExample(`
      on:
        pull_request:
          types:
            - opened
          paths:
            - '.github/workflows/**'
            - '.github/CODEOWNERS'
            - 'package*.json'

      jobs:
        triage:
          if: >-
            github.event.pull_request.user.login != 'octobot' &&
            github.event.pull_request.user.login != 'dependabot[bot]'
          runs-on: ubuntu-latest
          steps:
            - name: "Comment about changes we can't accept"
              env:
                GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
                PR: \${{ github.event.pull_request.html_url }}
              run: |
                gh pr edit $PR --add-label 'invalid'
                gh pr comment $PR --body 'It looks like you edited \`package*.json\`, \`.github/CODEOWNERS\`, or \`.github/workflows/**\`. We do not allow contributions to these files. Please review our [contributing guidelines](https://github.com/octo-org/octo-repo/blob/main/CONTRIBUTING.md) for what contributions are accepted.'`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs", () =>
    expectExample(`
      on:
        workflow_call:
          inputs:
            username:
              description: 'A username passed from the caller workflow'
              default: 'john-doe'
              required: false
              type: string

      jobs:
        print-username:
          runs-on: ubuntu-latest

          steps:
            - name: Print the input name to STDOUT
              run: echo The username is \${{ inputs.username }}`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#defaultsrun", () =>
    expectExample(`
      defaults:
        run:
          shell: bash
          working-directory: scripts`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-concurrency-to-cancel-any-in-progress-job-or-run", () =>
    expectExample(`
      concurrency:
        group: \${{ github.ref }}
        cancel-in-progress: true`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions", () =>
    expectExample(`
      permissions:
        actions: read|write|none
        checks: read|write|none
        contents: read|write|none
        deployments: read|write|none
        id-token: read|write|none
        issues: read|write|none
        discussions: read|write|none
        packages: read|write|none
        pages: read|write|none
        pull-requests: read|write|none
        repository-projects: read|write|none
        security-events: read|write|none
        statuses: read|write|none`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-setting-permissions-for-a-specific-job", () =>
    expectExample(`
      jobs:
        stale:
          runs-on: ubuntu-latest

          permissions:
            issues: write
            pull-requests: write

          steps:
            - uses: actions/stale@v5`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-not-requiring-successful-dependent-jobs", () =>
    expectExample(`
      jobs:
        job1:
        job2:
          needs: job1
        job3:
          if: \${{ always() }}
          needs: [job1, job2]`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-only-run-job-for-specific-repository", () =>
    expectExample(`
      name: example-workflow
      on: [push]
      jobs:
        production-deploy:
          if: github.repository == 'octo-org/octo-repo-prod'
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                node-version: '14'
            - run: npm install -g bats`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-groups-to-control-where-jobs-are-run", () =>
    expectExample(`
      name: learn-github-actions
      on: [push]
      jobs:
        check-bats-version:
          runs-on:
            group: ubuntu-runners
          steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                node-version: '14'
            - run: npm install -g bats
            - run: bats -v`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-combining-groups-and-labels", () =>
    expectExample(`
      name: learn-github-actions
      on: [push]
      jobs:
        check-bats-version:
          runs-on:
            group: ubuntu-runners
            labels: ubuntu-20.04-16core
          steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                node-version: '14'
            - run: npm install -g bats
            - run: bats -v`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs", () =>
    expectExample(`
      jobs:
        job1:
          runs-on: ubuntu-latest
          # Map a step output to a job output
          outputs:
            output1: \${{ steps.step1.outputs.test }}
            output2: \${{ steps.step2.outputs.test }}
          steps:
            - id: step1
              run: echo "test=hello" >> "$GITHUB_OUTPUT"
            - id: step2
              run: echo "test=world" >> "$GITHUB_OUTPUT"
        job2:
          # EDITED needs before runs-on
          needs: job1
          runs-on: ubuntu-latest
          steps:
            - env:
                OUTPUT1: \${{needs.job1.outputs.output1}}
                OUTPUT2: \${{needs.job1.outputs.output2}}
              run: echo "$OUTPUT1 $OUTPUT2"`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-setting-default-run-step-options-for-a-job", () =>
    expectExample(`
    jobs:
      job1:
        runs-on: ubuntu-latest
        defaults:
          run:
            shell: bash
            working-directory: scripts`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-of-jobsjob_idsteps", () =>
    expectExample(`
      name: Greeting from Mona

      on: push

      jobs:
        my-job:
          name: My Job
          runs-on: ubuntu-latest
          steps:
            - name: Print a greeting
              env:
                # EDITED Sorted
                FIRST_NAME: Mona
                LAST_NAME: Octocat
                MIDDLE_NAME: The
                MY_VAR: Hi there! My name is
              run: |
                echo $MY_VAR $FIRST_NAME $MIDDLE_NAME $LAST_NAME.`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-contexts", () =>
    expectExample(`
      jobs:
        my-jobname:
          steps:
            - name: My first step
              if: \${{ github.event_name == 'pull_request' && github.event.action == 'unassigned' }}
              run: echo This event is a pull request that had an assignee removed.`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-status-check-functions", () =>
    expectExample(`
      jobs:
        my-jobname:
          steps:
            - name: My first step
              uses: octo-org/action-name@main
            - name: My backup step
              if: \${{ failure() }}
              uses: actions/heroku@1.0.0`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-secrets", () =>
    expectExample(`
      name: Run a step if a secret has been set
      on: push
      jobs:
        my-jobname:
          runs-on: ubuntu-latest
          env:
            super_secret: \${{ secrets.SuperSecret }}
          steps:
            - if: \${{ env.super_secret != '' }}
              run: echo 'This step will only run if the secret has a value set.'
            - if: \${{ env.super_secret == '' }}
              run: echo 'This step will only run if the secret does not have a value set.'`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-of-jobsjob_idstepswithargs", () =>
    expectExample(`
      jobs:
        my-jobname:
          steps:
            - name: Explain why this job ran
              uses: octo-org/action-name@main
              with:
                entrypoint: /bin/echo
                args: The \${{ github.event_name }} event triggered this step.`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-a-multi-dimension-matrix", () =>
    expectExample(`
      jobs:
        example_matrix:
          strategy:
            matrix:
              os: [ubuntu-22.04, ubuntu-20.04]
              version: [10, 12, 14]
          runs-on: \${{ matrix.os }}
          steps:
            - uses: actions/setup-node@v3
              with:
                node-version: \${{ matrix.version }}`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-contexts-to-create-matrices", () =>
    expectExample(`
      jobs:
        example_matrix:
          strategy:
            matrix:
              os: [ubuntu-22.04, ubuntu-20.04]
              version: [10, 12, 14]
          runs-on: \${{ matrix.os }}
          steps:
            - uses: actions/setup-node@v3
              with:
                node-version: \${{ matrix.version }}`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrixinclude", () =>
    expectExample(`
      jobs:
        example_matrix:
          strategy:
            matrix:
              fruit: [apple, pear]
              animal: [cat, dog]
              include:
                - color: green
                - color: pink
                  animal: cat
                - fruit: apple
                  shape: circle
                - fruit: banana
                - fruit: banana
                  animal: cat`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrixexclude", () =>
    expectExample(`
      jobs:
        example_matrix:
          strategy:
            matrix:
              os: [macos-latest, windows-latest]
              version: [12, 14, 16]
              environment: [staging, production]
              exclude:
                - os: macos-latest
                  version: 12
                  environment: production
                - os: windows-latest
                  version: 16
          runs-on: \${{ matrix.os }}`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast", () =>
    expectExample(`
      jobs:
        test:
          runs-on: ubuntu-latest
          # EDITED strategy before continue-on-error
          strategy:
            fail-fast: true
            matrix:
              version: [6, 7, 8]
              experimental: [false]
              include:
                - version: 9
                  experimental: true
          continue-on-error: \${{ matrix.experimental }}`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymax-parallel", () =>
    expectExample(`
      jobs:
        example_matrix:
          strategy:
            max-parallel: 2
            matrix:
              version: [10, 12, 14]
              os: [ubuntu-latest, windows-latest]`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-running-a-job-within-a-container", () =>
    expectExample(`
      name: CI
      on:
        push:
          branches: [ main ]
      jobs:
        container-test-job:
          runs-on: ubuntu-latest
          container:
            image: node:14.16
            env:
              NODE_ENV: development
            ports:
              - 80
            volumes:
              - my_docker_volume:/volume_mount
            options: --cpus 1
          steps:
            - name: Check for dockerenv file
              run: (ls /.dockerenv && echo Found dockerenv) || (echo No dockerenv)`));

  it("https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-of-jobsjob_idservicesservice_idcredentials", () =>
    expectExample(`
      jobs:
        test:
          services:
            myservice1:
              image: ghcr.io/owner/myservice1
              credentials:
                username: \${{ github.actor }}
                password: \${{ secrets.github_token }}
            myservice2:
              image: dockerhub_org/myservice2
              credentials:
                username: \${{ secrets.DOCKER_USER }}
                password: \${{ secrets.DOCKER_PASSWORD }}`));

  it("https://github.com/actions/cache#restoring-and-saving-cache-using-a-single-action", () =>
    expectExample(`
      name: Caching Primes

      on: push
      
      jobs:
        build:
          runs-on: ubuntu-latest
      
          steps:
          - uses: actions/checkout@v3
      
          - name: Cache Primes
            id: cache-primes
            uses: actions/cache@v3
            with:
              path: prime-numbers
              key: \${{ runner.os }}-primes
      
          - name: Generate Prime Numbers
            if: steps.cache-primes.outputs.cache-hit != 'true'
            run: /generate-primes.sh -d prime-numbers
      
          - name: Use Prime Numbers
            run: /primes.sh -d prime-numbers`));

  it("https://github.com/actions/cache#using-a-combination-of-restore-and-save-actions", () =>
    expectExample(`
      name: Caching Primes

      on: push
      
      jobs:
        build:
          runs-on: ubuntu-latest
      
          steps:
          - uses: actions/checkout@v3
      
          - name: Restore cached Primes
            id: cache-primes-restore
            uses: actions/cache/restore@v3
            with:
              path: |
                path/to/dependencies
                some/other/dependencies
              key: \${{ runner.os }}-primes
          - name: Save Primes
            id: cache-primes-save
            uses: actions/cache/save@v3
            with:
              path: |
                path/to/dependencies
                some/other/dependencies
              key: \${{ steps.cache-primes-restore.outputs.cache-primary-key }}`));

  it("https://github.com/actions/cache/blob/main/caching-strategies.md#using-restore-keys-to-download-the-closest-matching-cache", () =>
    expectExample(`
      jobs:
        a-job:
          steps:
          - uses: actions/cache@v3
            with:
              path: |
                path/to/dependencies
                some/other/dependencies
              key: cache-npm-\${{ hashFiles('**/lockfiles') }}
              restore-keys: |
                cache-npm-`));

  it("https://github.com/actions/checkout#usage", () =>
    expectExample(`
      jobs:
        a-job:
          steps:
          - uses: actions/checkout@v3
            with:
              # Repository name with owner. For example, actions/checkout
              # Default: \${{ github.repository }}
              repository: ''

              # The branch, tag or SHA to checkout. When checking out the repository that
              # triggered a workflow, this defaults to the reference or SHA for that event.
              # Otherwise, uses the default branch.
              ref: ''

              # Personal access token (PAT) used to fetch the repository. The PAT is configured
              # with the local git config, which enables your scripts to run authenticated git
              # commands. The post-job step removes the PAT.
              #
              # We recommend using a service account with the least permissions necessary. Also
              # when generating a new PAT, select the least scopes necessary.
              #
              # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
              #
              # Default: \${{ github.token }}
              token: ''

              # SSH key used to fetch the repository. The SSH key is configured with the local
              # git config, which enables your scripts to run authenticated git commands. The
              # post-job step removes the SSH key.
              #
              # We recommend using a service account with the least permissions necessary.
              #
              # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
              ssh-key: ''

              # Known hosts in addition to the user and global host key database. The public SSH
              # keys for a host may be obtained using the utility \`ssh-keyscan\`. For example,
              # \`ssh-keyscan github.com\`. The public key for github.com is always implicitly
              # added.
              ssh-known-hosts: ''

              # Whether to perform strict host key checking. When true, adds the options
              # \`StrictHostKeyChecking=yes\` and \`CheckHostIP=no\` to the SSH command line. Use
              # the input \`ssh-known-hosts\` to configure additional hosts.
              # Default: true
              ssh-strict: ''

              # Whether to configure the token or SSH key with the local git config
              # Default: true
              persist-credentials: ''

              # Relative path under $GITHUB_WORKSPACE to place the repository
              path: ''

              # Whether to execute \`git clean -ffdx && git reset --hard HEAD\` before fetching
              # Default: true
              clean: ''

              # Number of commits to fetch. 0 indicates all history for all branches and tags.
              # Default: 1
              fetch-depth: ''

              # Whether to download Git-LFS files
              # Default: false
              lfs: ''

              # Whether to checkout submodules: \`true\` to checkout submodules or \`recursive\` to
              # recursively checkout submodules.
              #
              # When the \`ssh-key\` input is not provided, SSH URLs beginning with
              # \`git@github.com:\` are converted to HTTPS.
              #
              # Default: false
              submodules: ''

              # Add repository path as safe.directory for Git global config by running \`git
              # config --global --add safe.directory <path>\`
              # Default: true
              set-safe-directory: ''

              # The base URL for the GitHub instance that you are trying to clone from, will use
              # environment defaults to fetch from the same instance that the workflow is
              # running from unless specified. Example URLs are https://github.com or
              # https://my-ghes-server.example.com
              github-server-url: ''`));

  it("https://github.com/actions/setup-node#caching-global-packages-data", () =>
    expectExample(`
      jobs:
        a-job:
          steps:
          - uses: actions/setup-node@v3
            with:
              node-version: 16
              cache: 'npm'
              cache-dependency-path: subdir/package-lock.json`));

  it("https://github.com/actions/setup-node#using-setup-node-on-ghes", () =>
    expectExample(`
      jobs:
        a-job:
          steps:
          - uses: actions/setup-node@v3
            with:
              token: \${{ secrets.GH_DOTCOM_TOKEN }}
              node-version: 16`));

  it("https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#check-latest-version", () =>
    expectExample(`
      jobs:
        a-job:
          steps:
          - uses: actions/setup-node@v3
            with:
              node-version: '16'
              check-latest: true`));

  it("https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#architecture", () =>
    expectExample(`
      jobs:
        build:
          # EDITED name before runs-on
          name: Node sample
          runs-on: windows-latest
          steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                node-version: '14'
                architecture: 'x64' # optional, x64 or x86. If not specified, x64 will be used by default
            - run: npm ci
            - run: npm test`));

  it("https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#use-private-packages", () =>
    expectExample(`
      jobs:
        build:
          steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
            with:
              node-version: '14.x'
              registry-url: 'https://registry.npmjs.org'
          # Skip post-install scripts here, as a malicious
          # script could steal NODE_AUTH_TOKEN.
          - # EDITED env before run
            env:
              NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
            run: npm ci --ignore-scripts
          # \`npm rebuild\` will run all those post-install scripts for us.
          - run: npm rebuild && npm run prepare --if-present`));

  it("https://github.com/peter-evans/create-pull-request#reference-example", () =>
    expectExample(`
      jobs:
        createPullRequest:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v3
      
            - name: Make changes to pull request
              run: date +%s > report.txt
      
            - name: Create Pull Request
              id: cpr
              uses: peter-evans/create-pull-request@v4
              with:
                token: \${{ secrets.PAT }}
                commit-message: Update report
                committer: GitHub <noreply@github.com>
                author: \${{ github.actor }} <\${{ github.actor }}@users.noreply.github.com>
                signoff: false
                branch: example-patches
                delete-branch: true
                title: '[Example] Update report'
                body: |
                  Update report
                  - Updated with *today's* date
                  - Auto-generated by [create-pull-request][1]
      
                  [1]: https://github.com/peter-evans/create-pull-request
                labels: |
                  report
                  automated pr
                assignees: peter-evans
                reviewers: peter-evans
                team-reviewers: |
                  owners
                  maintainers
                milestone: 1
                draft: false`));

  it("https://github.com/peter-evans/create-pull-request/blob/main/docs/concepts-guidelines.md#push-pull-request-branches-to-a-fork", () =>
    expectExample(`
      jobs:
        createPullRequest:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v3

            # Make changes to pull request here
      
            - uses: peter-evans/create-pull-request@v4
              with:
                token: \${{ secrets.MACHINE_USER_PAT }}
                push-to-fork: machine-user/fork-of-repository`));

  it("topologically sort jobs", () =>
    expectExample(
      `
        jobs:
          a:
            needs: [c, b]
          b:
            needs: c
          c:`,
      `
        jobs:
          c:
          b:
            needs: c
          a:
            needs: [c, b]`
    ));
});
