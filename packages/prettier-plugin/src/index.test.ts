import { formatIgnore } from "@standard-configs/plugin-ignore/src/test-utils";
import { formatJSON } from "@standard-configs/plugin-json/src/test-utils";
import { formatYAML } from "@standard-configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

const babelTestCase = {
  source: { plugins: [], presets: [] },
  output: { presets: [], plugins: [] },
};

const ignoreTestCase = { source: ["b", "a", "b"], output: ["a", "b"] };

const eslintTestCase = {
  source: { noInlineConfig: false, root: false },
  output: { root: false, noInlineConfig: false },
};

const huskyTestCase = {
  source: {
    hooks: {
      "post-applypatch": "post-applypatch",
      "pre-applypatch": "pre-applypatch",
    },
  },
  output: {
    hooks: {
      "pre-applypatch": "pre-applypatch",
      "post-applypatch": "post-applypatch",
    },
  },
};

const gitHooksTestCase = {
  source: {
    "post-applypatch": "post-applypatch",
    "pre-applypatch": "pre-applypatch",
  },
  output: {
    "pre-applypatch": "pre-applypatch",
    "post-applypatch": "post-applypatch",
  },
};

const prettierTestCase = {
  source: { arrowParens: "", bracketSameLine: false },
  output: { bracketSameLine: false, arrowParens: "" },
};

const semanticReleaseTestCase = {
  source: { extends: "", repositoryUrl: "" },
  output: { repositoryUrl: "", extends: "" },
};

const tsconfigTestCase = {
  source: { compilerOptions: {}, extends: "" },
  output: { extends: "", compilerOptions: {} },
};

