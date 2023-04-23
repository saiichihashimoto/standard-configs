import { isEqual, negate, overEvery, startsWith, toLower } from "lodash/fp";
import { z } from "zod";

import {
  type Config,
  elementsZod,
  indexOf,
  nestConfig,
  sortAndUniqBy,
} from "@configs/config";
import { jsonPlugin } from "@configs/plugin-json";

const vscodeArgVConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "disable-hardware-acceleration",
          "enable-crash-reporter",
          "crash-reporter-id",
          "locale",
        ]),
      ],
    },
  ],
};

const vscodeExtensionsConfig: Config = {
  operations: [
    {
      path: /^recommendations$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
  ],
};

const inputsConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "id",
          "type",
          "command",
          "description",
          "options",
          "args",
          "default",
        ]),
      ],
    },
  ],
};

const vscodeKeybindingsConfig: Config = {
  operations: [
    {
      path: /^\[\d+]$/,
      sortKeys: [indexOf(["key", "command", "args", "when"])],
    },
  ],
};

const vscodeLaunchRootConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [indexOf(["version", "configurations", "inputs", "compounds"])],
    },
    {
      path: /^compounds\[\d+]$/,
      sortKeys: [
        indexOf(["name", "configurations", "preLaunchTask", "stopAll"]),
      ],
    },
    {
      path: /^configurations\[\d+]$/,
      sortKeys: [
        indexOf((unmatched) => [
          "type",
          "request",
          "name",
          "presentation",
          "postDebugTask",
          "internalConsoleOptions",
          "debugServer",
          "skipFiles",
          "program",
          "serverReadyAction",
          "cwd",
          "console",
          "runtimeExecutable",
          "args",
          "env",
          "envFile",
          "port",
          "stopOnEntry",
          "sourceMaps",
          "preLaunchTask",
          "outFiles",
          "symbolSearchPath",
          "externalConsole",
          "logging",
          "visualizerFile",
          "showDisplayString",
          "MIMode",
          "miDebuggerPath",
          "miDebuggerArgs",
          "stopAtEntry",
          "stopAtConnect",
          "setupCommands",
          "customLaunchSetupCommands",
          "launchCompleteCommand",
          "symbolLoadInfo",
          "dumpPath",
          "coreDumpPath",
          "miDebuggerServerAddress",
          "debugServerPath",
          "debugServerArgs",
          "serverStarted",
          "filterStdout",
          "filterStderr",
          "serverLaunchTimeout",
          "pipeTransport",
          "hardwareBreakpoints",
          "processId",
          "targetArchitecture",
          "sourceFileMap",
          "symbolOptions",
          "url",
          "webRoot",
          unmatched,
          "linux",
          "osx",
          "windows",
        ]),
      ],
    },
    {
      path: /^configurations\[\d+]\.customLaunchSetupCommands\[\d+]$/,
      sortKeys: [indexOf(["text", "description", "ignoreFailures"])],
    },
    {
      path: /^configurations\[\d+]\.serverReadyAction$/,
      sortKeys: [indexOf(["pattern", "uriFormat", "action"])],
    },
    {
      path: /^configurations\[\d+]\.symbolOptions$/,
      sortKeys: [
        indexOf([
          "searchPaths",
          "searchMicrosoftSymbolServer",
          "cachePath",
          "moduleFilter",
        ]),
      ],
    },
    {
      path: /^configurations\[\d+]\.symbolOptions\.moduleFilter$/,
      sortKeys: [
        indexOf([
          "mode",
          "excludedModules",
          "includedModules",
          "includeSymbolsNextToModules",
        ]),
      ],
    },
    ...nestConfig(/^inputs\[\d+]$/, inputsConfig),
  ],
};

const vscodeLaunchConfig: Config = {
  operations: [
    ...nestConfig(/^$/, vscodeLaunchRootConfig),
    ...nestConfig(
      /^configurations\[\d+]\.(linux|osx|windows)$/,
      vscodeLaunchRootConfig
    ),
  ],
};