describe("prettier-plugin", () => {
  it.each([
    {
      filename: ".babelrc",
      format: formatJSON,
      testCase: babelTestCase,
    },
    {
      filename: ".babelrc.json",
      format: formatJSON,
      testCase: babelTestCase,
    },
    {
      filename: "babel.config.json",
      format: formatJSON,
      testCase: babelTestCase,
    },
    {
      filename: ".bowerrc",
      format: formatJSON,
      testCase: {
        source: { proxy: "", registry: "" },
        output: { registry: "", proxy: "" },
      },
    },
    {
      filename: ".eslintrc.json",
      format: formatJSON,
      testCase: eslintTestCase,
    },
    {
      filename: ".eslintrc.yaml",
      format: formatYAML,
      testCase: eslintTestCase,
    },
    { filename: ".eslintrc.yml", format: formatYAML, testCase: eslintTestCase },
    {
      filename: ".eslintignore",
      format: formatIgnore,
      testCase: ignoreTestCase,
    },
    { filename: ".eslintrc", format: formatJSON, testCase: eslintTestCase },
    {
      filename: "firebase.json",
      format: formatJSON,
      testCase: {
        source: { firestore: {}, hosting: {} },
        output: { hosting: {}, firestore: {} },
      },
    },
    {
      filename: "firestore.indexes.json",
      format: formatJSON,
      testCase: {
        source: { fieldOverrides: [], indexes: [] },
        output: { indexes: [], fieldOverrides: [] },
      },
    },
    { filename: ".gitignore", format: formatIgnore, testCase: ignoreTestCase },
    { filename: "git/exclude", format: formatIgnore, testCase: ignoreTestCase },
    { filename: "git/ignore", format: formatIgnore, testCase: ignoreTestCase },
    { filename: ".huskyrc.json", format: formatJSON, testCase: huskyTestCase },
    { filename: ".huskyrc.yaml", format: formatYAML, testCase: huskyTestCase },
    { filename: ".huskyrc.yml", format: formatYAML, testCase: huskyTestCase },
    { filename: ".huskyrc", format: formatJSON, testCase: huskyTestCase },
    {
      filename: ".simple-git-hooks.json",
      format: formatJSON,
      testCase: gitHooksTestCase,
    },
    {
      filename: "simple-git-hooks.json",
      format: formatJSON,
      testCase: gitHooksTestCase,
    },
    {
      filename: ".github/workflows/arbitrary.yml",
      format: formatYAML,
      testCase: {
        source: { jobs: [], name: "" },
        output: { name: "", jobs: [] },
      },
    },
    {
      filename: ".github/ISSUE_TEMPLATE/arbitrary.yml",
      format: formatYAML,
      testCase: {
        source: { description: "", name: "" },
        output: { name: "", description: "" },
      },
    },
    {
      filename: ".github/ISSUE_TEMPLATE/config.yml",
      format: formatYAML,
      testCase: {
        source: { contact_links: [{ about: "", name: "" }] },
        output: { contact_links: [{ name: "", about: "" }] },
      },
    },
    {
      filename: ".npmignore",
      format: formatIgnore,
      testCase: ignoreTestCase,
    },
    {
      filename: "package.json",
      format: formatJSON,
      testCase: {
        source: { private: false, version: "" },
        output: { version: "", private: false },
      },
    },
    {
      filename: ".prettierrc.json",
      format: formatJSON,
      testCase: prettierTestCase,
    },
    {
      filename: ".prettierrc.json5",
      format: formatJSON,
      testCase: prettierTestCase,
    },
    {
      filename: ".prettierrc.yaml",
      format: formatYAML,
      testCase: prettierTestCase,
    },
    {
      filename: ".prettierrc.yml",
      format: formatYAML,
      testCase: prettierTestCase,
    },
    { filename: ".prettierrc", format: formatJSON, testCase: prettierTestCase },
    { filename: ".prettierrc", format: formatYAML, testCase: prettierTestCase },
    {
      filename: ".prettierignore",
      format: formatIgnore,
      testCase: ignoreTestCase,
    },
    {
      filename: ".github/auto_assign.yml",
      format: formatYAML,
      testCase: {
        source: { numberOfReviewers: 0, reviewers: [] },
        output: { reviewers: [], numberOfReviewers: 0 },
      },
    },
    {
      filename: ".github/settings.yml",
      format: formatYAML,
      testCase: {
        source: { labels: [], repository: {} },
        output: { repository: {}, labels: [] },
      },
    },
    {
      filename: "sanity.json",
      format: formatJSON,
      testCase: {
        source: { project: {}, root: false },
        output: { root: false, project: {} },
      },
    },
    {
      filename: ".releaserc.json",
      format: formatJSON,
      testCase: semanticReleaseTestCase,
    },
    {
      filename: ".releaserc.yaml",
      format: formatYAML,
      testCase: semanticReleaseTestCase,
    },
    {
      filename: ".releaserc.yml",
      format: formatYAML,
      testCase: semanticReleaseTestCase,
    },
    {
      filename: ".releaserc",
      format: formatJSON,
      testCase: semanticReleaseTestCase,
    },
    // TODO { filename: ".releaserc", format: formatYAML, testCase: semanticReleaseTestCase },
    {
      filename: "jsconfig.json",
      format: formatJSON,
      testCase: tsconfigTestCase,
    },
    {
      filename: "tsconfig.json",
      format: formatJSON,
      testCase: tsconfigTestCase,
    },
    {
      filename: "tsup.config.json",
      format: formatJSON,
      testCase: {
        source: { entryPoints: [], name: "" },
        output: { name: "", entryPoints: [] },
      },
    },
    {
      filename: ".vscode/argv.json",
      format: formatJSON,
      testCase: {
        source: { "crash-reporter-id": "", "enable-crash-reporter": false },
        output: { "enable-crash-reporter": false, "crash-reporter-id": "" },
      },
    },
    {
      filename: ".vscode/extensions.json",
      format: formatJSON,
      testCase: {
        source: { recommendations: ["b", "a", "b"] },
        output: { recommendations: ["a", "b"] },
      },
    },
    {
      filename: ".vscode/keybindings.json",
      format: formatJSON,
      testCase: {
        source: [{ command: "", key: "" }],
        output: [{ key: "", command: "" }],
      },
    },
    {
      filename: ".vscode/launch.json",
      format: formatJSON,
      testCase: {
        source: { configurations: [], version: "" },
        output: { version: "", configurations: [] },
      },
    },
    {
      filename: ".vscode/settings.json",
      format: formatJSON,
      testCase: {
        source: { "files.associations": {}, "window.zoomLevel": 0 },
        output: { "window.zoomLevel": 0, "files.associations": {} },
      },
    },
    {
      filename: ".vscode/tasks.json",
      format: formatJSON,
      testCase: {
        source: { tasks: [], version: "" },
        output: { version: "", tasks: [] },
      },
    },
    {
      filename: "arbitrary.code-workspace",
      format: formatJSON,
      testCase: {
        source: { extensions: {}, folders: [] },
        output: { folders: [], extensions: {} },
      },
    },
  ])("%p", ({ filename, format, testCase: { source, output } }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    expect(pluginFormat(source)).toStrictEqual(defaultFormat(output));
  });
});