// TODO Split JSON Schemas into their own plugin https://json-schema.org/learn/getting-started-step-by-step.html https://json-schema.org/specification.html
const jsonSchemaConfig: Config = {
  operations: [
    {
      path: /^((items|properties\.[^.]+)(\.(items|properties\.[^.]+))*)?$/,
      sortKeys: [
        indexOf([
          "type",
          "title",
          "description",
          "required",
          "defaultSnippets",
          "items",
          "properties",
        ]),
      ],
    },
    {
      path: /^((items|properties\.[^.]+)(\.(items|properties\.[^.]+))*)?\.defaultSnippets\[\d+]$/,
      sortKeys: [indexOf(["label", "description", "body"])],
    },
    {
      path: /^((items|properties\.[^.]+)(\.(items|properties\.[^.]+))*)?\.defaultSnippets\[\d+]\.body$/,
      sortKeys: [indexOf(["key", "command", "when"])],
    },
    {
      path: /^((items|properties\.[^.]+)(\.(items|properties\.[^.]+))*)?\.properties$/,
      sortKeys: [null],
    },
  ],
};

const vscodeSettingsRootConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        negate(startsWith("diffEditor.")),
        negate(startsWith("editor.")),
        negate(startsWith("scm.")),
        negate(startsWith("security.")),
        negate(startsWith("workbench.")),
        negate(startsWith("window.")),
        negate(startsWith("files.")),
        negate(startsWith("screencastMode.")),
        negate(startsWith("zenMode.")),
        negate(startsWith("explorer.")),
        negate(startsWith("search.")),
        negate(startsWith("http.")),
        negate(startsWith("keyboard.")),
        negate(startsWith("update.")),
        negate(startsWith("comments.")),
        negate(
          overEvery([
            startsWith("debug."),
            negate(startsWith("debug.javascript.")),
          ])
        ),
        negate(startsWith("launch")),
        negate(startsWith("html.")),
        negate(startsWith("json.")),
        negate(
          overEvery([
            startsWith("markdown."),
            negate(isEqual("markdown.math.enabled")),
          ])
        ),
        negate(startsWith("php.")),
        negate(startsWith("javascript.")),
        negate(startsWith("js/")),
        negate(startsWith("typescript.")),
        negate(startsWith("testing.")),
        negate(startsWith("css.")),
        negate(startsWith("less.")),
        negate(startsWith("scss.")),
        negate(startsWith("extensions.")),
        negate(startsWith("output.")),
        negate(startsWith("settingsSync.")),
        negate(isEqual("interactiveWindow.collapseCellInputCode")),
        negate(startsWith("notebook.")),
        negate(startsWith("interactiveWindow.")),
        negate(startsWith("application.")),
        negate(startsWith("terminal.")),
        negate(startsWith("task.")),
        negate(startsWith("problems.")),
        negate(startsWith("breadcrumbs.")),
        negate(startsWith("telemetry.")),
        negate(startsWith("outline.")),
        negate(startsWith("timeline.")),
        negate(startsWith("audioCues.")),
        negate(startsWith("remote.tunnels.")),
        negate(startsWith("remote.")),
        negate(startsWith("mergeEditor.")),
        negate(startsWith("emmet.")),
        negate(startsWith("git.")),
        negate(startsWith("github.")),
        negate(startsWith("github-enterprise.")),
        negate(startsWith("grunt.")),
        negate(startsWith("gulp.")),
        negate(startsWith("ipynb.")),
        negate(startsWith("jake.")),
        negate(isEqual("markdown.math.enabled")),
        negate(startsWith("merge-conflict.")),
        negate(startsWith("debug.javascript.")),
        negate(startsWith("npm.")),
        negate(startsWith("references.")),
        negate(startsWith("simpleBrowser.")),
        negate(startsWith("nodeReadme.")),
        negate(startsWith("eslint.")),
        negate(startsWith("prettier.")),
        negate(startsWith("githubIssues.")),
        negate(startsWith("githubPullRequests.")),
        negate(startsWith("liveshare.")),
        indexOf([
          "dotfiles.repository",
          "dotfiles.targetPath",
          "dotfiles.installCommand",
        ]),
        negate(startsWith("dotfiles.")),
        negate(startsWith("[")),
        toLower,
      ],
    },
    {
      path: /^editor\.quickSuggestions$/,
      sortKeys: [indexOf(["comments", "strings", "other"])],
    },
    {
      path: /^eslint\.codeAction\.disableRuleComment$/,
      sortKeys: [indexOf(["enable", "location", "commentStyle"])],
    },
    {
      path: /^eslint\.timeBudget\.(onFixes|onValidation)$/,
      sortKeys: [indexOf(["warn", "error"])],
    },
    {
      path: /^githubPullRequests\.useReviewMode$/,
      sortKeys: [indexOf(["merged", "closed"])],
    },
    {
      path: /^java\.project\.referencedLibraries$/,
      sortKeys: [indexOf(["include", "exclude", "source"])],
    },
    {
      path: /^terminal\.integrated\.profiles\.(linux|osx|windows)\.[^.]+$/,
      sortKeys: [indexOf(["path", "args", "source", "icon"])],
    },
    {
      path: /^workbench\.editor\.autoLockGroups$/,
      sortKeys: [
        indexOf([
          "default",
          "workbench.editorinputs.searchEditorInput",
          "jupyter-notebook",
          "imagePreview.previewEditor",
          "vscode.audioPreview",
          "vscode.videoPreview",
          "jsProfileVisualizer.cpuprofile.table",
          "jsProfileVisualizer.heapprofile.table",
          "terminalEditor",
          "workbench.input.interactive",
          "mainThreadWebview-markdown.preview",
        ]),
      ],
    },
    {
      path: /^workbench\.editor\.languageDetectionHints$/,
      sortKeys: [indexOf(["untitledEditors", "notebookEditors"])],
    },
    ...nestConfig(/^json.schemas\[\d+]\.schema$/, jsonSchemaConfig),
    ...nestConfig(/^launch$/, vscodeLaunchConfig),
  ],
};

const vscodeSettingsConfig: Config = {
  operations: [
    ...nestConfig(/^$/, vscodeSettingsRootConfig),
    ...nestConfig(/^(\[[a-z]+])+$/, vscodeSettingsRootConfig),
  ],
};

const vscodeTasksRootOrTaskConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "label",
          "type",
          "tsconfig",
          "script",
          "command",
          "args",
          "options",
          "isBackground",
          "problemMatcher",
          "dependsOrder",
          "dependsOn",
          "group",
          "presentation",
          "runOptions",
        ]),
      ],
    },
    {
      path: /^args\[\d+]$/,
      sortKeys: [indexOf(["value", "quoting"])],
    },
    {
      path: /^group$/,
      sortKeys: [indexOf(["kind", "isDefault"])],
    },
    {
      path: /^options\.shell$/,
      sortKeys: [indexOf(["executable", "args"])],
    },
    {
      path: /^presentation$/,
      sortKeys: [
        indexOf([
          "echo",
          "reveal",
          "focus",
          "panel",
          "showReuseMessage",
          "clear",
          "group",
        ]),
      ],
    },
    {
      path: /^problemMatcher(\[\d+])?$/,
      sortKeys: [
        indexOf([
          "base",
          "owner",
          "severity",
          "fileLocation",
          "pattern",
          "background",
        ]),
      ],
    },
    {
      path: /^problemMatcher(\[\d+])?\.pattern(\[\d+])?$/,
      sortKeys: [
        indexOf([
          "regexp",
          "kind",
          "file",
          "location",
          "line",
          "column",
          "endLine",
          "endColumn",
          "severity",
          "code",
          "message",
          "loop",
        ]),
      ],
    },
  ],
};

const vscodeTasksRootConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf((unmatched) => [
          "version",
          unmatched,
          "tasks",
          "inputs",
          "linux",
          "osx",
          "windows",
        ]),
      ],
    },
    ...nestConfig(/^$/, vscodeTasksRootOrTaskConfig),
    ...nestConfig(/^inputs\[\d+]$/, inputsConfig),
    ...nestConfig(/^tasks\[\d+]$/, vscodeTasksRootOrTaskConfig),
  ],
};

const vscodeTasksConfig: Config = {
  operations: [
    ...nestConfig(/^$/, vscodeTasksRootConfig),
    ...nestConfig(/^linux|osx|windows$/, vscodeTasksRootConfig),
  ],
};

const vscodeCodeWorkspaceConfig: Config = {
  languages: [
    {
      name: "Code Workspace",
      parsers: ["json"],
      extensions: [".code-workspace"],
    },
  ],
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf(["folders", "settings", "launch", "tasks", "extensions"]),
      ],
    },
    ...nestConfig(/^extensions$/, vscodeExtensionsConfig),
    ...nestConfig(/^launch$/, vscodeLaunchConfig),
    ...nestConfig(/^settings$/, vscodeSettingsConfig),
    ...nestConfig(/^tasks$/, vscodeTasksRootConfig),
  ],
};

export const vscodeJSONConfigs = {
  ".vscode/argv.json": vscodeArgVConfig,
  ".vscode/extensions.json": vscodeExtensionsConfig,
  ".vscode/keybindings.json": vscodeKeybindingsConfig,
  ".vscode/launch.json": vscodeLaunchConfig,
  ".vscode/settings.json": vscodeSettingsConfig,
  ".vscode/tasks.json": vscodeTasksConfig,
  "*.code-workspace": vscodeCodeWorkspaceConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(vscodeJSONConfigs);
