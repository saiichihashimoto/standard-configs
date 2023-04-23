/* eslint-disable no-template-curly-in-string -- This is the correct syntax in a few vscode files */
import { formatJSON } from "@configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: ".vscode/argv.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("default settings", () =>
      expectExample(
        // This configuration file allows you to pass permanent command line arguments to VS Code.
        // Only a subset of arguments is currently supported to reduce the likelihood of breaking
        // the installation.
        //
        // PLEASE DO NOT CHANGE WITHOUT UNDERSTANDING THE IMPACT
        //
        // NOTE: Changing this file requires a restart of VS Code.
        {
          // Use software rendering instead of hardware accelerated rendering.
          // This can help in cases where you see rendering issues in VS Code.
          "disable-hardware-acceleration": true,

          // Allows to disable crash reporting.
          // Should restart the app if the value is changed.
          "enable-crash-reporter": true,

          // Unique id used for correlating crash reports sent from this instance.
          // Do not edit this value.
          "crash-reporter-id": "",
          "locale": "en",
        }
      ));
  }
);

describe.each([{ filename: ".vscode/extensions.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    it("sorts and uniqs recommendations", () =>
      expect(pluginFormat({ recommendations: ["b", "a", "b"] })).toStrictEqual(
        defaultFormat({ recommendations: ["a", "b"] })
      ));
  }
);

describe.each([{ filename: ".vscode/keybindings.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-rules", () =>
      expectExample([
        // Keybindings that are active when the focus is in the editor
        { key: "home", command: "cursorHome", when: "editorTextFocus" },
        {
          key: "shift+home",
          command: "cursorHomeSelect",
          when: "editorTextFocus",
        },

        // Keybindings that are complementary
        {
          key: "f5",
          command: "workbench.action.debug.continue",
          when: "inDebugMode",
        },
        {
          key: "f5",
          command: "workbench.action.debug.start",
          when: "!inDebugMode",
        },

        // Global keybindings
        { key: "ctrl+f", command: "actions.find" },
        { key: "alt+left", command: "workbench.action.navigateBack" },
        { key: "alt+right", command: "workbench.action.navigateForward" },

        // Global keybindings using chords (two separate keypress actions)
        { key: "ctrl+k enter", command: "workbench.action.keepEditor" },
        { key: "ctrl+k ctrl+w", command: "workbench.action.closeAllEditors" },
      ]));

    it("https://code.visualstudio.com/docs/getstarted/keybindings#_command-arguments", () =>
      expectExample([
        {
          key: "enter",
          command: "type",
          args: { text: "Hello World" },
          when: "editorTextFocus",
        },
      ]));

    it("https://code.visualstudio.com/docs/getstarted/keybindings#_removing-a-specific-key-binding-rule", () =>
      expectExample([
        // In Default Keyboard Shortcuts
        { key: "tab", command: "tab", when: "..." },
        { key: "tab", command: "jumpToNextSnippetPlaceholder", when: "..." },
        { key: "tab", command: "acceptSelectedSuggestion", when: "..." },

        // To remove the second rule, for example, add in keybindings.json:
        { key: "tab", command: "-jumpToNextSnippetPlaceholder" },
      ]));

    it("https://code.visualstudio.com/docs/editor/intellisense#_key-bindings", () =>
      expectExample([
        {
          key: "ctrl+space",
          command: "editor.action.triggerSuggest",
          when: "editorHasCompletionItemProvider && editorTextFocus && !editorReadonly",
        },
        {
          key: "ctrl+space",
          command: "toggleSuggestionDetails",
          when: "editorTextFocus && suggestWidgetVisible",
        },
        {
          key: "ctrl+alt+space",
          command: "toggleSuggestionFocus",
          when: "editorTextFocus && suggestWidgetVisible",
        },
      ]));
  }
);

describe.each([{ filename: ".vscode/launch.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://code.visualstudio.com/Docs/editor/debugging#_launch-configurations", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Launch Program",
            skipFiles: ["<node_internals>/**"],
            program: "${workspaceFolder}\\app.js",
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/editor/debugging#_variable-substitution", () =>
      expectExample({
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Launch Program",
            program: "${workspaceFolder}/app.js",
            cwd: "${workspaceFolder}",
            args: ["${env:USERNAME}"],
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/editor/debugging#_platformspecific-properties windows", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Launch Program",
            program: "${workspaceFolder}/node_modules/gulp/bin/gulpfile.js",
            args: ["myFolder/path/app.js"],
            windows: {
              args: ["myFolder\\path\\app.js"],
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/editor/debugging#_platformspecific-properties os x", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Launch Program",
            program: "${workspaceFolder}/node_modules/gulp/bin/gulpfile.js",
            stopOnEntry: true,
            osx: {
              stopOnEntry: false,
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/editor/debugging#_redirect-inputoutput-tofrom-the-debug-target", () =>
      expectExample({
        configurations: [
          {
            type: "node",
            request: "launch",
            // EDITED Put type & request before name
            name: "launch program that reads a file from stdin",
            program: "program.js",
            console: "integratedTerminal",
            args: ["<", "in.txt"],
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/editor/debugging#_compound-launch-configurations", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Server",
            program: "${workspaceFolder}/server.js",
          },
          {
            type: "node",
            request: "launch",
            name: "Client",
            program: "${workspaceFolder}/client.js",
          },
        ],
        compounds: [
          {
            name: "Server/Client",
            configurations: ["Server", "Client"],
            preLaunchTask: "${defaultBuildTask}",
            stopAll: true,
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/editor/debugging#_automatically-open-a-uri-when-debugging-a-server-program", () =>
      expectExample({
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Launch Program",
            program: "${workspaceFolder}/app.js",

            serverReadyAction: {
              pattern: "listening on port ([0-9]+)",
              uriFormat: "http://localhost:%s",
              action: "openExternally",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/nodejs/browser-debugging#_launching-browsers", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "msedge",
            request: "launch",
            name: "Launch my cool app",
            url: "http://localhost:8000",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/nodejs/browser-debugging#_launching-browsers single file", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "msedge",
            request: "launch",
            name: "Launch hello.html",
            file: "${workspaceFolder}/hello.html",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/nodejs/browser-debugging#_attaching-to-browsers", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "msedge",
            request: "attach",
            name: "Attach to browser",
            port: 9222,
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/nodejs/angular-tutorial#_configure-the-debugger", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "msedge",
            request: "launch",
            name: "Launch Edge against localhost",
            url: "http://localhost:4200",
            webRoot: "${workspaceFolder}",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/cpp/launch-json-reference#_showdisplaystring", () =>
      expectExample({
        configurations: [
          {
            type: "cppvsdbg",
            request: "launch",
            // EDITED Put type & request before name
            name: "C++ Launch (Windows)",
            program: "C:\\app1\\Debug\\app1.exe",
            symbolSearchPath: "C:\\Symbols;C:\\SymbolDir2",
            externalConsole: true,
            logging: {
              moduleLoad: false,
              trace: true,
            },
            visualizerFile: "${workspaceFolder}/my.natvis",
            showDisplayString: true,
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/cpp/launch-json-reference#_environment", () =>
      expectExample({
        configurations: [
          {
            type: "cppdbg",
            request: "launch",
            // EDITED Put type & request before name
            name: "C++ Launch",
            program: "${workspaceFolder}/a.out",
            // EDITED Put cwd before args
            cwd: "${workspaceFolder}",
            args: ["arg1", "arg2"],
            environment: [{ name: "config", value: "Debug" }],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/cpp/launch-json-reference#_launchcompletecommand", () =>
      expectExample({
        configurations: [
          {
            type: "cppdbg",
            request: "launch",
            // EDITED Put type & request before name
            name: "C++ Launch",
            program: "${workspaceFolder}/a.out",
            stopAtEntry: false,
            customLaunchSetupCommands: [
              {
                text: "target-run",
                description: "run target",
                ignoreFailures: false,
              },
            ],
            launchCompleteCommand: "exec-run",
            linux: {
              MIMode: "gdb",
              miDebuggerPath: "/usr/bin/gdb",
            },
            osx: {
              MIMode: "lldb",
            },
            windows: {
              MIMode: "gdb",
              miDebuggerPath: "C:\\MinGw\\bin\\gdb.exe",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/cpp/launch-json-reference#_symbol-options", () =>
      expectExample({
        configurations: [
          {
            symbolOptions: {
              searchPaths: [
                "C:\\src\\MyOtherProject\\bin\\debug",
                "https://my-companies-symbols-server",
              ],
              searchMicrosoftSymbolServer: true,
              cachePath: "%TEMP%\\symcache",
              moduleFilter: {
                mode: "loadAllButExcluded",
                excludedModules: ["DoNotLookForThisOne*.dll"],
              },
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/typescript/typescript-debugging#_javascript-source-map-support", () =>
      expectExample({
        // Use IntelliSense to learn about possible attributes.
        // Hover to view descriptions of existing attributes.
        // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
        version: "0.2.0",
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Launch Program",
            program: "${workspaceFolder}/helloworld.ts",
            preLaunchTask: "tsc: build - tsconfig.json",
            outFiles: ["${workspaceFolder}/out/**/*.js"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/typescript/typescript-debugging#_clientside-debugging", () =>
      expectExample({
        version: "0.2.0",
        configurations: [
          {
            type: "msedge",
            request: "launch",
            name: "Launch Edge against localhost",
            url: "file:///C:/Users/username/HelloWeb/helloweb.html",
            webRoot: "${workspaceFolder}",
          },
        ],
      }));

    it.todo("https://code.visualstudio.com/docs/java/java-debugging");

    it.todo("https://code.visualstudio.com/docs/nodejs/nodejs-debugging");

    it.todo("https://code.visualstudio.com/docs/python/debugging");

    it("https://code.visualstudio.com/docs/editor/tasks#_can-a-background-task-be-used-as-a-prelaunchtask-in-launchjson", () =>
      expectExample({
        configurations: [
          {
            type: "extensionHost",
            request: "launch",
            // EDITED put name below request
            name: "Launch Extension",
            runtimeExecutable: "${execPath}",
            args: ["--extensionDevelopmentPath=${workspaceRoot}"],
            stopOnEntry: false,
            sourceMaps: true,
            // EDITED put preLaunchTask before outFiles
            preLaunchTask: "npm: watch",
            outFiles: ["${workspaceRoot}/out/src/**/*.js"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/variables-reference#_input-variables mochaSupport", () =>
      expectExample({
        configurations: [
          {
            type: "node",
            request: "launch",
            name: "Run specific test",
            program: "${workspaceFolder}/${input:pickTest}",
          },
        ],
        inputs: [
          {
            id: "pickTest",
            type: "command",
            command: "extension.mochaSupport.testPicker",
            args: {
              testFolder: "/out/tests",
            },
          },
        ],
      }));
  }
);

describe.each([{ filename: ".vscode/settings.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://code.visualstudio.com/docs/getstarted/settings#_default-settings", () =>
      expectExample({
        // Controls whether the editor shows CodeLens.
        "diffEditor.codeLens": false,

        //
        //  - smart: Uses the default diffing algorithm.
        //  - experimental: Uses an experimental diffing algorithm.
        "diffEditor.diffAlgorithm": "smart",

        // When enabled, the diff editor ignores changes in leading or trailing whitespace.
        "diffEditor.ignoreTrimWhitespace": true,

        // Timeout in milliseconds after which diff computation is cancelled. Use 0 for no timeout.
        "diffEditor.maxComputationTime": 5000,

        // Maximum file size in MB for which to compute diffs. Use 0 for no limit.
        "diffEditor.maxFileSize": 50,

        // Controls whether the diff editor shows +/- indicators for added/removed changes.
        "diffEditor.renderIndicators": true,

        // When enabled, the diff editor shows arrows in its glyph margin to revert changes.
        "diffEditor.renderMarginRevertIcon": true,

        // Controls whether the diff editor shows the diff side by side or inline.
        "diffEditor.renderSideBySide": true,

        //
        //  - off: Lines will never wrap.
        //  - on: Lines will wrap at the viewport width.
        //  - inherit: Lines will wrap according to the `editor.wordWrap` setting.
        "diffEditor.wordWrap": "inherit",

        // Controls whether suggestions should be accepted on commit characters. For example, in JavaScript, the semi-colon (`;`) can be a commit character that accepts a suggestion and types that character.
        "editor.acceptSuggestionOnCommitCharacter": true,

        // Controls whether suggestions should be accepted on `Enter`, in addition to `Tab`. Helps to avoid ambiguity between inserting new lines or accepting suggestions.
        //  - on
        //  - smart: Only accept a suggestion with `Enter` when it makes a textual change.
        //  - off
        "editor.acceptSuggestionOnEnter": "on",

        // Controls the number of lines in the editor that can be read out by a screen reader at once. When we detect a screen reader we automatically set the default to be 500. Warning: this has a performance implication for numbers larger than the default.
        "editor.accessibilityPageSize": 10,

        // Controls if the UI should run in a mode where it is optimized for screen readers.
        //  - auto: Use platform APIs to detect when a Screen Reader is attached
        //  - on: Optimize for usage with a Screen Reader
        //  - off: Assume a screen reader is not attached
        "editor.accessibilitySupport": "auto",

        // Controls whether the editor should automatically close brackets after the user adds an opening bracket.
        //  - always
        //  - languageDefined: Use language configurations to determine when to autoclose brackets.
        //  - beforeWhitespace: Autoclose brackets only when the cursor is to the left of whitespace.
        //  - never
        "editor.autoClosingBrackets": "languageDefined",

        // Controls whether the editor should remove adjacent closing quotes or brackets when deleting.
        //  - always
        //  - auto: Remove adjacent closing quotes or brackets only if they were automatically inserted.
        //  - never
        "editor.autoClosingDelete": "auto",

        // Controls whether the editor should type over closing quotes or brackets.
        //  - always
        //  - auto: Type over closing quotes or brackets only if they were automatically inserted.
        //  - never
        "editor.autoClosingOvertype": "auto",

        // Controls whether the editor should automatically close quotes after the user adds an opening quote.
        //  - always
        //  - languageDefined: Use language configurations to determine when to autoclose quotes.
        //  - beforeWhitespace: Autoclose quotes only when the cursor is to the left of whitespace.
        //  - never
        "editor.autoClosingQuotes": "languageDefined",

        // Controls whether the editor should automatically adjust the indentation when users type, paste, move or indent lines.
        //  - none: The editor will not insert indentation automatically.
        //  - keep: The editor will keep the current line's indentation.
        //  - brackets: The editor will keep the current line's indentation and honor language defined brackets.
        //  - advanced: The editor will keep the current line's indentation, honor language defined brackets and invoke special onEnterRules defined by languages.
        //  - full: The editor will keep the current line's indentation, honor language defined brackets, invoke special onEnterRules defined by languages, and honor indentationRules defined by languages.
        "editor.autoIndent": "full",

        // Controls whether the editor should automatically surround selections when typing quotes or brackets.
        //  - languageDefined: Use language configurations to determine when to automatically surround selections.
        //  - quotes: Surround with quotes but not brackets.
        //  - brackets: Surround with brackets but not quotes.
        //  - never
        "editor.autoSurround": "languageDefined",

        // Controls whether bracket pair colorization is enabled or not. Use `workbench.colorCustomizations` to override the bracket highlight colors.
        "editor.bracketPairColorization.enabled": true,

        // Controls whether each bracket type has its own independent color pool.
        "editor.bracketPairColorization.independentColorPoolPerBracketType":
          false,

        // Code Action kinds to be run on save.
        "editor.codeActionsOnSave": {},

        // Enable/disable showing group headers in the Code Action menu.
        "editor.codeActionWidget.showHeaders": true,

        // Controls whether the editor shows CodeLens.
        "editor.codeLens": true,

        // Controls the font family for CodeLens.
        "editor.codeLensFontFamily": "",

        // Controls the font size in pixels for CodeLens. When set to 0, 90% of `editor.fontSize` is used.
        "editor.codeLensFontSize": 0,

        // Controls whether the editor should render the inline color decorators and color picker.
        "editor.colorDecorators": true,

        // Controls the max number of color decorators that can be rendered in an editor at once.
        "editor.colorDecoratorsLimit": 500,

        // Enable that the selection with the mouse and keys is doing column selection.
        "editor.columnSelection": false,

        // Controls if empty lines should be ignored with toggle, add or remove actions for line comments.
        "editor.comments.ignoreEmptyLines": true,

        // Controls whether a space character is inserted when commenting.
        "editor.comments.insertSpace": true,

        // Controls whether syntax highlighting should be copied into the clipboard.
        "editor.copyWithSyntaxHighlighting": true,

        // Control the cursor animation style.
        "editor.cursorBlinking": "blink",

        // Controls whether the smooth caret animation should be enabled.
        //  - off: Smooth caret animation is disabled.
        //  - explicit: Smooth caret animation is enabled only when the user moves the cursor with an explicit gesture.
        //  - on: Smooth caret animation is always enabled.
        "editor.cursorSmoothCaretAnimation": "off",

        // Controls the cursor style.
        "editor.cursorStyle": "line",

        // Controls the minimal number of visible leading lines (minimum 0) and trailing lines (minimum 1) surrounding the cursor. Known as 'scrollOff' or 'scrollOffset' in some other editors.
        "editor.cursorSurroundingLines": 0,

        // Controls when `cursorSurroundingLines` should be enforced.
        //  - default: `cursorSurroundingLines` is enforced only when triggered via the keyboard or API.
        //  - all: `cursorSurroundingLines` is enforced always.
        "editor.cursorSurroundingLinesStyle": "default",

        // Controls the width of the cursor when `editor.cursorStyle` is set to `line`.
        "editor.cursorWidth": 0,

        // Defines a default folding range provider that takes precedence over all other folding range providers. Must be the identifier of an extension contributing a folding range provider.
        //  - null: All active folding range providers
        //  - vscode.css-language-features: Provides rich language support for CSS, LESS and SCSS files.
        //  - vscode.html-language-features: Provides rich language support for HTML and Handlebar files
        //  - vscode.json-language-features: Provides rich language support for JSON files.
        //  - vscode.markdown-language-features: Provides rich language support for Markdown.
        //  - vscode.php-language-features: Provides rich language support for PHP files.
        //  - vscode.references-view: Reference Search results as separate, stable view in the sidebar
        //  - vscode.search-result: Provides syntax highlighting and language features for tabbed search results.
        //  - vscode.typescript-language-features: Provides rich language support for JavaScript and TypeScript.
        //  - dbaeumer.vscode-eslint: Integrates ESLint JavaScript into VS Code.
        //  - vscode.configuration-editing: Provides capabilities (advanced IntelliSense, auto-fixing) in configuration files like settings, launch, and extension recommendation files.
        //  - vscode.debug-auto-launch: Helper for auto-attach feature when node-debug extensions are not active.
        //  - vscode.debug-server-ready: Open URI in browser if server under debugging is ready.
        //  - vscode.emmet: Emmet support for VS Code
        //  - vscode.extension-editing: Provides linting capabilities for authoring extensions.
        //  - vscode.git: Git SCM Integration
        //  - vscode.git-base: Git static contributions and pickers.
        //  - vscode.github: GitHub features for VS Code
        //  - vscode.github-authentication: GitHub Authentication Provider
        //  - vscode.grunt: Extension to add Grunt capabilities to VS Code.
        //  - vscode.gulp: Extension to add Gulp capabilities to VSCode.
        //  - vscode.ipynb: Provides basic support for opening and reading Jupyter's .ipynb notebook files
        //  - vscode.jake: Extension to add Jake capabilities to VS Code.
        //  - ms-vscode.js-debug: An extension for debugging Node.js programs and Chrome.
        //  - ms-vscode.js-debug-companion: Companion extension to js-debug that provides capability for remote debugging
        //  - vscode.markdown-math: Adds math support to Markdown in notebooks.
        //  - vscode.media-preview: Provides VS Code's built-in previews for images, audio, and video
        //  - vscode.merge-conflict: Highlighting and commands for inline merge conflicts.
        //  - vscode.microsoft-authentication: Microsoft authentication provider
        //  - vscode.npm: Extension to add task support for npm scripts.
        //  - esbenp.prettier-vscode: Code formatter using prettier
        //  - vscode.simple-browser: A very basic built-in webview for displaying web content.
        //  - sharat.vscode-brewfile: Syntax Highlighting for Brewfile
        //  - ms-vscode.vscode-js-profile-table: Text visualizer for profiles taken from the JavaScript debugger
        //  - bengreenier.vscode-node-readme: A vscode extension to view javascript module documentation in editor.
        //  - GitHub.vscode-pull-request-github: Pull Request and Issue Provider for GitHub
        //  - ms-vsliveshare.vsliveshare: Real-time collaborative development from the comfort of your favorite tools.
        "editor.defaultFoldingRangeProvider": null,

        // Defines a default formatter which takes precedence over all other formatter settings. Must be the identifier of an extension contributing a formatter.
        //  - null: None
        //  - vscode.css-language-features: Provides rich language support for CSS, LESS and SCSS files.
        //  - vscode.html-language-features: Provides rich language support for HTML and Handlebar files
        //  - vscode.json-language-features: Provides rich language support for JSON files.
        //  - vscode.markdown-language-features: Provides rich language support for Markdown.
        //  - vscode.php-language-features: Provides rich language support for PHP files.
        //  - esbenp.prettier-vscode: Code formatter using prettier
        //  - vscode.references-view: Reference Search results as separate, stable view in the sidebar
        //  - vscode.search-result: Provides syntax highlighting and language features for tabbed search results.
        //  - vscode.typescript-language-features: Provides rich language support for JavaScript and TypeScript.
        //  - dbaeumer.vscode-eslint: Integrates ESLint JavaScript into VS Code.
        //  - vscode.configuration-editing: Provides capabilities (advanced IntelliSense, auto-fixing) in configuration files like settings, launch, and extension recommendation files.
        //  - vscode.debug-auto-launch: Helper for auto-attach feature when node-debug extensions are not active.
        //  - vscode.debug-server-ready: Open URI in browser if server under debugging is ready.
        //  - vscode.emmet: Emmet support for VS Code
        //  - vscode.extension-editing: Provides linting capabilities for authoring extensions.
        //  - vscode.git: Git SCM Integration
        //  - vscode.git-base: Git static contributions and pickers.
        //  - vscode.github: GitHub features for VS Code
        //  - vscode.github-authentication: GitHub Authentication Provider
        //  - vscode.grunt: Extension to add Grunt capabilities to VS Code.
        //  - vscode.gulp: Extension to add Gulp capabilities to VSCode.
        //  - vscode.ipynb: Provides basic support for opening and reading Jupyter's .ipynb notebook files
        //  - vscode.jake: Extension to add Jake capabilities to VS Code.
        //  - ms-vscode.js-debug: An extension for debugging Node.js programs and Chrome.
        //  - ms-vscode.js-debug-companion: Companion extension to js-debug that provides capability for remote debugging
        //  - vscode.markdown-math: Adds math support to Markdown in notebooks.
        //  - vscode.media-preview: Provides VS Code's built-in previews for images, audio, and video
        //  - vscode.merge-conflict: Highlighting and commands for inline merge conflicts.
        //  - vscode.microsoft-authentication: Microsoft authentication provider
        //  - vscode.npm: Extension to add task support for npm scripts.
        //  - vscode.simple-browser: A very basic built-in webview for displaying web content.
        //  - sharat.vscode-brewfile: Syntax Highlighting for Brewfile
        //  - ms-vscode.vscode-js-profile-table: Text visualizer for profiles taken from the JavaScript debugger
        //  - bengreenier.vscode-node-readme: A vscode extension to view javascript module documentation in editor.
        //  - GitHub.vscode-pull-request-github: Pull Request and Issue Provider for GitHub
        //  - ms-vsliveshare.vsliveshare: Real-time collaborative development from the comfort of your favorite tools.
        "editor.defaultFormatter": null,

        // Controls whether the Go to Definition mouse gesture always opens the peek widget.
        "editor.definitionLinkOpensInPeek": false,

        // Controls whether `editor.tabSize#` and `#editor.insertSpaces` will be automatically detected when a file is opened based on the file contents.
        "editor.detectIndentation": true,

        // Controls whether the editor should allow moving selections via drag and drop.
        "editor.dragAndDrop": true,

        // Controls whether you can drag and drop a file into a text editor by holding down `shift` (instead of opening the file in an editor).
        "editor.dropIntoEditor.enabled": true,

        // Controls whether copying without a selection copies the current line.
        "editor.emptySelectionClipboard": true,

        // Enable/disable running edits from extensions on paste.
        "editor.experimental.pasteActions.enabled": false,

        // Controls whether whitespace is rendered with a new, experimental method.
        //  - svg: Use a new rendering method with svgs.
        //  - font: Use a new rendering method with font characters.
        //  - off: Use the stable rendering method.
        "editor.experimentalWhitespaceRendering": "svg",

        // Scrolling speed multiplier when pressing `Alt`.
        "editor.fastScrollSensitivity": 5,

        // Controls whether the Find Widget should add extra lines on top of the editor. When true, you can scroll beyond the first line when the Find Widget is visible.
        "editor.find.addExtraSpaceOnTop": true,

        // Controls the condition for turning on Find in Selection automatically.
        //  - never: Never turn on Find in Selection automatically (default).
        //  - always: Always turn on Find in Selection automatically.
        //  - multiline: Turn on Find in Selection automatically when multiple lines of content are selected.
        "editor.find.autoFindInSelection": "never",

        // Controls whether the cursor should jump to find matches while typing.
        "editor.find.cursorMoveOnType": true,

        // Controls whether the Find Widget should read or modify the shared find clipboard on macOS.
        "editor.find.globalFindClipboard": false,

        // Controls whether the search automatically restarts from the beginning (or the end) when no further matches can be found.
        "editor.find.loop": true,

        // Controls whether the search string in the Find Widget is seeded from the editor selection.
        //  - never: Never seed search string from the editor selection.
        //  - always: Always seed search string from the editor selection, including word at cursor position.
        //  - selection: Only seed search string from the editor selection.
        "editor.find.seedSearchStringFromSelection": "always",

        // Controls whether the editor has code folding enabled.
        "editor.folding": true,

        // Controls whether the editor should highlight folded ranges.
        "editor.foldingHighlight": true,

        // Controls whether the editor automatically collapses import ranges.
        "editor.foldingImportsByDefault": false,

        // The maximum number of foldable regions. Increasing this value may result in the editor becoming less responsive when the current source has a large number of foldable regions.
        "editor.foldingMaximumRegions": 5000,

        // Controls the strategy for computing folding ranges.
        //  - auto: Use a language-specific folding strategy if available, else the indentation-based one.
        //  - indentation: Use the indentation-based folding strategy.
        "editor.foldingStrategy": "auto",

        // Controls the font family.
        "editor.fontFamily": "Menlo, Monaco, 'Courier New', monospace",

        // Configures font ligatures or font features. Can be either a boolean to enable/disable ligatures or a string for the value of the CSS 'font-feature-settings' property.
        "editor.fontLigatures": false,

        // Controls the font size in pixels.
        "editor.fontSize": 12,

        // Configures font variations. Can be either a boolean to enable/disable the translation from font-weight to font-variation-settings or a string for the value of the CSS 'font-variation-settings' property.
        "editor.fontVariations": false,

        // Controls the font weight. Accepts "normal" and "bold" keywords or numbers between 1 and 1000.
        "editor.fontWeight": "normal",

        // Controls whether the editor should automatically format the pasted content. A formatter must be available and the formatter should be able to format a range in a document.
        "editor.formatOnPaste": false,

        // Format a file on save. A formatter must be available, the file must not be saved after delay, and the editor must not be shutting down.
        "editor.formatOnSave": false,

        // Controls if format on save formats the whole file or only modifications. Only applies when `editor.formatOnSave` is enabled.
        //  - file: Format the whole file.
        //  - modifications: Format modifications (requires source control).
        //  - modificationsIfAvailable: Will attempt to format modifications only (requires source control). If source control can't be used, then the whole file will be formatted.
        "editor.formatOnSaveMode": "file",

        // Controls whether the editor should automatically format the line after typing.
        "editor.formatOnType": false,

        // Controls whether the editor should render the vertical glyph margin. Glyph margin is mostly used for debugging.
        "editor.glyphMargin": true,

        // Alternative command id that is being executed when the result of 'Go to Declaration' is the current location.
        "editor.gotoLocation.alternativeDeclarationCommand":
          "editor.action.goToReferences",

        // Alternative command id that is being executed when the result of 'Go to Definition' is the current location.
        "editor.gotoLocation.alternativeDefinitionCommand":
          "editor.action.goToReferences",

        // Alternative command id that is being executed when the result of 'Go to Implementation' is the current location.
        "editor.gotoLocation.alternativeImplementationCommand": "",

        // Alternative command id that is being executed when the result of 'Go to Reference' is the current location.
        "editor.gotoLocation.alternativeReferenceCommand": "",

        // Alternative command id that is being executed when the result of 'Go to Type Definition' is the current location.
        "editor.gotoLocation.alternativeTypeDefinitionCommand":
          "editor.action.goToReferences",

        // This setting is deprecated, please use separate settings like 'editor.editor.gotoLocation.multipleDefinitions' or 'editor.editor.gotoLocation.multipleImplementations' instead.
        //
        "editor.gotoLocation.multiple": null,

        // Controls the behavior the 'Go to Declaration'-command when multiple target locations exist.
        //  - peek: Show Peek view of the results (default)
        //  - gotoAndPeek: Go to the primary result and show a Peek view
        //  - goto: Go to the primary result and enable Peek-less navigation to others
        "editor.gotoLocation.multipleDeclarations": "peek",

        // Controls the behavior the 'Go to Definition'-command when multiple target locations exist.
        //  - peek: Show Peek view of the results (default)
        //  - gotoAndPeek: Go to the primary result and show a Peek view
        //  - goto: Go to the primary result and enable Peek-less navigation to others
        "editor.gotoLocation.multipleDefinitions": "peek",

        // Controls the behavior the 'Go to Implementations'-command when multiple target locations exist.
        //  - peek: Show Peek view of the results (default)
        //  - gotoAndPeek: Go to the primary result and show a Peek view
        //  - goto: Go to the primary result and enable Peek-less navigation to others
        "editor.gotoLocation.multipleImplementations": "peek",

        // Controls the behavior the 'Go to References'-command when multiple target locations exist.
        //  - peek: Show Peek view of the results (default)
        //  - gotoAndPeek: Go to the primary result and show a Peek view
        //  - goto: Go to the primary result and enable Peek-less navigation to others
        "editor.gotoLocation.multipleReferences": "peek",

        // Controls the behavior the 'Go to Type Definition'-command when multiple target locations exist.
        //  - peek: Show Peek view of the results (default)
        //  - gotoAndPeek: Go to the primary result and show a Peek view
        //  - goto: Go to the primary result and enable Peek-less navigation to others
        "editor.gotoLocation.multipleTypeDefinitions": "peek",

        // Controls whether bracket pair guides are enabled or not.
        //  - true: Enables bracket pair guides.
        //  - active: Enables bracket pair guides only for the active bracket pair.
        //  - false: Disables bracket pair guides.
        "editor.guides.bracketPairs": false,

        // Controls whether horizontal bracket pair guides are enabled or not.
        //  - true: Enables horizontal guides as addition to vertical bracket pair guides.
        //  - active: Enables horizontal guides only for the active bracket pair.
        //  - false: Disables horizontal bracket pair guides.
        "editor.guides.bracketPairsHorizontal": "active",

        // Controls whether the editor should highlight the active bracket pair.
        "editor.guides.highlightActiveBracketPair": true,

        // Controls whether the editor should highlight the active indent guide.
        //  - true: Highlights the active indent guide.
        //  - always: Highlights the active indent guide even if bracket guides are highlighted.
        //  - false: Do not highlight the active indent guide.
        "editor.guides.highlightActiveIndentation": true,

        // Controls whether the editor should render indent guides.
        "editor.guides.indentation": true,

        // Controls whether the cursor should be hidden in the overview ruler.
        "editor.hideCursorInOverviewRuler": false,

        // Prefer showing hovers above the line, if there's space.
        "editor.hover.above": true,

        // Controls the delay in milliseconds after which the hover is shown.
        "editor.hover.delay": 300,

        // Controls whether the hover is shown.
        "editor.hover.enabled": true,

        // Controls whether the hover should remain visible when mouse is moved over it.
        "editor.hover.sticky": true,

        // The number of spaces used for indentation or `"tabSize"` to use the value from `editor.tabSize#`. This setting is overridden based on the file contents when `#editor.detectIndentation` is on.
        "editor.indentSize": "tabSize",

        // Enables the inlay hints in the editor.
        //  - on: Inlay hints are enabled
        //  - onUnlessPressed: Inlay hints are showing by default and hide when holding Ctrl+Option
        //  - offUnlessPressed: Inlay hints are hidden by default and show when holding Ctrl+Option
        //  - off: Inlay hints are disabled
        "editor.inlayHints.enabled": "on",

        // Controls font family of inlay hints in the editor. When set to empty, the `editor.fontFamily` is used.
        "editor.inlayHints.fontFamily": "",

        // Controls font size of inlay hints in the editor. As default the `editor.fontSize` is used when the configured value is less than `5` or greater than the editor font size.
        "editor.inlayHints.fontSize": 0,

        // Enables the padding around the inlay hints in the editor.
        "editor.inlayHints.padding": false,

        // Controls whether to automatically show inline suggestions in the editor.
        "editor.inlineSuggest.enabled": true,

        // Controls when to show the inline suggestion toolbar.
        //  - always: Show the inline suggestion toolbar whenever an inline suggestion is shown.
        //  - onHover: Show the inline suggestion toolbar when hovering over an inline suggestion.
        "editor.inlineSuggest.showToolbar": "onHover",

        // Insert spaces when pressing `Tab`. This setting is overridden based on the file contents when `editor.detectIndentation` is on.
        "editor.insertSpaces": true,

        // Defines the bracket symbols that increase or decrease the indentation.
        "editor.language.brackets": null,

        // Defines the bracket pairs that are colorized by their nesting level if bracket pair colorization is enabled.
        "editor.language.colorizedBracketPairs": null,

        // Special handling for large files to disable certain memory intensive features.
        "editor.largeFileOptimizations": true,

        // Controls the letter spacing in pixels.
        "editor.letterSpacing": 0,

        // Enables the Code Action lightbulb in the editor.
        "editor.lightbulb.enabled": true,

        // Controls the line height.
        //  - Use 0 to automatically compute the line height from the font size.
        //  - Values between 0 and 8 will be used as a multiplier with the font size.
        //  - Values greater than or equal to 8 will be used as effective values.
        "editor.lineHeight": 0,

        // Controls the display of line numbers.
        //  - off: Line numbers are not rendered.
        //  - on: Line numbers are rendered as absolute number.
        //  - relative: Line numbers are rendered as distance in lines to cursor position.
        //  - interval: Line numbers are rendered every 10 lines.
        "editor.lineNumbers": "on",

        // Controls whether the editor has linked editing enabled. Depending on the language, related symbols such as HTML tags, are updated while editing.
        "editor.linkedEditing": false,

        // Controls whether the editor should detect links and make them clickable.
        "editor.links": true,

        // Highlight matching brackets.
        "editor.matchBrackets": "always",

        // Lines above this length will not be tokenized for performance reasons
        "editor.maxTokenizationLineLength": 20000,

        // Controls whether the minimap is hidden automatically.
        "editor.minimap.autohide": false,

        // Controls whether the minimap is shown.
        "editor.minimap.enabled": true,

        // Limit the width of the minimap to render at most a certain number of columns.
        "editor.minimap.maxColumn": 120,

        // Render the actual characters on a line as opposed to color blocks.
        "editor.minimap.renderCharacters": true,

        // Scale of content drawn in the minimap: 1, 2 or 3.
        "editor.minimap.scale": 1,

        // Controls when the minimap slider is shown.
        "editor.minimap.showSlider": "mouseover",

        // Controls the side where to render the minimap.
        "editor.minimap.side": "right",

        // Controls the size of the minimap.
        //  - proportional: The minimap has the same size as the editor contents (and might scroll).
        //  - fill: The minimap will stretch or shrink as necessary to fill the height of the editor (no scrolling).
        //  - fit: The minimap will shrink as necessary to never be larger than the editor (no scrolling).
        "editor.minimap.size": "proportional",

        // A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events.
        "editor.mouseWheelScrollSensitivity": 1,

        // Zoom the font of the editor when using mouse wheel and holding `Ctrl`.
        "editor.mouseWheelZoom": false,

        // Controls the max number of cursors that can be in an active editor at once.
        "editor.multiCursorLimit": 10000,

        // Merge multiple cursors when they are overlapping.
        "editor.multiCursorMergeOverlapping": true,

        // The modifier to be used to add multiple cursors with the mouse. The Go to Definition and Open Link mouse gestures will adapt such that they do not conflict with the [multicursor modifier](https://code.visualstudio.com/docs/editor/codebasics#_multicursor-modifier).
        //  - ctrlCmd: Maps to `Control` on Windows and Linux and to `Command` on macOS.
        //  - alt: Maps to `Alt` on Windows and Linux and to `Option` on macOS.
        "editor.multiCursorModifier": "alt",

        // Controls pasting when the line count of the pasted text matches the cursor count.
        //  - spread: Each cursor pastes a single line of the text.
        //  - full: Each cursor pastes the full text.
        "editor.multiCursorPaste": "spread",

        // Controls whether the editor should highlight semantic symbol occurrences.
        "editor.occurrencesHighlight": true,

        // Controls whether a border should be drawn around the overview ruler.
        "editor.overviewRulerBorder": true,

        // Controls the amount of space between the bottom edge of the editor and the last line.
        "editor.padding.bottom": 0,

        // Controls the amount of space between the top edge of the editor and the first line.
        "editor.padding.top": 0,

        // Controls whether the parameter hints menu cycles or closes when reaching the end of the list.
        "editor.parameterHints.cycle": true,

        // Enables a pop-up that shows parameter documentation and type information as you type.
        "editor.parameterHints.enabled": true,

        // Controls whether to focus the inline editor or the tree in the peek widget.
        //  - tree: Focus the tree when opening peek
        //  - editor: Focus the editor when opening peek
        "editor.peekWidgetDefaultFocus": "tree",

        // Controls whether suggestions should automatically show up while typing. This can be controlled for typing in comments, strings, and other code. Quick suggestion can be configured to show as ghost text or with the suggest widget. Also be aware of the '#editor.suggestOnTriggerCharacters#'-setting which controls if suggestions are triggered by special characters.
        "editor.quickSuggestions": {
          comments: "off",
          strings: "off",
          // EDITED other below comments and strings
          other: "on",
        },

        // Controls the delay in milliseconds after which quick suggestions will show up.
        "editor.quickSuggestionsDelay": 10,

        // Enable/disable the ability to preview changes before renaming
        "editor.rename.enablePreview": true,

        // Deprecated, use `editor.linkedEditing` instead.
        // Controls whether the editor auto renames on type.
        "editor.renameOnType": false,

        // Controls whether the editor should render control characters.
        "editor.renderControlCharacters": true,

        // Render last line number when the file ends with a newline.
        "editor.renderFinalNewline": "on",

        // Controls how the editor should render the current line highlight.
        //  - none
        //  - gutter
        //  - line
        //  - all: Highlights both the gutter and the current line.
        "editor.renderLineHighlight": "line",

        // Controls if the editor should render the current line highlight only when the editor is focused.
        "editor.renderLineHighlightOnlyWhenFocus": false,

        // Controls how the editor should render whitespace characters.
        //  - none
        //  - boundary: Render whitespace characters except for single spaces between words.
        //  - selection: Render whitespace characters only on selected text.
        //  - trailing: Render only trailing whitespace characters.
        //  - all
        "editor.renderWhitespace": "selection",

        // Controls whether selections should have rounded corners.
        "editor.roundedSelection": true,

        // Render vertical rulers after a certain number of monospace characters. Use multiple values for multiple rulers. No rulers are drawn if array is empty.
        "editor.rulers": [],

        // Controls the visibility of the horizontal scrollbar.
        //  - auto: The horizontal scrollbar will be visible only when necessary.
        //  - visible: The horizontal scrollbar will always be visible.
        //  - hidden: The horizontal scrollbar will always be hidden.
        "editor.scrollbar.horizontal": "auto",

        // The height of the horizontal scrollbar.
        "editor.scrollbar.horizontalScrollbarSize": 12,

        // Controls whether clicks scroll by page or jump to click position.
        "editor.scrollbar.scrollByPage": false,

        // Controls the visibility of the vertical scrollbar.
        //  - auto: The vertical scrollbar will be visible only when necessary.
        //  - visible: The vertical scrollbar will always be visible.
        //  - hidden: The vertical scrollbar will always be hidden.
        "editor.scrollbar.vertical": "auto",

        // The width of the vertical scrollbar.
        "editor.scrollbar.verticalScrollbarSize": 14,

        // Controls the number of extra characters beyond which the editor will scroll horizontally.
        "editor.scrollBeyondLastColumn": 4,

        // Controls whether the editor will scroll beyond the last line.
        "editor.scrollBeyondLastLine": true,

        // Scroll only along the predominant axis when scrolling both vertically and horizontally at the same time. Prevents horizontal drift when scrolling vertically on a trackpad.
        "editor.scrollPredominantAxis": true,

        // Controls whether the editor should highlight matches similar to the selection.
        "editor.selectionHighlight": true,

        // Controls whether the semanticHighlighting is shown for the languages that support it.
        //  - true: Semantic highlighting enabled for all color themes.
        //  - false: Semantic highlighting disabled for all color themes.
        //  - configuredByTheme: Semantic highlighting is configured by the current color theme's `semanticHighlighting` setting.
        "editor.semanticHighlighting.enabled": "configuredByTheme",

        // Overrides editor semantic token color and styles from the currently selected color theme.
        "editor.semanticTokenColorCustomizations": {},

        // Controls strikethrough deprecated variables.
        "editor.showDeprecated": true,

        // Controls when the folding controls on the gutter are shown.
        //  - always: Always show the folding controls.
        //  - never: Never show the folding controls and reduce the gutter size.
        //  - mouseover: Only show the folding controls when the mouse is over the gutter.
        "editor.showFoldingControls": "mouseover",

        // Controls fading out of unused code.
        "editor.showUnused": true,

        // Whether leading and trailing whitespace should always be selected.
        "editor.smartSelect.selectLeadingAndTrailingWhitespace": true,

        // Controls whether the editor will scroll using an animation.
        "editor.smoothScrolling": false,

        // Controls if surround-with-snippets or file template snippets show as Code Actions.
        "editor.snippets.codeActions.enabled": true,

        // Controls whether snippets are shown with other suggestions and how they are sorted.
        //  - top: Show snippet suggestions on top of other suggestions.
        //  - bottom: Show snippet suggestions below other suggestions.
        //  - inline: Show snippets suggestions with other suggestions.
        //  - none: Do not show snippet suggestions.
        "editor.snippetSuggestions": "inline",

        // Keep peek editors open even when double-clicking their content or when hitting `Escape`.
        "editor.stablePeek": false,

        // Shows the nested current scopes during the scroll at the top of the editor.
        "editor.stickyScroll.enabled": false,

        // Defines the maximum number of sticky lines to show.
        "editor.stickyScroll.maxLineCount": 5,

        // Emulate selection behavior of tab characters when using spaces for indentation. Selection will stick to tab stops.
        "editor.stickyTabStops": false,

        // This setting is deprecated, please use separate settings like 'editor.suggest.showKeywords' or 'editor.suggest.showSnippets' instead.
        //
        "editor.suggest.filteredTypes": {},

        // Controls whether filtering and sorting suggestions accounts for small typos.
        "editor.suggest.filterGraceful": true,

        // Controls whether words are overwritten when accepting completions. Note that this depends on extensions opting into this feature.
        //  - insert: Insert suggestion without overwriting text right of the cursor.
        //  - replace: Insert suggestion and overwrite text right of the cursor.
        "editor.suggest.insertMode": "insert",

        // Controls whether sorting favors words that appear close to the cursor.
        "editor.suggest.localityBonus": false,

        // When enabled IntelliSense filtering requires that the first character matches on a word start. For example, `c` on `Console` or `WebContext` but _not_ on `description`. When disabled IntelliSense will show more results but still sorts them by match quality.
        "editor.suggest.matchOnWordStartOnly": true,

        // This setting is deprecated. The suggest widget can now be resized.
        //
        "editor.suggest.maxVisibleSuggestions": 0,

        // Controls whether to preview the suggestion outcome in the editor.
        "editor.suggest.preview": false,

        // Controls whether a suggestion is selected when the widget shows. Note that this only applies to automatically triggered suggestions (`editor.quickSuggestions#` and `#editor.suggestOnTriggerCharacters`) and that a suggestion is always selected when explicitly invoked, e.g via `Ctrl+Space`.
        //  - always: Always select a suggestion when automatically triggering IntelliSense.
        //  - never: Never select a suggestion when automatically triggering IntelliSense.
        //  - whenTriggerCharacter: Select a suggestion only when triggering IntelliSense from a trigger character.
        //  - whenQuickSuggestion: Select a suggestion only when triggering IntelliSense as you type.
        "editor.suggest.selectionMode": "always",

        // Controls whether remembered suggestion selections are shared between multiple workspaces and windows (needs `editor.suggestSelection`).
        "editor.suggest.shareSuggestSelections": false,

        // When enabled IntelliSense shows `class`-suggestions.
        "editor.suggest.showClasses": true,

        // When enabled IntelliSense shows `color`-suggestions.
        "editor.suggest.showColors": true,

        // When enabled IntelliSense shows `constant`-suggestions.
        "editor.suggest.showConstants": true,

        // When enabled IntelliSense shows `constructor`-suggestions.
        "editor.suggest.showConstructors": true,

        // When enabled IntelliSense shows `customcolor`-suggestions.
        "editor.suggest.showCustomcolors": true,

        // When enabled IntelliSense shows `deprecated`-suggestions.
        "editor.suggest.showDeprecated": true,

        // When enabled IntelliSense shows `enumMember`-suggestions.
        "editor.suggest.showEnumMembers": true,

        // When enabled IntelliSense shows `enum`-suggestions.
        "editor.suggest.showEnums": true,

        // When enabled IntelliSense shows `event`-suggestions.
        "editor.suggest.showEvents": true,

        // When enabled IntelliSense shows `field`-suggestions.
        "editor.suggest.showFields": true,

        // When enabled IntelliSense shows `file`-suggestions.
        "editor.suggest.showFiles": true,

        // When enabled IntelliSense shows `folder`-suggestions.
        "editor.suggest.showFolders": true,

        // When enabled IntelliSense shows `function`-suggestions.
        "editor.suggest.showFunctions": true,

        // Controls whether to show or hide icons in suggestions.
        "editor.suggest.showIcons": true,

        // Controls whether suggest details show inline with the label or only in the details widget.
        "editor.suggest.showInlineDetails": true,

        // When enabled IntelliSense shows `interface`-suggestions.
        "editor.suggest.showInterfaces": true,

        // When enabled IntelliSense shows `issues`-suggestions.
        "editor.suggest.showIssues": true,

        // When enabled IntelliSense shows `keyword`-suggestions.
        "editor.suggest.showKeywords": true,

        // When enabled IntelliSense shows `method`-suggestions.
        "editor.suggest.showMethods": true,

        // When enabled IntelliSense shows `module`-suggestions.
        "editor.suggest.showModules": true,

        // When enabled IntelliSense shows `operator`-suggestions.
        "editor.suggest.showOperators": true,

        // When enabled IntelliSense shows `property`-suggestions.
        "editor.suggest.showProperties": true,

        // When enabled IntelliSense shows `reference`-suggestions.
        "editor.suggest.showReferences": true,

        // When enabled IntelliSense shows `snippet`-suggestions.
        "editor.suggest.showSnippets": true,

        // Controls the visibility of the status bar at the bottom of the suggest widget.
        "editor.suggest.showStatusBar": false,

        // When enabled IntelliSense shows `struct`-suggestions.
        "editor.suggest.showStructs": true,

        // When enabled IntelliSense shows `typeParameter`-suggestions.
        "editor.suggest.showTypeParameters": true,

        // When enabled IntelliSense shows `unit`-suggestions.
        "editor.suggest.showUnits": true,

        // When enabled IntelliSense shows `user`-suggestions.
        "editor.suggest.showUsers": true,

        // When enabled IntelliSense shows `value`-suggestions.
        "editor.suggest.showValues": true,

        // When enabled IntelliSense shows `variable`-suggestions.
        "editor.suggest.showVariables": true,

        // When enabled IntelliSense shows `text`-suggestions.
        "editor.suggest.showWords": true,

        // Controls whether an active snippet prevents quick suggestions.
        "editor.suggest.snippetsPreventQuickSuggestions": true,

        // Font size for the suggest widget. When set to `0`, the value of `editor.fontSize` is used.
        "editor.suggestFontSize": 0,

        // Line height for the suggest widget. When set to `0`, the value of `editor.lineHeight` is used. The minimum value is 8.
        "editor.suggestLineHeight": 0,

        // Controls whether suggestions should automatically show up when typing trigger characters.
        "editor.suggestOnTriggerCharacters": true,

        // Controls how suggestions are pre-selected when showing the suggest list.
        //  - first: Always select the first suggestion.
        //  - recentlyUsed: Select recent suggestions unless further typing selects one, e.g. `console.| -> console.log` because `log` has been completed recently.
        //  - recentlyUsedByPrefix: Select suggestions based on previous prefixes that have completed those suggestions, e.g. `co -> console` and `con -> const`.
        "editor.suggestSelection": "first",

        // Enables tab completions.
        //  - on: Tab complete will insert the best matching suggestion when pressing tab.
        //  - off: Disable tab completions.
        //  - onlySnippets: Tab complete snippets when their prefix match. Works best when 'quickSuggestions' aren't enabled.
        "editor.tabCompletion": "off",

        // The number of spaces a tab is equal to. This setting is overridden based on the file contents when `editor.detectIndentation` is on.
        "editor.tabSize": 4,

        // Overrides editor syntax colors and font style from the currently selected color theme.
        "editor.tokenColorCustomizations": {},

        // Remove trailing auto inserted whitespace.
        "editor.trimAutoWhitespace": true,

        // Controls whether clicking on the empty content after a folded line will unfold the line.
        "editor.unfoldOnClickAfterEndOfLine": false,

        // Defines allowed characters that are not being highlighted.
        "editor.unicodeHighlight.allowedCharacters": {},

        // Unicode characters that are common in allowed locales are not being highlighted.
        "editor.unicodeHighlight.allowedLocales": {
          _os: true,
          _vscode: true,
        },

        // Controls whether characters are highlighted that can be confused with basic ASCII characters, except those that are common in the current user locale.
        "editor.unicodeHighlight.ambiguousCharacters": true,

        // Controls whether characters in comments should also be subject to Unicode highlighting.
        "editor.unicodeHighlight.includeComments": "inUntrustedWorkspace",

        // Controls whether characters in strings should also be subject to Unicode highlighting.
        "editor.unicodeHighlight.includeStrings": true,

        // Controls whether characters that just reserve space or have no width at all are highlighted.
        "editor.unicodeHighlight.invisibleCharacters": true,

        // Controls whether all non-basic ASCII characters are highlighted. Only characters between U+0020 and U+007E, tab, line-feed and carriage-return are considered basic ASCII.
        "editor.unicodeHighlight.nonBasicASCII": "inUntrustedWorkspace",

        // Remove unusual line terminators that might cause problems.
        //  - auto: Unusual line terminators are automatically removed.
        //  - off: Unusual line terminators are ignored.
        //  - prompt: Unusual line terminators prompt to be removed.
        "editor.unusualLineTerminators": "prompt",

        // Inserting and deleting whitespace follows tab stops.
        "editor.useTabStops": true,

        // Controls whether completions should be computed based on words in the document.
        "editor.wordBasedSuggestions": true,

        // Controls from which documents word based completions are computed.
        //  - currentDocument: Only suggest words from the active document.
        //  - matchingDocuments: Suggest words from all open documents of the same language.
        //  - allDocuments: Suggest words from all open documents.
        "editor.wordBasedSuggestionsMode": "matchingDocuments",

        // Controls the word break rules used for Chinese/Japanese/Korean (CJK) text.
        //  - normal: Use the default line break rule.
        //  - keepAll: Word breaks should not be used for Chinese/Japanese/Korean (CJK) text. Non-CJK text behavior is the same as for normal.
        "editor.wordBreak": "normal",

        // Characters that will be used as word separators when doing word related navigations or operations.
        "editor.wordSeparators": "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?",

        // Controls how lines should wrap.
        //  - off: Lines will never wrap.
        //  - on: Lines will wrap at the viewport width.
        //  - wordWrapColumn: Lines will wrap at `editor.wordWrapColumn`.
        //  - bounded: Lines will wrap at the minimum of viewport and `editor.wordWrapColumn`.
        "editor.wordWrap": "off",

        // Controls the wrapping column of the editor when `editor.wordWrap` is `wordWrapColumn` or `bounded`.
        "editor.wordWrapColumn": 80,

        // Controls the indentation of wrapped lines.
        //  - none: No indentation. Wrapped lines begin at column 1.
        //  - same: Wrapped lines get the same indentation as the parent.
        //  - indent: Wrapped lines get +1 indentation toward the parent.
        //  - deepIndent: Wrapped lines get +2 indentation toward the parent.
        "editor.wrappingIndent": "same",

        // Controls the algorithm that computes wrapping points. Note that when in accessibility mode, advanced will be used for the best experience.
        //  - simple: Assumes that all characters are of the same width. This is a fast algorithm that works correctly for monospace fonts and certain scripts (like Latin characters) where glyphs are of equal width.
        //  - advanced: Delegates wrapping points computation to the browser. This is a slow algorithm, that might cause freezes for large files, but it works correctly in all cases.
        "editor.wrappingStrategy": "simple",

        // Controls whether inline actions are always visible in the Source Control view.
        "scm.alwaysShowActions": false,

        // Controls whether repositories should always be visible in the Source Control view.
        "scm.alwaysShowRepositories": false,

        // Controls whether the Source Control view should automatically reveal and select files when opening them.
        "scm.autoReveal": true,

        // Controls the count badge on the Source Control icon on the Activity Bar.
        //  - all: Show the sum of all Source Control Provider count badges.
        //  - focused: Show the count badge of the focused Source Control Provider.
        //  - off: Disable the Source Control count badge.
        "scm.countBadge": "all",

        // Controls the default Source Control repository view mode.
        //  - tree: Show the repository changes as a tree.
        //  - list: Show the repository changes as a list.
        "scm.defaultViewMode": "list",

        // Controls the default Source Control repository changes sort order when viewed as a list.
        //  - name: Sort the repository changes by file name.
        //  - path: Sort the repository changes by path.
        //  - status: Sort the repository changes by Source Control status.
        "scm.defaultViewSortKey": "path",

        // Controls diff decorations in the editor.
        //  - all: Show the diff decorations in all available locations.
        //  - gutter: Show the diff decorations only in the editor gutter.
        //  - overview: Show the diff decorations only in the overview ruler.
        //  - minimap: Show the diff decorations only in the minimap.
        //  - none: Do not show the diff decorations.
        "scm.diffDecorations": "all",

        // Controls the behavior of Source Control diff gutter decorations.
        //  - diff: Show the inline diff Peek view on click.
        //  - none: Do nothing.
        "scm.diffDecorationsGutterAction": "diff",

        // Controls whether a pattern is used for the diff decorations in gutter.
        "scm.diffDecorationsGutterPattern": {
          added: false,
          modified: true,
        },

        // Controls the visibility of the Source Control diff decorator in the gutter.
        //  - always: Show the diff decorator in the gutter at all times.
        //  - hover: Show the diff decorator in the gutter only on hover.
        "scm.diffDecorationsGutterVisibility": "always",

        // Controls the width(px) of diff decorations in gutter (added & modified).
        "scm.diffDecorationsGutterWidth": 3,

        // Controls whether leading and trailing whitespace is ignored in Source Control diff gutter decorations.
        //  - true: Ignore leading and trailing whitespace.
        //  - false: Do not ignore leading and trailing whitespace.
        //  - inherit: Inherit from `diffEditor.ignoreTrimWhitespace`.
        "scm.diffDecorationsIgnoreTrimWhitespace": "false",

        // Controls the font for the input message. Use `default` for the workbench user interface font family, `editor` for the `editor.fontFamily`'s value, or a custom font family.
        "scm.inputFontFamily": "default",

        // Controls the font size for the input message in pixels.
        "scm.inputFontSize": 13,

        // Controls the count badges on Source Control Provider headers. These headers only appear when there is more than one provider.
        //  - hidden: Hide Source Control Provider count badges.
        //  - auto: Only show count badge for Source Control Provider when non-zero.
        //  - visible: Show Source Control Provider count badges.
        "scm.providerCountBadge": "hidden",

        // Controls the sort order of the repositories in the source control repositories view.
        //  - discovery time: Repositories in the Source Control Repositories view are sorted by discovery time. Repositories in the Source Control view are sorted in the order that they were selected.
        //  - name: Repositories in the Source Control Repositories and Source Control views are sorted by repository name.
        //  - path: Repositories in the Source Control Repositories and Source Control views are sorted by repository path.
        "scm.repositories.sortOrder": "discovery time",

        // Controls how many repositories are visible in the Source Control Repositories section. Set to 0, to be able to manually resize the view.
        "scm.repositories.visible": 10,

        // Controls whether an action button can be shown in the Source Control view.
        "scm.showActionButton": true,

        // Controls when the restricted mode banner is shown.
        //  - always: Show the banner every time an untrusted workspace is open.
        //  - untilDismissed: Show the banner when an untrusted workspace is opened until dismissed.
        //  - never: Do not show the banner when an untrusted workspace is open.
        "security.workspace.trust.banner": "untilDismissed",

        // Controls whether or not the empty window is trusted by default within VS Code. When used with `security.workspace.trust.untrustedFiles`, you can enable the full functionality of VS Code without prompting in an empty window.
        "security.workspace.trust.emptyWindow": true,

        // Controls whether or not Workspace Trust is enabled within VS Code.
        "security.workspace.trust.enabled": true,

        // Controls when the startup prompt to trust a workspace is shown.
        //  - always: Ask for trust every time an untrusted workspace is opened.
        //  - once: Ask for trust the first time an untrusted workspace is opened.
        //  - never: Do not ask for trust when an untrusted workspace is opened.
        "security.workspace.trust.startupPrompt": "once",

        // Controls how to handle opening untrusted files in a trusted workspace. This setting also applies to opening files in an empty window which is trusted via `security.workspace.trust.emptyWindow`.
        //  - prompt: Ask how to handle untrusted files for each workspace. Once untrusted files are introduced to a trusted workspace, you will not be prompted again.
        //  - open: Always allow untrusted files to be introduced to a trusted workspace without prompting.
        //  - newWindow: Always open untrusted files in a separate window in restricted mode without prompting.
        "security.workspace.trust.untrustedFiles": "prompt",

        // Controls the behavior of clicking an activity bar icon in the workbench.
        //  - toggle: Hide the side bar if the clicked item is already visible.
        //  - focus: Focus side bar if the clicked item is already visible.
        "workbench.activityBar.iconClickBehavior": "toggle",

        // Controls the visibility of the activity bar in the workbench.
        "workbench.activityBar.visible": true,

        // Controls whether to automatically resume available working changes stored in the cloud for the current workspace.
        //  - onReload: Automatically resume available working changes from the cloud on window reload.
        //  - off: Never attempt to resume working changes from the cloud.
        "workbench.cloudChanges.autoResume": "onReload",

        // Controls whether to prompt the user to store working changes in the cloud when using Continue Working On.
        //  - prompt: Prompt the user to sign in to store working changes in the cloud with Continue Working On.
        //  - off: Do not store working changes in the cloud with Continue Working On unless the user has already turned on Cloud Changes.
        "workbench.cloudChanges.continueOn": "prompt",

        // Overrides colors from the currently selected color theme.
        "workbench.colorCustomizations": {},

        // Specifies the color theme used in the workbench.
        "workbench.colorTheme": "Default Dark+",

        // Controls whether the command palette should have a list of commonly used commands.
        "workbench.commandPalette.experimental.suggestCommands": false,

        // Controls the number of recently used commands to keep in history for the command palette. Set to 0 to disable command history.
        "workbench.commandPalette.history": 50,

        // Controls whether the last typed input to the command palette should be restored when opening it the next time.
        "workbench.commandPalette.preserveInput": false,

        // If an editor matching one of the listed types is opened as the first in an editor group and more than one group is open, the group is automatically locked. Locked groups will only be used for opening editors when explicitly chosen by a user gesture (for example drag and drop), but not by default. Consequently, the active editor in a locked group is less likely to be replaced accidentally with a different editor.
        "workbench.editor.autoLockGroups": {
          "default": false,
          "workbench.editorinputs.searchEditorInput": false,
          "jupyter-notebook": false,
          "imagePreview.previewEditor": false,
          "vscode.audioPreview": false,
          "vscode.videoPreview": false,
          "jsProfileVisualizer.cpuprofile.table": false,
          "jsProfileVisualizer.heapprofile.table": false,
          "terminalEditor": true,
          "workbench.input.interactive": false,
          "mainThreadWebview-markdown.preview": false,
        },

        // Controls if the centered layout should automatically resize to maximum width when more than one group is open. Once only one group is open it will resize back to the original centered width.
        "workbench.editor.centeredLayoutAutoResize": true,

        // Controls the behavior of empty editor groups when the last tab in the group is closed. When enabled, empty groups will automatically close. When disabled, empty groups will remain part of the grid.
        "workbench.editor.closeEmptyGroups": true,

        // Controls whether editors showing a file that was opened during the session should close automatically when getting deleted or renamed by some other process. Disabling this will keep the editor open  on such an event. Note that deleting from within the application will always close the editor and that editors with unsaved changes will never close to preserve your data.
        "workbench.editor.closeOnFileDelete": false,

        // Controls whether editor file decorations should use badges.
        "workbench.editor.decorations.badges": true,

        // Controls whether editor file decorations should use colors.
        "workbench.editor.decorations.colors": true,

        // The default editor for files detected as binary. If undefined, the user will be presented with a picker.
        "workbench.editor.defaultBinaryEditor": "",

        // Controls whether opened editors show as preview editors. Preview editors do not stay open, are reused until explicitly set to be kept open (via double-click or editing), and show file names in italics.
        "workbench.editor.enablePreview": true,

        // Controls whether editors remain in preview when a code navigation is started from them. Preview editors do not stay open, and are reused until explicitly set to be kept open (via double-click or editing). This value is ignored when `workbench.editor.enablePreview` is disabled.
        "workbench.editor.enablePreviewFromCodeNavigation": false,

        // Controls whether editors opened from Quick Open show as preview editors. Preview editors do not stay open, and are reused until explicitly set to be kept open (via double-click or editing). When enabled, hold Ctrl before selection to open an editor as a non-preview. This value is ignored when `workbench.editor.enablePreview` is disabled.
        "workbench.editor.enablePreviewFromQuickOpen": false,

        // Controls whether tabs are closed in most recently used order or from left to right.
        "workbench.editor.focusRecentEditorAfterClose": true,

        // Controls whether a top border is drawn on tabs for editors that have unsaved changes. This value is ignored when `workbench.editor.showTabs` is disabled.
        "workbench.editor.highlightModifiedTabs": false,

        // Enables use of editor history in language detection. This causes automatic language detection to favor languages that have been recently opened and allows for automatic language detection to operate with smaller inputs.
        "workbench.editor.historyBasedLanguageDetection": true,

        // Controls the format of the label for an editor.
        //  - default: Show the name of the file. When tabs are enabled and two files have the same name in one group the distinguishing sections of each file's path are added. When tabs are disabled, the path relative to the workspace folder is shown if the editor is active.
        //  - short: Show the name of the file followed by its directory name.
        //  - medium: Show the name of the file followed by its path relative to the workspace folder.
        //  - long: Show the name of the file followed by its absolute path.
        "workbench.editor.labelFormat": "default",

        // Controls whether the language in a text editor is automatically detected unless the language has been explicitly set by the language picker. This can also be scoped by language so you can specify which languages you do not want to be switched off of. This is useful for languages like Markdown that often contain other languages that might trick language detection into thinking it's the embedded language and not Markdown.
        "workbench.editor.languageDetection": true,

        // When enabled, shows a Status bar Quick Fix when the editor language doesn't match detected content language.
        "workbench.editor.languageDetectionHints": {
          untitledEditors: true,
          notebookEditors: true,
        },

        // Controls if the number of opened editors should be limited or not. When enabled, less recently used editors will close to make space for newly opening editors.
        "workbench.editor.limit.enabled": false,

        // Controls if the maximum number of opened editors should exclude dirty editors for counting towards the configured limit.
        "workbench.editor.limit.excludeDirty": false,

        // Controls if the limit of maximum opened editors should apply per editor group or across all editor groups.
        "workbench.editor.limit.perEditorGroup": false,

        // Controls the maximum number of opened editors. Use the `workbench.editor.limit.perEditorGroup` setting to control this limit per editor group or across all groups.
        "workbench.editor.limit.value": 10,

        // Enables the use of mouse buttons four and five for commands 'Go Back' and 'Go Forward'.
        "workbench.editor.mouseBackForwardToNavigate": true,

        // Controls the scope of history navigation in editors for commands such as 'Go Back' and 'Go Forward'.
        //  - default: Navigate across all opened editors and editor groups.
        //  - editorGroup: Navigate only in editors of the active editor group.
        //  - editor: Navigate only in the active editor.
        "workbench.editor.navigationScope": "default",

        // Controls where editors open. Select `left` or `right` to open editors to the left or right of the currently active one. Select `first` or `last` to open editors independently from the currently active one.
        "workbench.editor.openPositioning": "right",

        // Controls the default direction of editors that are opened side by side (for example, from the Explorer). By default, editors will open on the right hand side of the currently active one. If changed to `down`, the editors will open below the currently active one.
        "workbench.editor.openSideBySideDirection": "right",

        // Controls the sizing of pinned editor tabs. Pinned tabs are sorted to the beginning of all opened tabs and typically do not close until unpinned. This value is ignored when `workbench.editor.showTabs` is disabled.
        //  - normal: A pinned tab inherits the look of non pinned tabs.
        //  - compact: A pinned tab will show in a compact form with only icon or first letter of the editor name.
        //  - shrink: A pinned tab shrinks to a compact fixed size showing parts of the editor name.
        "workbench.editor.pinnedTabSizing": "normal",

        // When enabled, a language detection model that takes into account editor history will be given higher precedence.
        "workbench.editor.preferHistoryBasedLanguageDetection": true,

        // Restores the last editor view state (such as scroll position) when re-opening editors after they have been closed. Editor view state is stored per editor group and discarded when a group closes. Use the `workbench.editor.sharedViewState` setting to use the last known view state across all editor groups in case no previous view state was found for a editor group.
        "workbench.editor.restoreViewState": true,

        // Controls whether an editor is revealed in any of the visible groups if opened. If disabled, an editor will prefer to open in the currently active editor group. If enabled, an already opened editor will be revealed instead of opened again in the currently active editor group. Note that there are some cases where this setting is ignored, such as when forcing an editor to open in a specific group or to the side of the currently active group.
        "workbench.editor.revealIfOpen": false,

        // Controls whether scrolling over tabs will open them or not. By default tabs will only reveal upon scrolling, but not open. You can press and hold the Shift-key while scrolling to change this behavior for that duration. This value is ignored when `workbench.editor.showTabs` is disabled.
        "workbench.editor.scrollToSwitchTabs": false,

        // Preserves the most recent editor view state (such as scroll position) across all editor groups and restores that if no specific editor view state is found for the editor group.
        "workbench.editor.sharedViewState": false,

        // Controls whether opened editors should show with an icon or not. This requires a file icon theme to be enabled as well.
        "workbench.editor.showIcons": true,

        // Controls whether opened editors should show in tabs or not.
        "workbench.editor.showTabs": true,

        // Controls the layout for when an editor is split in an editor group to be either vertical or horizontal.
        //  - vertical: Editors are positioned from top to bottom.
        //  - horizontal: Editors are positioned from left to right.
        "workbench.editor.splitInGroupLayout": "horizontal",

        // Controls if editor groups can be split from drag and drop operations by dropping an editor or file on the edges of the editor area.
        "workbench.editor.splitOnDragAndDrop": true,

        // Controls the sizing of editor groups when splitting them.
        //  - distribute: Splits all the editor groups to equal parts.
        //  - split: Splits the active editor group to equal parts.
        "workbench.editor.splitSizing": "distribute",

        // Controls the position of the editor's tabs close buttons, or disables them when set to 'off'. This value is ignored when `workbench.editor.showTabs` is disabled.
        "workbench.editor.tabCloseButton": "right",

        // Controls the sizing of editor tabs. This value is ignored when `workbench.editor.showTabs` is disabled.
        //  - fit: Always keep tabs large enough to show the full editor label.
        //  - shrink: Allow tabs to get smaller when the available space is not enough to show all tabs at once.
        "workbench.editor.tabSizing": "fit",

        // Controls the height of the scrollbars used for tabs and breadcrumbs in the editor title area.
        //  - default: The default size.
        //  - large: Increases the size, so it can be grabbed more easily with the mouse.
        "workbench.editor.titleScrollbarSizing": "default",

        // Controls if the untitled text hint should be visible in the editor.
        "workbench.editor.untitled.hint": "text",

        // Controls the format of the label for an untitled editor.
        //  - content: The name of the untitled file is derived from the contents of its first line unless it has an associated file path. It will fallback to the name in case the line is empty or contains no word characters.
        //  - name: The name of the untitled file is not derived from the contents of the file.
        "workbench.editor.untitled.labelFormat": "content",

        // Controls whether tabs should be wrapped over multiple lines when exceeding available space or whether a scrollbar should appear instead. This value is ignored when `workbench.editor.showTabs` is disabled.
        "workbench.editor.wrapTabs": false,

        // Configure glob patterns to editors (for example `"*.hex": "hexEditor.hexedit"`). These have precedence over the default behavior.
        "workbench.editorAssociations": {},

        // Controls the minimum size of a file in MB before asking for confirmation when opening in the editor. Note that this setting may not apply to all editor types and environments.
        "workbench.editorLargeFileConfirmation": 1024,

        // This setting is deprecated in favor of `workbench.cloudChanges.autoResume`.
        //
        "workbench.editSessions.autoResume": null,

        // This setting is deprecated in favor of `workbench.cloudChanges.continueOn`.
        //
        "workbench.editSessions.continueOn": null,

        // Fetches experiments to run from a Microsoft online service.
        "workbench.enableExperiments": true,

        // Controls whether to automatically store available working changes in the cloud for the current workspace.
        //  - onShutdown: Automatically store current working changes in the cloud on window close.
        //  - off: Never attempt to automatically store working changes in the cloud.
        "workbench.experimental.cloudChanges.autoStore": "off",

        // Controls whether to surface cloud changes which partially match the current session.
        "workbench.experimental.cloudChanges.partialMatches.enabled": false,

        // This setting is deprecated in favor of `workbench.experimental.cloudChanges.autoStore`.
        //
        "workbench.experimental.editSessions.autoStore": null,

        // This setting is deprecated in favor of `workbench.experimental.cloudChanges.partialMatches.enabled`.
        //
        "workbench.experimental.editSessions.partialMatches.enabled": null,

        // Configure the opener to use for external URIs (http, https).
        "workbench.externalUriOpeners": {},

        // Controls font aliasing method in the workbench.
        //  - default: Sub-pixel font smoothing. On most non-retina displays this will give the sharpest text.
        //  - antialiased: Smooth the font on the level of the pixel, as opposed to the subpixel. Can make the font appear lighter overall.
        //  - none: Disables font smoothing. Text will show with jagged sharp edges.
        //  - auto: Applies `default` or `antialiased` automatically based on the DPI of displays.
        "workbench.fontAliasing": "default",

        // Controls the delay in milliseconds after which the hover is shown for workbench items (ex. some extension provided tree view items). Already visible items may require a refresh before reflecting this setting change.
        "workbench.hover.delay": 1500,

        // Specifies the file icon theme used in the workbench or 'null' to not show any file icons.
        //  - null: No file icons
        //  - vs-minimal
        //  - vs-seti
        "workbench.iconTheme": "vs-seti",

        // Controls whether the layout control is shown in the custom title bar. This setting only has an effect when `window.titleBarStyle` is set to `custom`.
        "workbench.layoutControl.enabled": true,

        // Controls whether the layout control in the custom title bar is displayed as a single menu button or with multiple UI toggles.
        //  - menu: Shows a single button with a dropdown of layout options.
        //  - toggles: Shows several buttons for toggling the visibility of the panels and side bar.
        //  - both: Shows both the dropdown and toggle buttons.
        "workbench.layoutControl.type": "both",

        // Controls the type of matching used when searching lists and trees in the workbench.
        //  - fuzzy: Use fuzzy matching when searching.
        //  - contiguous: Use contiguous matching when searching.
        "workbench.list.defaultFindMatchType": "fuzzy",

        // Controls the default find mode for lists and trees in the workbench.
        //  - highlight: Highlight elements when searching. Further up and down navigation will traverse only the highlighted elements.
        //  - filter: Filter elements when searching.
        "workbench.list.defaultFindMode": "highlight",

        // Scrolling speed multiplier when pressing `Alt`.
        "workbench.list.fastScrollSensitivity": 5,

        // Controls whether lists and trees support horizontal scrolling in the workbench. Warning: turning on this setting has a performance implication.
        "workbench.list.horizontalScrolling": false,

        // Please use 'workbench.list.defaultFindMode' and	'workbench.list.typeNavigationMode' instead.
        // Controls the keyboard navigation style for lists and trees in the workbench. Can be simple, highlight and filter.
        //  - simple: Simple keyboard navigation focuses elements which match the keyboard input. Matching is done only on prefixes.
        //  - highlight: Highlight keyboard navigation highlights elements which match the keyboard input. Further up and down navigation will traverse only the highlighted elements.
        //  - filter: Filter keyboard navigation will filter out and hide all the elements which do not match the keyboard input.
        "workbench.list.keyboardNavigation": "highlight",

        // A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events.
        "workbench.list.mouseWheelScrollSensitivity": 1,

        // The modifier to be used to add an item in trees and lists to a multi-selection with the mouse (for example in the explorer, open editors and scm view). The 'Open to Side' mouse gestures - if supported - will adapt such that they do not conflict with the multiselect modifier.
        //  - ctrlCmd: Maps to `Control` on Windows and Linux and to `Command` on macOS.
        //  - alt: Maps to `Alt` on Windows and Linux and to `Option` on macOS.
        "workbench.list.multiSelectModifier": "ctrlCmd",

        // Controls how to open items in trees and lists using the mouse (if supported). Note that some trees and lists might choose to ignore this setting if it is not applicable.
        "workbench.list.openMode": "singleClick",

        // Controls whether clicks in the scrollbar scroll page by page.
        "workbench.list.scrollByPage": false,

        // Controls whether lists and trees have smooth scrolling.
        "workbench.list.smoothScrolling": false,

        // Controls the how type navigation works in lists and trees in the workbench. When set to 'trigger', type navigation begins once the 'list.triggerTypeNavigation' command is run.
        "workbench.list.typeNavigationMode": "automatic",

        // Controls whether local file history is enabled. When enabled, the file contents of an editor that is saved will be stored to a backup location to be able to restore or review the contents later. Changing this setting has no effect on existing local file history entries.
        "workbench.localHistory.enabled": true,

        // Configure [glob patterns](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options) for excluding files from the local file history. Changing this setting has no effect on existing local file history entries.
        "workbench.localHistory.exclude": {},

        // Controls the maximum number of local file history entries per file. When the number of local file history entries exceeds this number for a file, the oldest entries will be discarded.
        "workbench.localHistory.maxFileEntries": 50,

        // Controls the maximum size of a file (in KB) to be considered for local file history. Files that are larger will not be added to the local file history. Changing this setting has no effect on existing local file history entries.
        "workbench.localHistory.maxFileSize": 256,

        // Configure an interval in seconds during which the last entry in local file history is replaced with the entry that is being added. This helps reduce the overall number of entries that are added, for example when auto save is enabled. This setting is only applied to entries that have the same source of origin. Changing this setting has no effect on existing local file history entries.
        "workbench.localHistory.mergeWindow": 10,

        // Controls the default location of the panel (Terminal, Debug Console, Output, Problems) in a new workspace. It can either show at the bottom, right, or left of the editor area.
        "workbench.panel.defaultLocation": "bottom",

        // Controls whether the panel opens maximized. It can either always open maximized, never open maximized, or open to the last state it was in before being closed.
        //  - always: Always maximize the panel when opening it.
        //  - never: Never maximize the panel when opening it. The panel will open un-maximized.
        //  - preserve: Open the panel to the state that it was in, before it was closed.
        "workbench.panel.opensMaximized": "preserve",

        // Specifies the preferred color theme for dark OS appearance when `window.autoDetectColorScheme` is enabled.
        "workbench.preferredDarkColorTheme": "Default Dark+",

        // Specifies the preferred color theme used in high contrast dark mode when `window.autoDetectHighContrast` is enabled.
        "workbench.preferredHighContrastColorTheme": "Default High Contrast",

        // Specifies the preferred color theme used in high contrast light mode when `window.autoDetectHighContrast` is enabled.
        "workbench.preferredHighContrastLightColorTheme":
          "Default High Contrast Light",

        // Specifies the preferred color theme for light OS appearance when `window.autoDetectColorScheme` is enabled.
        "workbench.preferredLightColorTheme": "Default Light+",

        // Specifies the product icon theme used.
        //  - Default: Default
        "workbench.productIconTheme": "Default",

        // Controls whether Quick Open should close automatically once it loses focus.
        "workbench.quickOpen.closeOnFocusLost": true,

        // Controls whether the last typed input to Quick Open should be restored when opening it the next time.
        "workbench.quickOpen.preserveInput": false,

        // Controls whether the workbench should render with fewer animations.
        //  - on: Always render with reduced motion.
        //  - off: Do not render with reduced motion
        //  - auto: Render with reduced motion based on OS configuration.
        "workbench.reduceMotion": "auto",

        // Controls the hover feedback delay in milliseconds of the dragging area in between views/editors.
        "workbench.sash.hoverDelay": 300,

        // Controls the feedback area size in pixels of the dragging area in between views/editors. Set it to a larger value if you feel it's hard to resize views using the mouse.
        "workbench.sash.size": 4,

        // Determines which settings editor to use by default.
        //  - ui: Use the settings UI editor.
        //  - json: Use the JSON file editor.
        "workbench.settings.editor": "ui",

        // Controls whether to enable the natural language search mode for settings. The natural language search is provided by a Microsoft online service.
        "workbench.settings.enableNaturalLanguageSearch": true,

        // Controls whether opening keybinding settings also opens an editor showing all default keybindings.
        "workbench.settings.openDefaultKeybindings": false,

        // Controls whether opening settings also opens an editor showing all default settings.
        "workbench.settings.openDefaultSettings": false,

        // Controls the behavior of the settings editor Table of Contents while searching.
        //  - hide: Hide the Table of Contents while searching.
        //  - filter: Filter the Table of Contents to just categories that have matching settings. Clicking a category will filter the results to that category.
        "workbench.settings.settingsSearchTocBehavior": "filter",

        // Controls whether to use the split JSON editor when editing settings as JSON.
        "workbench.settings.useSplitJSON": false,

        // Controls the location of the primary side bar and activity bar. They can either show on the left or right of the workbench. The secondary side bar will show on the opposite side of the workbench.
        "workbench.sideBar.location": "left",

        // Controls which editor is shown at startup, if none are restored from the previous session.
        //  - none: Start without an editor.
        //  - welcomePage: Open the Welcome page, with content to aid in getting started with VS Code and extensions.
        //  - readme: Open the README when opening a folder that contains one, fallback to 'welcomePage' otherwise. Note: This is only observed as a global configuration, it will be ignored if set in a workspace or folder configuration.
        //  - newUntitledFile: Open a new untitled text file (only applies when opening an empty window).
        //  - welcomePageInEmptyWorkbench: Open the Welcome page when opening an empty workbench.
        "workbench.startupEditor": "welcomePage",

        // Controls the visibility of the status bar at the bottom of the workbench.
        "workbench.statusBar.visible": true,

        // When enabled, will show the watermark tips when no editor is open.
        "workbench.tips.enabled": true,

        // Controls how tree folders are expanded when clicking the folder names. Note that some trees and lists might choose to ignore this setting if it is not applicable.
        "workbench.tree.expandMode": "singleClick",

        // Controls tree indentation in pixels.
        "workbench.tree.indent": 8,

        // Controls whether the tree should render indent guides.
        "workbench.tree.renderIndentGuides": "onHover",

        // When enabled, trusted domain prompts will appear when opening links in trusted workspaces.
        "workbench.trustedDomains.promptInTrustedWorkspace": false,

        // Controls the visibility of view header actions. View header actions may either be always visible, or only visible when that view is focused or hovered over.
        "workbench.view.alwaysShowHeaderActions": false,

        // When enabled, the get started page has additional links to video tutorials.
        "workbench.welcomePage.experimental.videoTutorials": "off",

        // Deprecated, use the global `workbench.reduceMotion`.
        // When enabled, reduce motion in welcome page.
        "workbench.welcomePage.preferReducedMotion": false,

        // When enabled, an extension's walkthrough will open upon install of the extension.
        "workbench.welcomePage.walkthroughs.openOnInstall": true,

        // If set, automatically switch to the preferred color theme based on the OS appearance. If the OS appearance is dark, the theme specified at `workbench.preferredDarkColorTheme#` is used, for light `#workbench.preferredLightColorTheme`.
        "window.autoDetectColorScheme": false,

        // If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme. The high contrast theme to use is specified by `workbench.preferredHighContrastColorTheme#` and `#workbench.preferredHighContrastLightColorTheme`.
        "window.autoDetectHighContrast": true,

        // If enabled, clicking on an inactive window will both activate the window and trigger the element under the mouse if it is clickable. If disabled, clicking anywhere on an inactive window will activate it only and a second click is required on the element.
        "window.clickThroughInactive": true,

        // Controls whether closing the last editor should also close the window. This setting only applies for windows that do not show folders.
        "window.closeWhenEmpty": false,

        // Show command launcher together with the window title. This setting only has an effect when `window.titleBarStyle` is set to `custom`.
        "window.commandCenter": false,

        // Controls whether to show a confirmation dialog before closing the window or quitting the application.
        //  - always: Always ask for confirmation.
        //  - keyboardOnly: Only ask for confirmation if a keybinding was used.
        //  - never: Never explicitly ask for confirmation.
        "window.confirmBeforeClose": "never",

        // Adjust the appearance of dialog windows.
        "window.dialogStyle": "native",

        // If enabled, this setting will close the window when the application icon in the title bar is double-clicked. The window will not be able to be dragged by the icon. This setting is effective only if `window.titleBarStyle` is set to `custom`.
        "window.doubleClickIconToClose": false,

        // Experimental: When enabled, the window will have sandbox mode enabled via Electron API.
        "window.experimental.useSandbox": false,

        // Controls if native full-screen should be used on macOS. Disable this option to prevent macOS from creating a new space when going full-screen.
        "window.nativeFullScreen": true,

        // Enables macOS Sierra window tabs. Note that changes require a full restart to apply and that native tabs will disable a custom title bar style if configured.
        "window.nativeTabs": false,

        // Controls the dimensions of opening a new window when at least one window is already opened. Note that this setting does not have an impact on the first window that is opened. The first window will always restore the size and location as you left it before closing.
        //  - default: Open new windows in the center of the screen.
        //  - inherit: Open new windows with same dimension as last active one.
        //  - offset: Open new windows with same dimension as last active one with an offset position.
        //  - maximized: Open new windows maximized.
        //  - fullscreen: Open new windows in full screen mode.
        "window.newWindowDimensions": "default",

        // Controls whether files should open in a new window when using a command line or file dialog.
        // Note that there can still be cases where this setting is ignored (e.g. when using the `--new-window` or `--reuse-window` command line option).
        //  - on: Files will open in a new window.
        //  - off: Files will open in the window with the files' folder open or the last active window.
        //  - default: Files will open in the window with the files' folder open or the last active window unless opened via the Dock or from Finder.
        "window.openFilesInNewWindow": "off",

        // Controls whether folders should open in a new window or replace the last active window.
        // Note that there can still be cases where this setting is ignored (e.g. when using the `--new-window` or `--reuse-window` command line option).
        //  - on: Folders will open in a new window.
        //  - off: Folders will replace the last active window.
        //  - default: Folders will open in a new window unless a folder is picked from within the application (e.g. via the File menu).
        "window.openFoldersInNewWindow": "default",

        // Controls whether a new empty window should open when starting a second instance without arguments or if the last running instance should get focus.
        // Note that there can still be cases where this setting is ignored (e.g. when using the `--new-window` or `--reuse-window` command line option).
        //  - on: Open a new empty window.
        //  - off: Focus the last active running instance.
        "window.openWithoutArgumentsInNewWindow": "off",

        // Controls whether a window should restore to full screen mode if it was exited in full screen mode.
        "window.restoreFullscreen": false,

        // Controls how windows are being reopened after starting for the first time. This setting has no effect when the application is already running.
        //  - preserve: Always reopen all windows. If a folder or workspace is opened (e.g. from the command line) it opens as a new window unless it was opened before. If files are opened they will open in one of the restored windows.
        //  - all: Reopen all windows unless a folder, workspace or file is opened (e.g. from the command line).
        //  - folders: Reopen all windows that had folders or workspaces opened unless a folder, workspace or file is opened (e.g. from the command line).
        //  - one: Reopen the last active window unless a folder, workspace or file is opened (e.g. from the command line).
        //  - none: Never reopen a window. Unless a folder or workspace is opened (e.g. from the command line), an empty window will appear.
        "window.restoreWindows": "all",

        // Controls the window title based on the active editor. Variables are substituted based on the context:
        // - `${activeEditorShort}`: the file name (e.g. myFile.txt).
        // - `${activeEditorMedium}`: the path of the file relative to the workspace folder (e.g. myFolder/myFileFolder/myFile.txt).
        // - `${activeEditorLong}`: the full path of the file (e.g. /Users/Development/myFolder/myFileFolder/myFile.txt).
        // - `${activeFolderShort}`: the name of the folder the file is contained in (e.g. myFileFolder).
        // - `${activeFolderMedium}`: the path of the folder the file is contained in, relative to the workspace folder (e.g. myFolder/myFileFolder).
        // - `${activeFolderLong}`: the full path of the folder the file is contained in (e.g. /Users/Development/myFolder/myFileFolder).
        // - `${folderName}`: name of the workspace folder the file is contained in (e.g. myFolder).
        // - `${folderPath}`: file path of the workspace folder the file is contained in (e.g. /Users/Development/myFolder).
        // - `${rootName}`: name of the workspace with optional remote name and workspace indicator if applicable (e.g. myFolder, myRemoteFolder [SSH] or myWorkspace (Workspace)).
        // - `${rootNameShort}`: shortened name of the workspace without suffixes (e.g. myFolder, myRemoteFolder or myWorkspace).
        // - `${rootPath}`: file path of the opened workspace or folder (e.g. /Users/Development/myWorkspace).
        // - `${profileName}`: name of the profile in which the workspace is opened (e.g. Data Science (Profile)). Ignored if default profile is used.
        // - `${appName}`: e.g. VS Code.
        // - `${remoteName}`: e.g. SSH
        // - `${dirty}`: an indicator for when the active editor has unsaved changes.
        // - `${separator}`: a conditional separator (" - ") that only shows when surrounded by variables with values or static text.
        "window.title":
          "${activeEditorShort}${separator}${rootName}${separator}${profileName}",

        // Adjust the appearance of the window title bar. On Linux and Windows, this setting also affects the application and context menu appearances. Changes require a full restart to apply.
        "window.titleBarStyle": "custom",

        // Separator used by `window.title`.
        "window.titleSeparator": " — ",

        // Adjust the zoom level of the window. The original size is 0 and each increment above (e.g. 1) or below (e.g. -1) represents zooming 20% larger or smaller. You can also enter decimals to adjust the zoom level with a finer granularity.
        "window.zoomLevel": 0,

        // Configure file associations to languages (for example `"*.extension": "html"`). These have precedence over the default associations of the languages installed.
        "files.associations": {},

        // When enabled, the editor will attempt to guess the character set encoding when opening files. This setting can also be configured per language. Note, this setting is not respected by text search. Only `files.encoding` is respected.
        "files.autoGuessEncoding": false,

        // Controls [auto save](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save) of editors that have unsaved changes.
        //  - off: An editor with changes is never automatically saved.
        //  - afterDelay: An editor with changes is automatically saved after the configured `files.autoSaveDelay`.
        //  - onFocusChange: An editor with changes is automatically saved when the editor loses focus.
        //  - onWindowChange: An editor with changes is automatically saved when the window loses focus.
        "files.autoSave": "off",

        // Controls the delay in milliseconds after which an editor with unsaved changes is saved automatically. Only applies when `files.autoSave` is set to `afterDelay`.
        "files.autoSaveDelay": 1000,

        // The default language identifier that is assigned to new files. If configured to `${activeEditorLanguage}`, will use the language identifier of the currently active text editor if any.
        "files.defaultLanguage": "",

        // Moves files/folders to the OS trash (recycle bin on Windows) when deleting. Disabling this will delete files/folders permanently.
        "files.enableTrash": true,

        // The default character set encoding to use when reading and writing files. This setting can also be configured per language.
        //  - utf8: UTF-8
        //  - utf8bom: UTF-8 with BOM
        //  - utf16le: UTF-16 LE
        //  - utf16be: UTF-16 BE
        //  - windows1252: Western (Windows 1252)
        //  - iso88591: Western (ISO 8859-1)
        //  - iso88593: Western (ISO 8859-3)
        //  - iso885915: Western (ISO 8859-15)
        //  - macroman: Western (Mac Roman)
        //  - cp437: DOS (CP 437)
        //  - windows1256: Arabic (Windows 1256)
        //  - iso88596: Arabic (ISO 8859-6)
        //  - windows1257: Baltic (Windows 1257)
        //  - iso88594: Baltic (ISO 8859-4)
        //  - iso885914: Celtic (ISO 8859-14)
        //  - windows1250: Central European (Windows 1250)
        //  - iso88592: Central European (ISO 8859-2)
        //  - cp852: Central European (CP 852)
        //  - windows1251: Cyrillic (Windows 1251)
        //  - cp866: Cyrillic (CP 866)
        //  - iso88595: Cyrillic (ISO 8859-5)
        //  - koi8r: Cyrillic (KOI8-R)
        //  - koi8u: Cyrillic (KOI8-U)
        //  - iso885913: Estonian (ISO 8859-13)
        //  - windows1253: Greek (Windows 1253)
        //  - iso88597: Greek (ISO 8859-7)
        //  - windows1255: Hebrew (Windows 1255)
        //  - iso88598: Hebrew (ISO 8859-8)
        //  - iso885910: Nordic (ISO 8859-10)
        //  - iso885916: Romanian (ISO 8859-16)
        //  - windows1254: Turkish (Windows 1254)
        //  - iso88599: Turkish (ISO 8859-9)
        //  - windows1258: Vietnamese (Windows 1258)
        //  - gbk: Simplified Chinese (GBK)
        //  - gb18030: Simplified Chinese (GB18030)
        //  - cp950: Traditional Chinese (Big5)
        //  - big5hkscs: Traditional Chinese (Big5-HKSCS)
        //  - shiftjis: Japanese (Shift JIS)
        //  - eucjp: Japanese (EUC-JP)
        //  - euckr: Korean (EUC-KR)
        //  - windows874: Thai (Windows 874)
        //  - iso885911: Latin/Thai (ISO 8859-11)
        //  - koi8ru: Cyrillic (KOI8-RU)
        //  - koi8t: Tajik (KOI8-T)
        //  - gb2312: Simplified Chinese (GB 2312)
        //  - cp865: Nordic DOS (CP 865)
        //  - cp850: Western European DOS (CP 850)
        "files.encoding": "utf8",

        // The default end of line character.
        //  - \n: LF
        //  - \r\n: CRLF
        //  - auto: Uses operating system specific end of line character.
        "files.eol": "auto",

        // Configure [glob patterns](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options) for excluding files and folders. For example, the File Explorer decides which files and folders to show or hide based on this setting. Refer to the `search.exclude#` setting to define search-specific excludes. Refer to the `#explorer.excludeGitIgnore` setting for ignoring files based on your `.gitignore`.
        "files.exclude": {
          // EDITED Sorted
          "**/.DS_Store": true,
          "**/.git": true,
          "**/.hg": true,
          "**/.svn": true,
          "**/CVS": true,
          "**/Thumbs.db": true,
        },

        // Controls whether unsaved files are remembered between sessions, allowing the save prompt when exiting the editor to be skipped.
        //  - off: Disable hot exit. A prompt will show when attempting to close a window with editors that have unsaved changes.
        //  - onExit: Hot exit will be triggered when the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu). All windows without folders opened will be restored upon next launch. A list of previously opened windows with unsaved files can be accessed via `File > Open Recent > More...`
        //  - onExitAndWindowClose: Hot exit will be triggered when the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu), and also for any window with a folder opened regardless of whether it's the last window. All windows without folders opened will be restored upon next launch. A list of previously opened windows with unsaved files can be accessed via `File > Open Recent > More...`
        "files.hotExit": "onExit",

        // When enabled, insert a final new line at the end of the file when saving it.
        "files.insertFinalNewline": false,

        // Controls the memory available to VS Code after restart when trying to open large files. Same effect as specifying `--max-memory=NEWSIZE` on the command line.
        "files.maxMemoryForLargeFilesMB": 4096,

        // Timeout in milliseconds after which file participants for create, rename, and delete are cancelled. Use `0` to disable participants.
        "files.participants.timeout": 60000,

        // Controls if files that were part of a refactoring are saved automatically
        "files.refactoring.autoSave": true,

        // Restore the undo stack when a file is reopened.
        "files.restoreUndoStack": true,

        // A save conflict can occur when a file is saved to disk that was changed by another program in the meantime. To prevent data loss, the user is asked to compare the changes in the editor with the version on disk. This setting should only be changed if you frequently encounter save conflict errors and may result in data loss if used without caution.
        //  - askUser: Will refuse to save and ask for resolving the save conflict manually.
        //  - overwriteFileOnDisk: Will resolve the save conflict by overwriting the file on disk with the changes in the editor.
        "files.saveConflictResolution": "askUser",

        // Enables the simple file dialog. The simple file dialog replaces the system file dialog when enabled.
        "files.simpleDialog.enable": false,

        // When enabled, will trim all new lines after the final new line at the end of the file when saving it.
        "files.trimFinalNewlines": false,

        // When enabled, will trim trailing whitespace when saving a file.
        "files.trimTrailingWhitespace": false,

        // Configure paths or glob patterns to exclude from file watching. Paths can either be relative to the watched folder or absolute. Glob patterns are matched relative from the watched folder. When you experience the file watcher process consuming a lot of CPU, make sure to exclude large folders that are of less interest (such as build output folders).
        "files.watcherExclude": {
          // EDITED Sorted
          "**/.git/objects/**": true,
          "**/.git/subtree-cache/**": true,
          "**/.hg/store/**": true,
          "**/node_modules/*/**": true,
        },

        // Configure extra paths to watch for changes inside the workspace. By default, all workspace folders will be watched recursively, except for folders that are symbolic links. You can explicitly add absolute or relative paths to support watching folders that are symbolic links. Relative paths will be resolved to an absolute path using the currently opened workspace.
        "files.watcherInclude": [],

        // Controls the font size (in pixels) of the screencast mode keyboard.
        "screencastMode.fontSize": 56,

        // Controls how long (in milliseconds) the keyboard overlay is shown in screencast mode.
        "screencastMode.keyboardOverlayTimeout": 800,

        // Controls what is displayed in the keyboard overlay when showing shortcuts.
        //  - keys: Keys.
        //  - command: Command title.
        //  - commandWithGroup: Command title prefixed by its group.
        //  - commandAndKeys: Command title and keys.
        //  - commandWithGroupAndKeys: Command title and keys, with the command prefixed by its group.
        "screencastMode.keyboardShortcutsFormat": "commandAndKeys",

        // Controls the color in hex (#RGB, #RGBA, #RRGGBB or #RRGGBBAA) of the mouse indicator in screencast mode.
        "screencastMode.mouseIndicatorColor": "#FF0000",

        // Controls the size (in pixels) of the mouse indicator in screencast mode.
        "screencastMode.mouseIndicatorSize": 20,

        // Show only keyboard shortcuts in screencast mode (do not include action names).
        "screencastMode.onlyKeyboardShortcuts": false,

        // Controls the vertical offset of the screencast mode overlay from the bottom as a percentage of the workbench height.
        "screencastMode.verticalOffset": 20,

        // Controls whether turning on Zen Mode also centers the layout.
        "zenMode.centerLayout": true,

        // Controls whether turning on Zen Mode also puts the workbench into full screen mode.
        "zenMode.fullScreen": true,

        // Controls whether turning on Zen Mode also hides the activity bar either at the left or right of the workbench.
        "zenMode.hideActivityBar": true,

        // Controls whether turning on Zen Mode also hides the editor line numbers.
        "zenMode.hideLineNumbers": true,

        // Controls whether turning on Zen Mode also hides the status bar at the bottom of the workbench.
        "zenMode.hideStatusBar": true,

        // Controls whether turning on Zen Mode also hides workbench tabs.
        "zenMode.hideTabs": true,

        // Controls whether a window should restore to Zen Mode if it was exited in Zen Mode.
        "zenMode.restore": true,

        // Controls whether notifications do not disturb mode should be enabled while in Zen Mode. If true, only error notifications will pop out.
        "zenMode.silentNotifications": true,

        // Controls whether the Explorer should automatically reveal and select files when opening them.
        //  - true: Files will be revealed and selected.
        //  - false: Files will not be revealed and selected.
        //  - focusNoScroll: Files will not be scrolled into view, but will still be focused.
        "explorer.autoReveal": true,

        // Configure glob patterns for excluding files and folders from being revealed and selected in the Explorer when they are opened. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).
        "explorer.autoRevealExclude": {
          // EDITED Sorted
          "**/bower_components": true,
          "**/node_modules": true,
        },

        // Controls whether the Explorer should render folders in a compact form. In such a form, single child folders will be compressed in a combined tree element. Useful for Java package structures, for example.
        "explorer.compactFolders": true,

        // Controls whether the Explorer should ask for confirmation when deleting a file via the trash.
        "explorer.confirmDelete": true,

        // Controls whether the Explorer should ask for confirmation to move files and folders via drag and drop.
        "explorer.confirmDragAndDrop": true,

        // Controls whether the Explorer should ask for confirmation when undoing.
        //  - verbose: Explorer will prompt before all undo operations.
        //  - default: Explorer will prompt before destructive undo operations.
        //  - light: Explorer will not prompt before undo operations when focused.
        "explorer.confirmUndo": "default",

        // The path separation character used when copying relative file paths.
        //  - /: Use slash as path separation character.
        //  - \: Use backslash as path separation character.
        //  - auto: Uses operating system specific path separation character.
        "explorer.copyRelativePathSeparator": "auto",

        // Controls whether file decorations should use badges.
        "explorer.decorations.badges": true,

        // Controls whether file decorations should use colors.
        "explorer.decorations.colors": true,

        // Controls whether the Explorer should allow to move files and folders via drag and drop. This setting only effects drag and drop from inside the Explorer.
        "explorer.enableDragAndDrop": true,

        // Controls whether the Explorer should support undoing file and folder operations.
        "explorer.enableUndo": true,

        // Controls whether entries in .gitignore should be parsed and excluded from the Explorer. Similar to `files.exclude`.
        "explorer.excludeGitIgnore": false,

        // Controls whether the Explorer should expand multi-root workspaces containing only one folder during initialization
        "explorer.expandSingleFolderWorkspaces": true,

        // Controls whether file nesting is enabled in the Explorer. File nesting allows for related files in a directory to be visually grouped together under a single parent file.
        "explorer.fileNesting.enabled": false,

        // Controls whether file nests are automatically expanded. `explorer.fileNesting.enabled` must be set for this to take effect.
        "explorer.fileNesting.expand": true,

        // Controls nesting of files in the Explorer. `explorer.fileNesting.enabled` must be set for this to take effect. Each __Item__ represents a parent pattern and may contain a single `*` character that matches any string. Each __Value__ represents a comma separated list of the child patterns that should be shown nested under a given parent. Child patterns may contain several special tokens:
        // - `${capture}`: Matches the resolved value of the `*` from the parent pattern
        // - `${basename}`: Matches the parent file's basename, the `file` in `file.ts`
        // - `${extname}`: Matches the parent file's extension, the `ts` in `file.ts`
        // - `${dirname}`: Matches the parent file's directory name, the `src` in `src/file.ts`
        // - `*`:  Matches any string, may only be used once per child pattern
        "explorer.fileNesting.patterns": {
          // EDITED Sorted
          "*.js": "${capture}.js.map, ${capture}.min.js, ${capture}.d.ts",
          "*.jsx": "${capture}.js",
          "*.ts": "${capture}.js",
          "*.tsx": "${capture}.ts",
          "package.json": "package-lock.json, yarn.lock, pnpm-lock.yaml",
          "tsconfig.json": "tsconfig.*.json",
        },

        // Controls what naming strategy to use when a giving a new name to a duplicated Explorer item on paste.
        //  - simple: Appends the word "copy" at the end of the duplicated name potentially followed by a number.
        //  - smart: Adds a number at the end of the duplicated name. If some number is already part of the name, tries to increase that number.
        //  - disabled: Disables incremental naming. If two files with the same name exist you will be prompted to overwrite the existing file.
        "explorer.incrementalNaming": "simple",

        // The minimum number of editor slots shown in the Open Editors pane. If set to 0 the Open Editors pane will dynamically resize based on the number of editors.
        "explorer.openEditors.minVisible": 0,

        // Controls the sorting order of editors in the Open Editors pane.
        //  - editorOrder: Editors are ordered in the same order editor tabs are shown.
        //  - alphabetical: Editors are ordered alphabetically by tab name inside each editor group.
        //  - fullPath: Editors are ordered alphabetically by full path inside each editor group.
        "explorer.openEditors.sortOrder": "editorOrder",

        // The maximum number of editors shown in the Open Editors pane. Setting this to 0 hides the Open Editors pane.
        "explorer.openEditors.visible": 9,

        // Controls the property-based sorting of files and folders in the Explorer. When `explorer.fileNesting.enabled` is enabled, also controls sorting of nested files.
        //  - default: Files and folders are sorted by their names. Folders are displayed before files.
        //  - mixed: Files and folders are sorted by their names. Files are interwoven with folders.
        //  - filesFirst: Files and folders are sorted by their names. Files are displayed before folders.
        //  - type: Files and folders are grouped by extension type then sorted by their names. Folders are displayed before files.
        //  - modified: Files and folders are sorted by last modified date in descending order. Folders are displayed before files.
        //  - foldersNestsFiles: Files and folders are sorted by their names. Folders are displayed before files. Files with nested children are displayed before other files.
        "explorer.sortOrder": "default",

        // Controls the lexicographic sorting of file and folder names in the Explorer.
        //  - default: Uppercase and lowercase names are mixed together.
        //  - upper: Uppercase names are grouped together before lowercase names.
        //  - lower: Lowercase names are grouped together before uppercase names.
        //  - unicode: Names are sorted in Unicode order.
        "explorer.sortOrderLexicographicOptions": "default",

        // Controls the positioning of the actionbar on rows in the search view.
        //  - auto: Position the actionbar to the right when the search view is narrow, and immediately after the content when the search view is wide.
        //  - right: Always position the actionbar to the right.
        "search.actionsPosition": "right",

        // Controls whether the search results will be collapsed or expanded.
        //  - auto: Files with less than 10 results are expanded. Others are collapsed.
        //  - alwaysCollapse
        //  - alwaysExpand
        "search.collapseResults": "alwaysExpand",

        // Controls whether search file decorations should use badges.
        "search.decorations.badges": true,

        // Controls whether search file decorations should use colors.
        "search.decorations.colors": true,

        // Controls the default search result view mode.
        //  - tree: Shows search results as a tree.
        //  - list: Shows search results as a list.
        "search.defaultViewMode": "list",

        // Configure [glob patterns](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options) for excluding files and folders in fulltext searches and quick open. Inherits all glob patterns from the `files.exclude` setting.
        "search.exclude": {
          // EDITED Sorted
          "**/*.code-search": true,
          "**/bower_components": true,
          "**/node_modules": true,
        },

        // Controls whether to follow symlinks while searching.
        "search.followSymlinks": true,

        // Controls whether the search view should read or modify the shared find clipboard on macOS.
        "search.globalFindClipboard": false,

        // This setting is deprecated. You can drag the search icon to a new location instead.
        // Controls whether the search will be shown as a view in the sidebar or as a panel in the panel area for more horizontal space.
        "search.location": "sidebar",

        // The search cache is kept in the extension host which never shuts down, so this setting is no longer needed.
        // When enabled, the searchService process will be kept alive instead of being shut down after an hour of inactivity. This will keep the file search cache in memory.
        "search.maintainFileSearchCache": false,

        // Controls the maximum number of search results, this can be set to `null` (empty) to return unlimited results.
        "search.maxResults": 20000,

        // Controls where new `Search: Find in Files` and `Find in Folder` operations occur: either in the search view, or in a search editor.
        //  - view: Search in the search view, either in the panel or side bars.
        //  - reuseEditor: Search in an existing search editor if present, otherwise in a new search editor.
        //  - newEditor: Search in a new search editor.
        "search.mode": "view",

        // Controls sorting order of editor history in quick open when filtering.
        //  - default: History entries are sorted by relevance based on the filter value used. More relevant entries appear first.
        //  - recency: History entries are sorted by recency. More recently opened entries appear first.
        "search.quickOpen.history.filterSortOrder": "default",

        // Whether to include results from recently opened files in the file results for Quick Open.
        "search.quickOpen.includeHistory": true,

        // Whether to include results from a global symbol search in the file results for Quick Open.
        "search.quickOpen.includeSymbols": false,

        // The default number of surrounding context lines to use when creating new Search Editors. If using `search.searchEditor.reusePriorSearchConfiguration`, this can be set to `null` (empty) to use the prior Search Editor's configuration.
        "search.searchEditor.defaultNumberOfContextLines": 1,

        // Configure effect of double-clicking a result in a search editor.
        //  - selectWord: Double-clicking selects the word under the cursor.
        //  - goToLocation: Double-clicking opens the result in the active editor group.
        //  - openLocationToSide: Double-clicking opens the result in the editor group to the side, creating one if it does not yet exist.
        "search.searchEditor.doubleClickBehaviour": "goToLocation",

        // When enabled, new Search Editors will reuse the includes, excludes, and flags of the previously opened Search Editor.
        "search.searchEditor.reusePriorSearchConfiguration": false,

        // Search all files as you type.
        "search.searchOnType": true,

        // When `search.searchOnType#` is enabled, controls the timeout in milliseconds between a character being typed and the search starting. Has no effect when `#search.searchOnType` is disabled.
        "search.searchOnTypeDebouncePeriod": 300,

        // Update the search query to the editor's selected text when focusing the search view. This happens either on click or when triggering the `workbench.views.search.focus` command.
        "search.seedOnFocus": false,

        // Enable seeding search from the word nearest the cursor when the active editor has no selection.
        "search.seedWithNearestWord": false,

        // Controls whether to show line numbers for search results.
        "search.showLineNumbers": false,

        // Search case-insensitively if the pattern is all lowercase, otherwise, search case-sensitively.
        "search.smartCase": false,

        // Controls sorting order of search results.
        //  - default: Results are sorted by folder and file names, in alphabetical order.
        //  - fileNames: Results are sorted by file names ignoring folder order, in alphabetical order.
        //  - type: Results are sorted by file extensions, in alphabetical order.
        //  - modified: Results are sorted by file last modified date, in descending order.
        //  - countDescending: Results are sorted by count per file, in descending order.
        //  - countAscending: Results are sorted by count per file, in ascending order.
        "search.sortOrder": "default",

        // Controls whether to use your global gitignore file (e.g., from `$HOME/.config/git/ignore`) when searching for files. Requires `search.useIgnoreFiles` to be enabled.
        "search.useGlobalIgnoreFiles": false,

        // Controls whether to use `.gitignore` and `.ignore` files when searching for files.
        "search.useIgnoreFiles": true,

        // Controls whether to use `.gitignore` and `.ignore` files in parent directories when searching for files. Requires `search.useIgnoreFiles` to be enabled.
        "search.useParentIgnoreFiles": false,

        // Deprecated. PCRE2 will be used automatically when using regex features that are only supported by PCRE2.
        // Whether to use the PCRE2 regex engine in text search. This enables using some advanced regex features like lookahead and backreferences. However, not all PCRE2 features are supported - only features that are also supported by JavaScript.
        "search.usePCRE2": false,

        // Controls whether to open Replace Preview when selecting or replacing a match.
        "search.useReplacePreview": true,

        // Deprecated. Consider "search.usePCRE2" for advanced regex feature support.
        // This setting is deprecated and now falls back on "search.usePCRE2".
        "search.useRipgrep": true,

        // The proxy setting to use. If not set, will be inherited from the `http_proxy` and `https_proxy` environment variables.
        "http.proxy": "",

        // The value to send as the `Proxy-Authorization` header for every network request.
        "http.proxyAuthorization": null,

        // Controls whether the proxy server certificate should be verified against the list of supplied CAs.
        "http.proxyStrictSSL": true,

        // Use the proxy support for extensions.
        //  - off: Disable proxy support for extensions.
        //  - on: Enable proxy support for extensions.
        //  - fallback: Enable proxy support for extensions, fall back to request options, when no proxy found.
        //  - override: Enable proxy support for extensions, override request options.
        "http.proxySupport": "override",

        // Controls whether CA certificates should be loaded from the OS. (On Windows and macOS, a reload of the window is required after turning this off.)
        "http.systemCertificates": true,

        // Controls the dispatching logic for key presses to use either `code` (recommended) or `keyCode`.
        "keyboard.dispatch": "code",

        // Enables the macOS touchbar buttons on the keyboard if available.
        "keyboard.touchbar.enabled": true,

        // A set of identifiers for entries in the touchbar that should not show up (for example `workbench.action.navigateBack`).
        "keyboard.touchbar.ignored": [],

        // This setting is deprecated, please use 'update.mode' instead.
        // Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service.
        "update.channel": "default",

        // Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service.
        //  - none: Disable updates.
        //  - manual: Disable automatic background update checks. Updates will be available if you manually check for updates.
        //  - start: Check for updates only on startup. Disable automatic background update checks.
        //  - default: Enable automatic update checks. Code will check for updates automatically and periodically.
        "update.mode": "default",

        // Show Release Notes after an update. The Release Notes are fetched from a Microsoft online service.
        "update.showReleaseNotes": true,

        // This setting is deprecated in favor of `comments.openView`.
        // Controls when the comments panel should open.
        "comments.openPanel": "openOnSessionStartWithComments",

        // Controls when the comments view should open.
        //  - never: The comments view will never be opened.
        //  - file: The comments view will open when a file with comments is active.
        //  - firstFile: If the comments view has not been opened yet during this session it will open the first time during a session that a file with comments is active.
        "comments.openView": "firstFile",

        // Determines if relative time will be used in comment timestamps (ex. '1 day ago').
        "comments.useRelativeTime": true,

        // Controls the visibility of the comments bar and comment threads in editors that have commenting ranges and comments. Comments are still accessible via the Comments view and will cause commenting to be toggled on in the same way running the command "Comments: Toggle Editor Commenting" toggles comments.
        "comments.visible": true,

        // Allow setting breakpoints in any file.
        "debug.allowBreakpointsEverywhere": false,

        // Automatically show values for variables that are lazily resolved by the debugger, such as getters.
        "debug.autoExpandLazyVariables": false,

        // Controls whether to confirm when the window closes if there are active debug sessions.
        //  - never: Never confirm.
        //  - always: Always confirm if there are debug sessions.
        "debug.confirmOnExit": "never",

        // Controls whether suggestions should be accepted on Enter in the Debug Console. Enter is also used to evaluate whatever is typed in the Debug Console.
        "debug.console.acceptSuggestionOnEnter": "off",

        // Controls if the Debug Console should be automatically closed when the debug session ends.
        "debug.console.closeOnEnd": false,

        // Controls if the Debug Console should collapse identical lines and show a number of occurrences with a badge.
        "debug.console.collapseIdenticalLines": true,

        // Controls the font family in the Debug Console.
        "debug.console.fontFamily": "default",

        // Controls the font size in pixels in the Debug Console.
        "debug.console.fontSize": 12,

        // Controls if the Debug Console should suggest previously typed input.
        "debug.console.historySuggestions": true,

        // Controls the line height in pixels in the Debug Console. Use 0 to compute the line height from the font size.
        "debug.console.lineHeight": 0,

        // Controls if the lines should wrap in the Debug Console.
        "debug.console.wordWrap": true,

        // Show Source Code in Disassembly View.
        "debug.disassemblyView.showSourceCode": true,

        // Color status bar when debugger is active
        "debug.enableStatusBarColor": true,

        // Controls whether the editor should be focused when the debugger breaks.
        "debug.focusEditorOnBreak": true,

        // Controls whether the workbench window should be focused when the debugger breaks.
        "debug.focusWindowOnBreak": true,

        // Show variable values inline in editor while debugging.
        //  - on: Always show variable values inline in editor while debugging.
        //  - off: Never show variable values inline in editor while debugging.
        //  - auto: Show variable values inline in editor while debugging when the language supports inline value locations.
        "debug.inlineValues": "auto",

        // Controls when the internal Debug Console should open.
        "debug.internalConsoleOptions": "openOnFirstSessionStart",

        // Controls what to do when errors are encountered after running a preLaunchTask.
        //  - debugAnyway: Ignore task errors and start debugging.
        //  - showErrors: Show the Problems view and do not start debugging.
        //  - prompt: Prompt user.
        //  - abort: Cancel debugging.
        "debug.onTaskErrors": "prompt",

        // Controls when the debug view should open.
        "debug.openDebug": "openOnDebugBreak",

        // Automatically open the explorer view at the end of a debug session.
        "debug.openExplorerOnEnd": false,

        // Controls what editors to save before starting a debug session.
        //  - allEditorsInActiveGroup: Save all editors in the active group before starting a debug session.
        //  - nonUntitledEditorsInActiveGroup: Save all editors in the active group except untitled ones before starting a debug session.
        //  - none: Don't save any editors before starting a debug session.
        "debug.saveBeforeStart": "allEditorsInActiveGroup",

        // Controls whether breakpoints should be shown in the overview ruler.
        "debug.showBreakpointsInOverviewRuler": false,

        // Controls whether inline breakpoints candidate decorations should be shown in the editor while debugging.
        "debug.showInlineBreakpointCandidates": true,

        // Controls when the debug Status bar should be visible.
        //  - never: Never show debug in Status bar
        //  - always: Always show debug in Status bar
        //  - onFirstSessionStart: Show debug in Status bar only after debug was started for the first time
        "debug.showInStatusBar": "onFirstSessionStart",

        // Controls whether the debug sub-sessions are shown in the debug tool bar. When this setting is false the stop command on a sub-session will also stop the parent session.
        "debug.showSubSessionsInToolBar": false,

        // Before starting a new debug session in an integrated or external terminal, clear the terminal.
        "debug.terminal.clearBeforeReusing": false,

        // Controls the location of the debug toolbar. Either `floating` in all views, `docked` in the debug view, or `hidden`.
        "debug.toolBarLocation": "floating",

        // Global debug launch configuration. Should be used as an alternative to 'launch.json' that is shared across workspaces.
        "launch": {
          configurations: [],
          compounds: [],
        },

        // Enable/disable autoclosing of HTML tags.
        "html.autoClosingTags": true,

        // Enable/disable auto creation of quotes for HTML attribute assignment. The type of quotes can be configured by `html.completion.attributeDefaultValue`.
        "html.autoCreateQuotes": true,

        // Controls the default value for attributes when completion is accepted.
        //  - doublequotes: Attribute value is set to "".
        //  - singlequotes: Attribute value is set to ''.
        //  - empty: Attribute value is not set.
        "html.completion.attributeDefaultValue": "doublequotes",

        // A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-html-languageservice/blob/master/docs/customData.md).
        //
        // VS Code loads custom data on startup to enhance its HTML support for the custom HTML tags, attributes and attribute values you specify in the JSON files.
        //
        // The file paths are relative to workspace and only workspace folder settings are considered.
        "html.customData": [],

        // List of tags, comma separated, where the content shouldn't be reformatted. `null` defaults to the `pre` tag.
        "html.format.contentUnformatted": "pre,code,textarea",

        // Enable/disable default HTML formatter.
        "html.format.enable": true,

        // List of tags, comma separated, that should have an extra newline before them. `null` defaults to `"head, body, /html"`.
        "html.format.extraLiners": "head, body, /html",

        // Format and indent `{{#foo}}` and `{{/foo}}`.
        "html.format.indentHandlebars": false,

        // Indent `<head>` and `<body>` sections.
        "html.format.indentInnerHtml": false,

        // Maximum number of line breaks to be preserved in one chunk. Use `null` for unlimited.
        "html.format.maxPreserveNewLines": null,

        // Controls whether existing line breaks before elements should be preserved. Only works before elements, not inside tags or for text.
        "html.format.preserveNewLines": true,

        // Honor django, erb, handlebars and php templating language tags.
        "html.format.templating": false,

        // List of tags, comma separated, that shouldn't be reformatted. `null` defaults to all tags listed at https://www.w3.org/TR/html5/dom.html#phrasing-content.
        "html.format.unformatted": "wbr",

        // Keep text content together between this string.
        "html.format.unformattedContentDelimiter": "",

        // Wrap attributes.
        //  - auto: Wrap attributes only when line length is exceeded.
        //  - force: Wrap each attribute except first.
        //  - force-aligned: Wrap each attribute except first and keep aligned.
        //  - force-expand-multiline: Wrap each attribute.
        //  - aligned-multiple: Wrap when line length is exceeded, align attributes vertically.
        //  - preserve: Preserve wrapping of attributes.
        //  - preserve-aligned: Preserve wrapping of attributes but align.
        "html.format.wrapAttributes": "auto",

        // Indent wrapped attributes to after N characters. Use `null` to use the default indent size. Ignored if `html.format.wrapAttributes` is set to 'aligned'.
        "html.format.wrapAttributesIndentSize": null,

        // Maximum amount of characters per line (0 = disable).
        "html.format.wrapLineLength": 120,

        // Show tag and attribute documentation in hover.
        "html.hover.documentation": true,

        // Show references to MDN in hover.
        "html.hover.references": true,

        // Deprecated in favor of `editor.linkedEditing`
        // Enable/disable mirroring cursor on matching HTML tag.
        "html.mirrorCursorOnMatchingTag": false,

        // Controls whether the built-in HTML language support suggests HTML5 tags, properties and values.
        "html.suggest.html5": true,

        // Traces the communication between VS Code and the HTML language server.
        "html.trace.server": "off",

        // Controls whether the built-in HTML language support validates embedded scripts.
        "html.validate.scripts": true,

        // Controls whether the built-in HTML language support validates embedded styles.
        "html.validate.styles": true,

        // The setting `json.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`.
        // Enables or disables color decorators
        "json.colorDecorators.enable": true,

        // Enable/disable default JSON formatter
        "json.format.enable": true,

        // Keep all existing new lines when formatting.
        "json.format.keepLines": false,

        // The maximum number of outline symbols and folding regions computed (limited for performance reasons).
        "json.maxItemsComputed": 5000,

        // When enabled, JSON schemas can be fetched from http and https locations.
        "json.schemaDownload.enable": true,

        // Associate schemas to JSON files in the current project.
        "json.schemas": [],

        // Traces the communication between VS Code and the JSON language server.
        "json.trace.server": "off",

        // Enable/disable JSON validation.
        "json.validate.enable": true,

        // Enable dropping files into a Markdown editor while holding Shift. Requires enabling `editor.dropIntoEditor.enabled`.
        "markdown.editor.drop.enabled": true,

        // Defines where files copied into a Markdown document should be created. This is a map from globs that match on the Markdown document to destinations.
        //
        // The destinations may use the following variables:
        //
        // - `${documentFileName}` — The full filename of the Markdown document, for example `readme.md`.
        // - `${documentBaseName}` — The basename of Markdown document, for example `readme`.
        // - `${documentExtName}` — The extension of the Markdown document, for example `md`.
        // - `${documentDirName}` — The name of the Markdown document's parent directory.
        // - `${documentWorkspaceFolder}` — The workspace folder for the Markdown document, for examples, `/Users/me/myProject`. This is the same as `${documentDirName}` if the file is not part of in a workspace.
        // - `${fileName}` — The file name of the dropped file, for example `image.png`.
        "markdown.experimental.copyFiles.destination": {},

        // Enable pasting files into a Markdown editor inserts Markdown links. Requires enabling `editor.experimental.pasteActions.enabled`.
        "markdown.experimental.editor.pasteLinks.enabled": true,

        // Controls where links in Markdown files should be opened.
        //  - currentGroup: Open links in the active editor group.
        //  - beside: Open links beside the active editor.
        "markdown.links.openLocation": "currentGroup",

        // Enable highlighting link occurrences in the current document.
        "markdown.occurrencesHighlight.enabled": false,

        // Sets how line-breaks are rendered in the Markdown preview. Setting it to 'true' creates a <br> for newlines inside paragraphs.
        "markdown.preview.breaks": false,

        // Double-click in the Markdown preview to switch to the editor.
        "markdown.preview.doubleClickToSwitchToEditor": true,

        // Controls the font family used in the Markdown preview.
        "markdown.preview.fontFamily":
          "-apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif",

        // Controls the font size in pixels used in the Markdown preview.
        "markdown.preview.fontSize": 14,

        // Controls the line height used in the Markdown preview. This number is relative to the font size.
        "markdown.preview.lineHeight": 1.6,

        // Convert URL-like text to links in the Markdown preview.
        "markdown.preview.linkify": true,

        // Mark the current editor selection in the Markdown preview.
        "markdown.preview.markEditorSelection": true,

        // Controls how links to other Markdown files in the Markdown preview should be opened.
        //  - inPreview: Try to open links in the Markdown preview.
        //  - inEditor: Try to open links in the editor.
        "markdown.preview.openMarkdownLinks": "inPreview",

        // When a Markdown preview is scrolled, update the view of the editor.
        "markdown.preview.scrollEditorWithPreview": true,

        // When a Markdown editor is scrolled, update the view of the preview.
        "markdown.preview.scrollPreviewWithEditor": true,

        // Enable some language-neutral replacement and quotes beautification in the Markdown preview.
        "markdown.preview.typographer": false,

        // A list of URLs or local paths to CSS style sheets to use from the Markdown preview. Relative paths are interpreted relative to the folder open in the Explorer. If there is no open folder, they are interpreted relative to the location of the Markdown file. All '\' need to be written as '\\'.
        "markdown.styles": [],

        // Enable path suggestions while writing links in Markdown files.
        "markdown.suggest.paths.enabled": true,

        // Enable debug logging for the Markdown extension.
        "markdown.trace.extension": "off",

        // Traces the communication between VS Code and the Markdown language server.
        "markdown.trace.server": "off",

        // Try to update links in Markdown files when a file is renamed/moved in the workspace. Use `markdown.updateLinksOnFileMove.include` to configure which files trigger link updates.
        //  - prompt: Prompt on each file move.
        //  - always: Always update links automatically.
        //  - never: Never try to update link and don't prompt.
        "markdown.updateLinksOnFileMove.enabled": "never",

        // Enable updating links when a directory is moved or renamed in the workspace.
        "markdown.updateLinksOnFileMove.enableForDirectories": true,

        // Glob patterns that specifies files that trigger automatic link updates. See `markdown.updateLinksOnFileMove.enabled` for details about this feature.
        "markdown.updateLinksOnFileMove.include": [
          "**/*.{md,mkd,mdwn,mdown,markdown,markdn,mdtxt,mdtext,workbook}",
          "**/*.{jpg,jpe,jpeg,png,bmp,gif,ico,webp,avif,tiff,svg,mp4}",
        ],

        // Validate duplicated definitions in the current file.
        "markdown.validate.duplicateLinkDefinitions.enabled": "warning",

        // Enable all error reporting in Markdown files.
        "markdown.validate.enabled": false,

        // Validate links to other files in Markdown files, for example `[link](/path/to/file.md)`. This checks that the target files exists. Requires enabling `markdown.validate.enabled`.
        "markdown.validate.fileLinks.enabled": "warning",

        // Validate the fragment part of links to headers in other files in Markdown files, for example `[link](/path/to/file.md#header)`. Inherits the setting value from `markdown.validate.fragmentLinks.enabled` by default.
        "markdown.validate.fileLinks.markdownFragmentLinks": "inherit",

        // Validate fragment links to headers in the current Markdown file, for example `[link](#header)`. Requires enabling `markdown.validate.enabled`.
        "markdown.validate.fragmentLinks.enabled": "warning",

        // Configure links that should not be validated. For example adding `/about` would not validate the link `[about](/about)`, while the glob `/assets/**/*.svg` would let you skip validation for any link to `.svg` files under the `assets` directory.
        "markdown.validate.ignoredLinks": [],

        // Validate reference links in Markdown files, for example `[link][ref]`. Requires enabling `markdown.validate.enabled`.
        "markdown.validate.referenceLinks.enabled": "warning",

        // Validate link definitions that are unused in the current file.
        "markdown.validate.unusedLinkDefinitions.enabled": "hint",

        // Controls whether the built-in PHP language suggestions are enabled. The support suggests PHP globals and variables.
        "php.suggest.basic": true,

        // Enable/disable built-in PHP validation.
        "php.validate.enable": true,

        // Points to the PHP executable.
        "php.validate.executablePath": null,

        // Whether the linter is run on save or on type.
        "php.validate.run": "onSave",

        // Enable/disable automatic closing of JSX tags.
        "javascript.autoClosingTags": true,

        // Enable/disable default JavaScript formatter.
        "javascript.format.enable": true,

        // Defines space handling after a comma delimiter.
        "javascript.format.insertSpaceAfterCommaDelimiter": true,

        // Defines space handling after the constructor keyword.
        "javascript.format.insertSpaceAfterConstructor": false,

        // Defines space handling after function keyword for anonymous functions.
        "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions":
          true,

        // Defines space handling after keywords in a control flow statement.
        "javascript.format.insertSpaceAfterKeywordsInControlFlowStatements":
          true,

        // Defines space handling after opening and before closing empty braces.
        "javascript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces":
          true,

        // Defines space handling after opening and before closing JSX expression braces.
        "javascript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces":
          false,

        // Defines space handling after opening and before closing non-empty braces.
        "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces":
          true,

        // Defines space handling after opening and before closing non-empty brackets.
        "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets":
          false,

        // Defines space handling after opening and before closing non-empty parenthesis.
        "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis":
          false,

        // Defines space handling after opening and before closing template string braces.
        "javascript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces":
          false,

        // Defines space handling after a semicolon in a for statement.
        "javascript.format.insertSpaceAfterSemicolonInForStatements": true,

        // Defines space handling after a binary operator.
        "javascript.format.insertSpaceBeforeAndAfterBinaryOperators": true,

        // Defines space handling before function argument parentheses.
        "javascript.format.insertSpaceBeforeFunctionParenthesis": false,

        // Defines whether an open brace is put onto a new line for control blocks or not.
        "javascript.format.placeOpenBraceOnNewLineForControlBlocks": false,

        // Defines whether an open brace is put onto a new line for functions or not.
        "javascript.format.placeOpenBraceOnNewLineForFunctions": false,

        // Defines handling of optional semicolons.
        //  - ignore: Don't insert or remove any semicolons.
        //  - insert: Insert semicolons at statement ends.
        //  - remove: Remove unnecessary semicolons.
        "javascript.format.semicolons": "ignore",

        // This setting has been deprecated in favor of `js/ts.implicitProjectConfig.checkJs`.
        // Enable/disable semantic checking of JavaScript files. Existing `jsconfig.json` or `tsconfig.json` files override this setting.
        "javascript.implicitProjectConfig.checkJs": false,

        // This setting has been deprecated in favor of `js/ts.implicitProjectConfig.experimentalDecorators`.
        // Enable/disable `experimentalDecorators` in JavaScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.
        "javascript.implicitProjectConfig.experimentalDecorators": false,

        // Enable/disable inlay hints for member values in enum declarations:
        // ```typescript
        //
        // enum MyValue {
        // 	A /* = 0 */;
        // 	B /* = 1 */;
        // }
        //
        // ```
        "javascript.inlayHints.enumMemberValues.enabled": false,

        // Enable/disable inlay hints for implicit return types on function signatures:
        // ```typescript
        //
        // function foo() /* :number */ {
        // 	return Date.now();
        // }
        //
        // ```
        "javascript.inlayHints.functionLikeReturnTypes.enabled": false,

        // Enable/disable inlay hints for parameter names:
        // ```typescript
        //
        // parseInt(/* str: */ '123', /* radix: */ 8)
        //
        // ```
        //  - none: Disable parameter name hints.
        //  - literals: Enable parameter name hints only for literal arguments.
        //  - all: Enable parameter name hints for literal and non-literal arguments.
        "javascript.inlayHints.parameterNames.enabled": "none",

        // Suppress parameter name hints on arguments whose text is identical to the parameter name.
        "javascript.inlayHints.parameterNames.suppressWhenArgumentMatchesName":
          true,

        // Enable/disable inlay hints for implicit parameter types:
        // ```typescript
        //
        // el.addEventListener('click', e /* :MouseEvent */ => ...)
        //
        // ```
        "javascript.inlayHints.parameterTypes.enabled": false,

        // Enable/disable inlay hints for implicit types on property declarations:
        // ```typescript
        //
        // class Foo {
        // 	prop /* :number */ = Date.now();
        // }
        //
        // ```
        "javascript.inlayHints.propertyDeclarationTypes.enabled": false,

        // Enable/disable inlay hints for implicit variable types:
        // ```typescript
        //
        // const foo /* :number */ = Date.now();
        //
        // ```
        "javascript.inlayHints.variableTypes.enabled": false,

        // Suppress type hints on variables whose name is identical to the type name. Requires using TypeScript 4.8+ in the workspace.
        "javascript.inlayHints.variableTypes.suppressWhenTypeMatchesName": true,

        // Specify glob patterns of files to exclude from auto imports. Requires using TypeScript 4.8 or newer in the workspace.
        "javascript.preferences.autoImportFileExcludePatterns": [],

        // Preferred path style for auto imports.
        //  - shortest: Prefers a non-relative import only if one is available that has fewer path segments than a relative import.
        //  - relative: Prefers a relative path to the imported file location.
        //  - non-relative: Prefers a non-relative import based on the `baseUrl` or `paths` configured in your `jsconfig.json` / `tsconfig.json`.
        //  - project-relative: Prefers a non-relative import only if the relative import path would leave the package or project directory.
        "javascript.preferences.importModuleSpecifier": "shortest",

        // Preferred path ending for auto imports.
        //  - auto: Use project settings to select a default.
        //  - minimal: Shorten `./component/index.js` to `./component`.
        //  - index: Shorten `./component/index.js` to `./component/index`.
        //  - js: Do not shorten path endings; include the `.js` extension.
        "javascript.preferences.importModuleSpecifierEnding": "auto",

        // Preferred style for JSX attribute completions.
        //  - auto: Insert `={}` or `=""` after attribute names based on the prop type. See `javascript.preferences.quoteStyle` to control the type of quotes used for string attributes.
        //  - braces: Insert `={}` after attribute names.
        //  - none: Only insert attribute names.
        "javascript.preferences.jsxAttributeCompletionStyle": "auto",

        // Preferred quote style to use for Quick Fixes.
        //  - auto: Infer quote type from existing code
        //  - single: Always use single quotes: `'`
        //  - double: Always use double quotes: `"`
        "javascript.preferences.quoteStyle": "auto",

        // The setting 'typescript.preferences.renameShorthandProperties' has been deprecated in favor of 'typescript.preferences.useAliasesForRenames'
        // Enable/disable introducing aliases for object shorthand properties during renames.
        "javascript.preferences.renameShorthandProperties": true,

        // Enable/disable introducing aliases for object shorthand properties during renames.
        "javascript.preferences.useAliasesForRenames": true,

        // Enable/disable references CodeLens in JavaScript files.
        "javascript.referencesCodeLens.enabled": false,

        // Enable/disable references CodeLens on all functions in JavaScript files.
        "javascript.referencesCodeLens.showOnAllFunctions": false,

        // Enable/disable auto import suggestions.
        "javascript.suggest.autoImports": true,

        // Enable/disable snippet completions for class members.
        "javascript.suggest.classMemberSnippets.enabled": true,

        // Complete functions with their parameter signature.
        "javascript.suggest.completeFunctionCalls": false,

        // Enable/disable suggestion to complete JSDoc comments.
        "javascript.suggest.completeJSDocs": true,

        // Enabled/disable autocomplete suggestions.
        "javascript.suggest.enabled": true,

        // Enable/disable showing completions on potentially undefined values that insert an optional chain call. Requires strict null checks to be enabled.
        "javascript.suggest.includeAutomaticOptionalChainCompletions": true,

        // Enable/disable auto-import-style completions on partially-typed import statements.
        "javascript.suggest.includeCompletionsForImportStatements": true,

        // Enable/disable generating `@returns` annotations for JSDoc templates.
        "javascript.suggest.jsdoc.generateReturns": true,

        // Enable/disable including unique names from the file in JavaScript suggestions. Note that name suggestions are always disabled in JavaScript code that is semantically checked using `@ts-check` or `checkJs`.
        "javascript.suggest.names": true,

        // Enable/disable suggestions for paths in import statements and require calls.
        "javascript.suggest.paths": true,

        // Enable/disable suggestion diagnostics for JavaScript files in the editor.
        "javascript.suggestionActions.enabled": true,

        // Enable/disable automatic updating of import paths when you rename or move a file in VS Code.
        //  - prompt: Prompt on each rename.
        //  - always: Always update paths automatically.
        //  - never: Never rename paths and don't prompt.
        "javascript.updateImportsOnFileMove.enabled": "prompt",

        // Enable/disable JavaScript validation.
        "javascript.validate.enable": true,

        // Enable/disable semantic checking of JavaScript files. Existing `jsconfig.json` or `tsconfig.json` files override this setting.
        "js/ts.implicitProjectConfig.checkJs": false,

        // Enable/disable `experimentalDecorators` in JavaScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.
        "js/ts.implicitProjectConfig.experimentalDecorators": false,

        // Sets the module system for the program. See more: https://www.typescriptlang.org/tsconfig#module.
        "js/ts.implicitProjectConfig.module": "ESNext",

        // Enable/disable [strict function types](https://www.typescriptlang.org/tsconfig#strictFunctionTypes) in JavaScript and TypeScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.
        "js/ts.implicitProjectConfig.strictFunctionTypes": true,

        // Enable/disable [strict null checks](https://www.typescriptlang.org/tsconfig#strictNullChecks) in JavaScript and TypeScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.
        "js/ts.implicitProjectConfig.strictNullChecks": true,

        // Set target JavaScript language version for emitted JavaScript and include library declarations. See more: https://www.typescriptlang.org/tsconfig#target.
        "js/ts.implicitProjectConfig.target": "ES2020",

        // Enable/disable automatic closing of JSX tags.
        "typescript.autoClosingTags": true,

        // Check if npm is installed for [Automatic Type Acquisition](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_typings-and-automatic-type-acquisition).
        "typescript.check.npmIsInstalled": true,

        // Disables [automatic type acquisition](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_typings-and-automatic-type-acquisition). Automatic type acquisition fetches `@types` packages from npm to improve IntelliSense for external libraries.
        "typescript.disableAutomaticTypeAcquisition": false,

        // Enables prompting of users to use the TypeScript version configured in the workspace for Intellisense.
        "typescript.enablePromptUseWorkspaceTsdk": false,

        // Enable/disable project-wide IntelliSense on web. Requires that VS Code is running in a trusted context.
        "typescript.experimental.tsserver.web.enableProjectWideIntellisense":
          false,

        // Enable/disable default TypeScript formatter.
        "typescript.format.enable": true,

        // Defines space handling after a comma delimiter.
        "typescript.format.insertSpaceAfterCommaDelimiter": true,

        // Defines space handling after the constructor keyword.
        "typescript.format.insertSpaceAfterConstructor": false,

        // Defines space handling after function keyword for anonymous functions.
        "typescript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions":
          true,

        // Defines space handling after keywords in a control flow statement.
        "typescript.format.insertSpaceAfterKeywordsInControlFlowStatements":
          true,

        // Defines space handling after opening and before closing empty braces.
        "typescript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces":
          true,

        // Defines space handling after opening and before closing JSX expression braces.
        "typescript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces":
          false,

        // Defines space handling after opening and before closing non-empty braces.
        "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces":
          true,

        // Defines space handling after opening and before closing non-empty brackets.
        "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets":
          false,

        // Defines space handling after opening and before closing non-empty parenthesis.
        "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis":
          false,

        // Defines space handling after opening and before closing template string braces.
        "typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces":
          false,

        // Defines space handling after a semicolon in a for statement.
        "typescript.format.insertSpaceAfterSemicolonInForStatements": true,

        // Defines space handling after type assertions in TypeScript.
        "typescript.format.insertSpaceAfterTypeAssertion": false,

        // Defines space handling after a binary operator.
        "typescript.format.insertSpaceBeforeAndAfterBinaryOperators": true,

        // Defines space handling before function argument parentheses.
        "typescript.format.insertSpaceBeforeFunctionParenthesis": false,

        // Defines whether an open brace is put onto a new line for control blocks or not.
        "typescript.format.placeOpenBraceOnNewLineForControlBlocks": false,

        // Defines whether an open brace is put onto a new line for functions or not.
        "typescript.format.placeOpenBraceOnNewLineForFunctions": false,

        // Defines handling of optional semicolons.
        //  - ignore: Don't insert or remove any semicolons.
        //  - insert: Insert semicolons at statement ends.
        //  - remove: Remove unnecessary semicolons.
        "typescript.format.semicolons": "ignore",

        // Enable/disable implementations CodeLens. This CodeLens shows the implementers of an interface.
        "typescript.implementationsCodeLens.enabled": false,

        // Enable/disable inlay hints for member values in enum declarations:
        // ```typescript
        //
        // enum MyValue {
        // 	A /* = 0 */;
        // 	B /* = 1 */;
        // }
        //
        // ```
        "typescript.inlayHints.enumMemberValues.enabled": false,

        // Enable/disable inlay hints for implicit return types on function signatures:
        // ```typescript
        //
        // function foo() /* :number */ {
        // 	return Date.now();
        // }
        //
        // ```
        "typescript.inlayHints.functionLikeReturnTypes.enabled": false,

        // Enable/disable inlay hints for parameter names:
        // ```typescript
        //
        // parseInt(/* str: */ '123', /* radix: */ 8)
        //
        // ```
        //  - none: Disable parameter name hints.
        //  - literals: Enable parameter name hints only for literal arguments.
        //  - all: Enable parameter name hints for literal and non-literal arguments.
        "typescript.inlayHints.parameterNames.enabled": "none",

        // Suppress parameter name hints on arguments whose text is identical to the parameter name.
        "typescript.inlayHints.parameterNames.suppressWhenArgumentMatchesName":
          true,

        // Enable/disable inlay hints for implicit parameter types:
        // ```typescript
        //
        // el.addEventListener('click', e /* :MouseEvent */ => ...)
        //
        // ```
        "typescript.inlayHints.parameterTypes.enabled": false,

        // Enable/disable inlay hints for implicit types on property declarations:
        // ```typescript
        //
        // class Foo {
        // 	prop /* :number */ = Date.now();
        // }
        //
        // ```
        "typescript.inlayHints.propertyDeclarationTypes.enabled": false,

        // Enable/disable inlay hints for implicit variable types:
        // ```typescript
        //
        // const foo /* :number */ = Date.now();
        //
        // ```
        "typescript.inlayHints.variableTypes.enabled": false,

        // Suppress type hints on variables whose name is identical to the type name. Requires using TypeScript 4.8+ in the workspace.
        "typescript.inlayHints.variableTypes.suppressWhenTypeMatchesName": true,

        // Sets the locale used to report JavaScript and TypeScript errors. Defaults to use VS Code's locale.
        "typescript.locale": "auto",

        // Specifies the path to the npm executable used for [Automatic Type Acquisition](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_typings-and-automatic-type-acquisition).
        "typescript.npm": "",

        // Specify glob patterns of files to exclude from auto imports. Requires using TypeScript 4.8 or newer in the workspace.
        "typescript.preferences.autoImportFileExcludePatterns": [],

        // Preferred path style for auto imports.
        //  - shortest: Prefers a non-relative import only if one is available that has fewer path segments than a relative import.
        //  - relative: Prefers a relative path to the imported file location.
        //  - non-relative: Prefers a non-relative import based on the `baseUrl` or `paths` configured in your `jsconfig.json` / `tsconfig.json`.
        //  - project-relative: Prefers a non-relative import only if the relative import path would leave the package or project directory.
        "typescript.preferences.importModuleSpecifier": "shortest",

        // Preferred path ending for auto imports.
        //  - auto: Use project settings to select a default.
        //  - minimal: Shorten `./component/index.js` to `./component`.
        //  - index: Shorten `./component/index.js` to `./component/index`.
        //  - js: Do not shorten path endings; include the `.js` extension.
        "typescript.preferences.importModuleSpecifierEnding": "auto",

        // Enable/disable searching `package.json` dependencies for available auto imports.
        //  - auto: Search dependencies based on estimated performance impact.
        //  - on: Always search dependencies.
        //  - off: Never search dependencies.
        "typescript.preferences.includePackageJsonAutoImports": "auto",

        // Preferred style for JSX attribute completions.
        //  - auto: Insert `={}` or `=""` after attribute names based on the prop type. See `typescript.preferences.quoteStyle` to control the type of quotes used for string attributes.
        //  - braces: Insert `={}` after attribute names.
        //  - none: Only insert attribute names.
        "typescript.preferences.jsxAttributeCompletionStyle": "auto",

        // Preferred quote style to use for Quick Fixes.
        //  - auto: Infer quote type from existing code
        //  - single: Always use single quotes: `'`
        //  - double: Always use double quotes: `"`
        "typescript.preferences.quoteStyle": "auto",

        // The setting 'typescript.preferences.renameShorthandProperties' has been deprecated in favor of 'typescript.preferences.useAliasesForRenames'
        // Enable/disable introducing aliases for object shorthand properties during renames.
        "typescript.preferences.renameShorthandProperties": true,

        // Enable/disable introducing aliases for object shorthand properties during renames.
        "typescript.preferences.useAliasesForRenames": true,

        // Enable/disable references CodeLens in TypeScript files.
        "typescript.referencesCodeLens.enabled": false,

        // Enable/disable references CodeLens on all functions in TypeScript files.
        "typescript.referencesCodeLens.showOnAllFunctions": false,

        // Report style checks as warnings.
        "typescript.reportStyleChecksAsWarnings": true,

        // Enable/disable auto import suggestions.
        "typescript.suggest.autoImports": true,

        // Enable/disable snippet completions for class members.
        "typescript.suggest.classMemberSnippets.enabled": true,

        // Complete functions with their parameter signature.
        "typescript.suggest.completeFunctionCalls": false,

        // Enable/disable suggestion to complete JSDoc comments.
        "typescript.suggest.completeJSDocs": true,

        // Enabled/disable autocomplete suggestions.
        "typescript.suggest.enabled": true,

        // Enable/disable showing completions on potentially undefined values that insert an optional chain call. Requires strict null checks to be enabled.
        "typescript.suggest.includeAutomaticOptionalChainCompletions": true,

        // Enable/disable auto-import-style completions on partially-typed import statements.
        "typescript.suggest.includeCompletionsForImportStatements": true,

        // Enable/disable generating `@returns` annotations for JSDoc templates.
        "typescript.suggest.jsdoc.generateReturns": true,

        // Enable/disable snippet completions for methods in object literals. Requires using TypeScript 4.7+ in the workspace.
        "typescript.suggest.objectLiteralMethodSnippets.enabled": true,

        // Enable/disable suggestions for paths in import statements and require calls.
        "typescript.suggest.paths": true,

        // Enable/disable suggestion diagnostics for TypeScript files in the editor.
        "typescript.suggestionActions.enabled": true,

        // Enabled/disable occasional surveys that help us improve VS Code's JavaScript and TypeScript support.
        "typescript.surveys.enabled": true,

        // Controls auto detection of tsc tasks.
        //  - on: Create both build and watch tasks.
        //  - off: Disable this feature.
        //  - build: Only create single run compile tasks.
        //  - watch: Only create compile and watch tasks.
        "typescript.tsc.autoDetect": "on",

        // Specifies the folder path to the tsserver and `lib*.d.ts` files under a TypeScript install to use for IntelliSense, for example: `./node_modules/typescript/lib`.
        //
        // - When specified as a user setting, the TypeScript version from `typescript.tsdk` automatically replaces the built-in TypeScript version.
        // - When specified as a workspace setting, `typescript.tsdk` allows you to switch to use that workspace version of TypeScript for IntelliSense with the `TypeScript: Select TypeScript version` command.
        //
        // See the [TypeScript documentation](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-newer-typescript-versions) for more detail about managing TypeScript versions.
        "typescript.tsdk": "",

        // Enables tracing TS server performance to a directory. These trace files can be used to diagnose TS Server performance issues. The log may contain file paths, source code, and other potentially sensitive information from your project.
        "typescript.tsserver.enableTracing": false,

        // (Experimental) Enables project wide error reporting.
        "typescript.tsserver.experimental.enableProjectDiagnostics": false,

        // Enables logging of the TS server to a file. This log can be used to diagnose TS Server issues. The log may contain file paths, source code, and other potentially sensitive information from your project.
        "typescript.tsserver.log": "off",

        // The maximum amount of memory (in MB) to allocate to the TypeScript server process.
        "typescript.tsserver.maxTsServerMemory": 3072,

        // Additional paths to discover TypeScript Language Service plugins.
        "typescript.tsserver.pluginPaths": [],

        // Enables tracing of messages sent to the TS server. This trace can be used to diagnose TS Server issues. The trace may contain file paths, source code, and other potentially sensitive information from your project.
        "typescript.tsserver.trace": "off",

        // This setting has been deprecated in favor of `typescript.tsserver.useSyntaxServer`.
        // Enable/disable spawning a separate TypeScript server that can more quickly respond to syntax related operations, such as calculating folding or computing document symbols.
        "typescript.tsserver.useSeparateSyntaxServer": true,

        // Controls if TypeScript launches a dedicated server to more quickly handle syntax related operations, such as computing code folding.
        //  - always: Use a lighter weight syntax server to handle all IntelliSense operations. This syntax server can only provide IntelliSense for opened files.
        //  - never: Don't use a dedicated syntax server. Use a single server to handle all IntelliSense operations.
        //  - auto: Spawn both a full server and a lighter weight server dedicated to syntax operations. The syntax server is used to speed up syntax operations and provide IntelliSense while projects are loading.
        "typescript.tsserver.useSyntaxServer": "auto",

        // Configure which watching strategies should be used to keep track of files and directories.
        "typescript.tsserver.watchOptions": {},

        // Enable/disable automatic updating of import paths when you rename or move a file in VS Code.
        //  - prompt: Prompt on each rename.
        //  - always: Always update paths automatically.
        //  - never: Never rename paths and don't prompt.
        "typescript.updateImportsOnFileMove.enabled": "prompt",

        // Enable/disable TypeScript validation.
        "typescript.validate.enable": true,

        // Controls which files are searched by [Go to Symbol in Workspace](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name).
        //  - allOpenProjects: Search all open JavaScript or TypeScript projects for symbols.
        //  - currentProject: Only search for symbols in the current JavaScript or TypeScript project.
        "typescript.workspaceSymbols.scope": "allOpenProjects",

        // Always reveal the executed test when `testing.followRunningTest` is on. If this setting is turned off, only failed tests will be revealed.
        "testing.alwaysRevealTestOnStateChange": false,

        // Configures when the error Peek view is automatically opened.
        //  - failureAnywhere: Open automatically no matter where the failure is.
        //  - failureInVisibleDocument: Open automatically when a test fails in a visible document.
        //  - never: Never automatically open.
        "testing.automaticallyOpenPeekView": "failureInVisibleDocument",

        // Controls whether to automatically open the Peek view during continuous run mode.
        "testing.automaticallyOpenPeekViewDuringAutoRun": false,

        // How long to wait, in milliseconds, after a test is marked as outdated and starting a new run.
        "testing.autoRun.delay": 1000,

        // Controls the action to take when left-clicking on a test decoration in the gutter.
        //  - run: Run the test.
        //  - debug: Debug the test.
        //  - contextMenu: Open the context menu for more options.
        "testing.defaultGutterClickAction": "run",

        // Controls whether the running test should be followed in the Test Explorer view.
        "testing.followRunningTest": true,

        // Controls whether test decorations are shown in the editor gutter.
        "testing.gutterEnabled": true,

        // Controls when the testing view should open.
        //  - neverOpen: Never automatically open the testing view
        //  - openOnTestStart: Open the testing view when tests start
        //  - openOnTestFailure: Open the testing view on any test failure
        "testing.openTesting": "openOnTestStart",

        // Control whether save all dirty editors before running a test.
        "testing.saveBeforeTest": true,

        // Insert semicolon at end of line when completing CSS properties.
        "css.completion.completePropertyWithSemicolon": true,

        // By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.
        "css.completion.triggerPropertyValueCompletion": true,

        // A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-css-languageservice/blob/master/docs/customData.md).
        //
        // VS Code loads custom data on startup to enhance its CSS support for the custom CSS properties, at directives, pseudo classes and pseudo elements you specify in the JSON files.
        //
        // The file paths are relative to workspace and only workspace folder settings are considered.
        "css.customData": [],

        // Put braces on the same line as rules (`collapse`) or put braces on own line (`expand`).
        "css.format.braceStyle": "collapse",

        // Enable/disable default CSS formatter.
        "css.format.enable": true,

        // Maximum number of line breaks to be preserved in one chunk, when `css.format.preserveNewLines` is enabled.
        "css.format.maxPreserveNewLines": null,

        // Separate rulesets by a blank line.
        "css.format.newlineBetweenRules": true,

        // Separate selectors with a new line.
        "css.format.newlineBetweenSelectors": true,

        // Whether existing line breaks before elements should be preserved.
        "css.format.preserveNewLines": true,

        // Ensure a space character around selector separators '>', '+', '~' (e.g. `a > b`).
        "css.format.spaceAroundSelectorSeparator": false,

        // Show tag and attribute documentation in CSS hovers.
        "css.hover.documentation": true,

        // Show references to MDN in CSS hovers.
        "css.hover.references": true,

        // Invalid number of parameters.
        "css.lint.argumentsInColorFunction": "error",

        // Do not use `width` or `height` when using `padding` or `border`.
        "css.lint.boxModel": "ignore",

        // When using a vendor-specific prefix make sure to also include all other vendor-specific properties.
        "css.lint.compatibleVendorPrefixes": "ignore",

        // Do not use duplicate style definitions.
        "css.lint.duplicateProperties": "ignore",

        // Do not use empty rulesets.
        "css.lint.emptyRules": "warning",

        // Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.
        "css.lint.float": "ignore",

        // `@font-face` rule must define `src` and `font-family` properties.
        "css.lint.fontFaceProperties": "warning",

        // Hex colors must consist of three or six hex numbers.
        "css.lint.hexColorLength": "error",

        // Selectors should not contain IDs because these rules are too tightly coupled with the HTML.
        "css.lint.idSelector": "ignore",

        // IE hacks are only necessary when supporting IE7 and older.
        "css.lint.ieHack": "ignore",

        // Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.
        "css.lint.important": "ignore",

        // Import statements do not load in parallel.
        "css.lint.importStatement": "ignore",

        // Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.
        "css.lint.propertyIgnoredDueToDisplay": "warning",

        // The universal selector (`*`) is known to be slow.
        "css.lint.universalSelector": "ignore",

        // Unknown at-rule.
        "css.lint.unknownAtRules": "warning",

        // Unknown property.
        "css.lint.unknownProperties": "warning",

        // Unknown vendor specific property.
        "css.lint.unknownVendorSpecificProperties": "ignore",

        // A list of properties that are not validated against the `unknownProperties` rule.
        "css.lint.validProperties": [],

        // When using a vendor-specific prefix, also include the standard property.
        "css.lint.vendorPrefix": "warning",

        // No unit for zero needed.
        "css.lint.zeroUnits": "ignore",

        // Traces the communication between VS Code and the CSS language server.
        "css.trace.server": "off",

        // Enables or disables all validations.
        "css.validate": true,

        // Insert semicolon at end of line when completing CSS properties.
        "less.completion.completePropertyWithSemicolon": true,

        // By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.
        "less.completion.triggerPropertyValueCompletion": true,

        // Put braces on the same line as rules (`collapse`) or put braces on own line (`expand`).
        "less.format.braceStyle": "collapse",

        // Enable/disable default LESS formatter.
        "less.format.enable": true,

        // Maximum number of line breaks to be preserved in one chunk, when `less.format.preserveNewLines` is enabled.
        "less.format.maxPreserveNewLines": null,

        // Separate rulesets by a blank line.
        "less.format.newlineBetweenRules": true,

        // Separate selectors with a new line.
        "less.format.newlineBetweenSelectors": true,

        // Whether existing line breaks before elements should be preserved.
        "less.format.preserveNewLines": true,

        // Ensure a space character around selector separators '>', '+', '~' (e.g. `a > b`).
        "less.format.spaceAroundSelectorSeparator": false,

        // Show tag and attribute documentation in LESS hovers.
        "less.hover.documentation": true,

        // Show references to MDN in LESS hovers.
        "less.hover.references": true,

        // Invalid number of parameters.
        "less.lint.argumentsInColorFunction": "error",

        // Do not use `width` or `height` when using `padding` or `border`.
        "less.lint.boxModel": "ignore",

        // When using a vendor-specific prefix make sure to also include all other vendor-specific properties.
        "less.lint.compatibleVendorPrefixes": "ignore",

        // Do not use duplicate style definitions.
        "less.lint.duplicateProperties": "ignore",

        // Do not use empty rulesets.
        "less.lint.emptyRules": "warning",

        // Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.
        "less.lint.float": "ignore",

        // `@font-face` rule must define `src` and `font-family` properties.
        "less.lint.fontFaceProperties": "warning",

        // Hex colors must consist of three or six hex numbers.
        "less.lint.hexColorLength": "error",

        // Selectors should not contain IDs because these rules are too tightly coupled with the HTML.
        "less.lint.idSelector": "ignore",

        // IE hacks are only necessary when supporting IE7 and older.
        "less.lint.ieHack": "ignore",

        // Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.
        "less.lint.important": "ignore",

        // Import statements do not load in parallel.
        "less.lint.importStatement": "ignore",

        // Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.
        "less.lint.propertyIgnoredDueToDisplay": "warning",

        // The universal selector (`*`) is known to be slow.
        "less.lint.universalSelector": "ignore",

        // Unknown at-rule.
        "less.lint.unknownAtRules": "warning",

        // Unknown property.
        "less.lint.unknownProperties": "warning",

        // Unknown vendor specific property.
        "less.lint.unknownVendorSpecificProperties": "ignore",

        // A list of properties that are not validated against the `unknownProperties` rule.
        "less.lint.validProperties": [],

        // When using a vendor-specific prefix, also include the standard property.
        "less.lint.vendorPrefix": "warning",

        // No unit for zero needed.
        "less.lint.zeroUnits": "ignore",

        // Enables or disables all validations.
        "less.validate": true,

        // Insert semicolon at end of line when completing CSS properties.
        "scss.completion.completePropertyWithSemicolon": true,

        // By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.
        "scss.completion.triggerPropertyValueCompletion": true,

        // Put braces on the same line as rules (`collapse`) or put braces on own line (`expand`).
        "scss.format.braceStyle": "collapse",

        // Enable/disable default SCSS formatter.
        "scss.format.enable": true,

        // Maximum number of line breaks to be preserved in one chunk, when `scss.format.preserveNewLines` is enabled.
        "scss.format.maxPreserveNewLines": null,

        // Separate rulesets by a blank line.
        "scss.format.newlineBetweenRules": true,

        // Separate selectors with a new line.
        "scss.format.newlineBetweenSelectors": true,

        // Whether existing line breaks before elements should be preserved.
        "scss.format.preserveNewLines": true,

        // Ensure a space character around selector separators '>', '+', '~' (e.g. `a > b`).
        "scss.format.spaceAroundSelectorSeparator": false,

        // Show tag and attribute documentation in SCSS hovers.
        "scss.hover.documentation": true,

        // Show references to MDN in SCSS hovers.
        "scss.hover.references": true,

        // Invalid number of parameters.
        "scss.lint.argumentsInColorFunction": "error",

        // Do not use `width` or `height` when using `padding` or `border`.
        "scss.lint.boxModel": "ignore",

        // When using a vendor-specific prefix make sure to also include all other vendor-specific properties.
        "scss.lint.compatibleVendorPrefixes": "ignore",

        // Do not use duplicate style definitions.
        "scss.lint.duplicateProperties": "ignore",

        // Do not use empty rulesets.
        "scss.lint.emptyRules": "warning",

        // Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.
        "scss.lint.float": "ignore",

        // `@font-face` rule must define `src` and `font-family` properties.
        "scss.lint.fontFaceProperties": "warning",

        // Hex colors must consist of three or six hex numbers.
        "scss.lint.hexColorLength": "error",

        // Selectors should not contain IDs because these rules are too tightly coupled with the HTML.
        "scss.lint.idSelector": "ignore",

        // IE hacks are only necessary when supporting IE7 and older.
        "scss.lint.ieHack": "ignore",

        // Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.
        "scss.lint.important": "ignore",

        // Import statements do not load in parallel.
        "scss.lint.importStatement": "ignore",

        // Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.
        "scss.lint.propertyIgnoredDueToDisplay": "warning",

        // The universal selector (`*`) is known to be slow.
        "scss.lint.universalSelector": "ignore",

        // Unknown at-rule.
        "scss.lint.unknownAtRules": "warning",

        // Unknown property.
        "scss.lint.unknownProperties": "warning",

        // Unknown vendor specific property.
        "scss.lint.unknownVendorSpecificProperties": "ignore",

        // A list of properties that are not validated against the `unknownProperties` rule.
        "scss.lint.validProperties": [],

        // When using a vendor-specific prefix, also include the standard property.
        "scss.lint.vendorPrefix": "warning",

        // No unit for zero needed.
        "scss.lint.zeroUnits": "ignore",

        // Enables or disables all validations.
        "scss.validate": true,

        // When enabled, automatically checks extensions for updates. If an extension has an update, it is marked as outdated in the Extensions view. The updates are fetched from a Microsoft online service.
        "extensions.autoCheckUpdates": true,

        // Controls the automatic update behavior of extensions. The updates are fetched from a Microsoft online service.
        //  - true: Download and install updates automatically for all extensions except for those updates are ignored.
        //  - onlyEnabledExtensions: Download and install updates automatically only for enabled extensions except for those updates are ignored. Disabled extensions are not updated automatically.
        //  - false: Extensions are not automatically updated.
        "extensions.autoUpdate": true,

        // When enabled, editors with extension details will be automatically closed upon navigating away from the Extensions View.
        "extensions.closeExtensionDetailsOnViewChange": false,

        // When an extension is listed here, a confirmation prompt will not be shown when that extension handles a URI.
        "extensions.confirmedUriHandlerExtensionIds": [],

        // Configure an extension to execute in a different extension host process.
        "extensions.experimental.affinity": {},

        // When enabled, the extension host will be launched using the new UtilityProcess Electron API.
        "extensions.experimental.useUtilityProcess": true,

        // When enabled, the notifications for extension recommendations will not be shown.
        "extensions.ignoreRecommendations": false,

        // This setting is deprecated. Use extensions.ignoreRecommendations setting to control recommendation notifications. Use Extensions view's visibility actions to hide Recommended view by default.
        //
        "extensions.showRecommendationsOnlyOnDemand": false,

        // Override the untrusted workspace support of an extension. Extensions using `true` will always be enabled. Extensions using `limited` will always be enabled, and the extension will hide functionality that requires trust. Extensions using `false` will only be enabled only when the workspace is trusted.
        "extensions.supportUntrustedWorkspaces": {},

        // Override the virtual workspaces support of an extension.
        "extensions.supportVirtualWorkspaces": {},

        // Enable web worker extension host.
        //  - true: The Web Worker Extension Host will always be launched.
        //  - false: The Web Worker Extension Host will never be launched.
        //  - auto: The Web Worker Extension Host will be launched when a web extension needs it.
        "extensions.webWorker": "auto",

        // Enable/disable the ability of smart scrolling in the output view. Smart scrolling allows you to lock scrolling automatically when you click in the output view and unlocks when you click in the last line.
        "output.smartScroll.enabled": true,

        // List of extensions to be ignored while synchronizing. The identifier of an extension is always `${publisher}.${name}`. For example: `vscode.csharp`.
        "settingsSync.ignoredExtensions": [],

        // Configure settings to be ignored while synchronizing.
        "settingsSync.ignoredSettings": [],

        // Synchronize keybindings for each platform.
        "settingsSync.keybindingsPerPlatform": true,

        // Controls whether code cells in the interactive window are collapsed by default.
        "interactiveWindow.collapseCellInputCode": "fromEditor",

        // When enabled notebook breadcrumbs contain code cells.
        "notebook.breadcrumbs.showCodeCells": true,

        // Controls where the focus indicator is rendered, either along the cell borders or on the left gutter.
        "notebook.cellFocusIndicator": "gutter",

        // Where the cell toolbar should be shown, or whether it should be hidden.
        "notebook.cellToolbarLocation": {
          default: "right",
        },

        // Whether the cell toolbar should appear on hover or click.
        "notebook.cellToolbarVisibility": "click",

        // Control whether the notebook editor should be rendered in a compact form. For example, when turned on, it will decrease the left margin width.
        "notebook.compactView": true,

        // Control whether outputs action should be rendered in the output toolbar.
        "notebook.consolidatedOutputButton": true,

        // Control whether extra actions are shown in a dropdown next to the run button.
        "notebook.consolidatedRunButton": false,

        // Whether to use the enhanced text diff editor for notebook.
        "notebook.diff.enablePreview": true,

        // Hide Metadata Differences
        "notebook.diff.ignoreMetadata": false,

        // Hide Outputs Differences
        "notebook.diff.ignoreOutputs": false,

        // Priority list for output mime types
        "notebook.displayOrder": [],

        // Control whether the notebook editor should allow moving cells through drag and drop.
        "notebook.dragAndDropEnabled": true,

        // Settings for code editors used in notebooks. This can be used to customize most editor.* settings.
        "notebook.editorOptionsCustomizations": {},

        // Use a scrollable region for notebook output when longer than the limit
        "notebook.experimental.outputScrolling": false,

        // Control whether to render a global toolbar inside the notebook editor.
        "notebook.globalToolbar": true,

        // Control whether the actions on the notebook toolbar should render label or not.
        "notebook.globalToolbarShowLabel": "always",

        // Control where the insert cell actions should appear.
        //  - betweenCells: A toolbar that appears on hover between cells.
        //  - notebookToolbar: The toolbar at the top of the notebook editor.
        //  - both: Both toolbars.
        //  - hidden: The insert actions don't appear anywhere.
        "notebook.insertToolbarLocation": "both",

        // Controls the type of kernel picker to use.
        //  - all: Show all kernels.
        //  - mru: Experiment: show recently used kernels.
        "notebook.kernelPicker.type": "all",

        // Controls the display of line numbers in the cell editor.
        "notebook.lineNumbers": "off",

        // Enable logging for notebook support.
        "notebook.logging": false,

        // Controls the font size in pixels of rendered markup in notebooks. When set to `0`, 120% of `editor.fontSize` is used.
        "notebook.markup.fontSize": 0,

        // When enabled cursor can navigate to the next/previous cell when the current cursor in the cell editor is at the first/last line.
        "notebook.navigation.allowNavigateToSurroundingCells": true,

        // When enabled notebook outline shows code cells.
        "notebook.outline.showCodeCells": false,

        // Control how many lines of text in a text output is rendered.
        "notebook.output.textLineLimit": 30,

        // The font family for the output text for notebook cells. When set to empty, the `editor.fontFamily` is used.
        "notebook.outputFontFamily": "",

        // Font size for the output text for notebook cells. When set to 0, `editor.fontSize` is used.
        "notebook.outputFontSize": 0,

        // Line height of the output text for notebook cells.
        //  - Values between 0 and 8 will be used as a multiplier with the font size.
        //  - Values greater than or equal to 8 will be used as effective values.
        "notebook.outputLineHeight": 19,

        // Whether the cell status bar should be shown.
        //  - hidden: The cell Status bar is always hidden.
        //  - visible: The cell Status bar is always visible.
        //  - visibleAfterExecute: The cell Status bar is hidden until the cell has executed. Then it becomes visible to show the execution status.
        "notebook.showCellStatusBar": "visible",

        // Controls when the Markdown header folding arrow is shown.
        //  - always: The folding controls are always visible.
        //  - never: Never show the folding controls and reduce the gutter size.
        //  - mouseover: The folding controls are visible only on mouseover.
        "notebook.showFoldingControls": "mouseover",

        // Whether to use separate undo/redo stack for each cell.
        "notebook.undoRedoPerCell": true,

        // Automatically scroll the interactive window to show the output of the last statement executed. If this value is false, the window will only scroll if the last cell was already the one scrolled to.
        "interactiveWindow.alwaysScrollOnNewCell": true,

        // Controls whether the Interactive Window sessions/history should be restored across window reloads. Whether the state of controllers used in Interactive Windows is persisted across window reloads are controlled by extensions contributing controllers.
        "interactiveWindow.restore": false,

        // When enabled slow renderers are automatically profiled
        "application.experimental.rendererProfiling": false,

        // Controls the timeout in seconds before giving up resolving the shell environment when the application is not already launched from a terminal. See our [documentation](https://go.microsoft.com/fwlink/?linkid=2149667) for more information.
        "application.shellEnvironmentResolutionTimeout": 10,

        // When opening a file from the Explorer in a terminal, determines what kind of terminal will be launched
        //  - integrated: Use VS Code's integrated terminal.
        //  - external: Use the configured external terminal.
        "terminal.explorerKind": "integrated",

        // Customizes which terminal to run on Linux.
        "terminal.external.linuxExec": "xterm",

        // Customizes which terminal application to run on macOS.
        "terminal.external.osxExec": "Terminal.app",

        // Customizes which terminal to run on Windows.
        "terminal.external.windowsExec": "C:\\Windows\\System32\\cmd.exe",

        // Whether or not to allow chord keybindings in the terminal. Note that when this is true and the keystroke results in a chord it will bypass `terminal.integrated.commandsToSkipShell`, setting this to false is particularly useful when you want ctrl+k to go to your shell (not VS Code).
        "terminal.integrated.allowChords": true,

        // Whether to allow menubar mnemonics (for example Alt+F) to trigger the open of the menubar. Note that this will cause all alt keystrokes to skip the shell when true. This does nothing on macOS.
        "terminal.integrated.allowMnemonics": false,

        // If enabled, alt/option + click will reposition the prompt cursor to underneath the mouse when `editor.multiCursorModifier` is set to `'alt'` (the default value). This may not work reliably depending on your shell.
        "terminal.integrated.altClickMovesCursor": true,

        // The terminal profile to use on Linux for automation-related terminal usage like tasks and debug. This setting will currently be ignored if `terminal.integrated.automationShell.linux` (now deprecated) is set.
        "terminal.integrated.automationProfile.linux": null,

        // The terminal profile to use on macOS for automation-related terminal usage like tasks and debug. This setting will currently be ignored if `terminal.integrated.automationShell.osx` (now deprecated) is set.
        "terminal.integrated.automationProfile.osx": null,

        // The terminal profile to use for automation-related terminal usage like tasks and debug. This setting will currently be ignored if `terminal.integrated.automationShell.windows` (now deprecated) is set.
        "terminal.integrated.automationProfile.windows": null,

        // This is deprecated, the new recommended way to configure your automation shell is by creating a terminal automation profile with `terminal.integrated.automationProfile.linux`. This will currently take priority over the new automation profile settings but that will change in the future.
        // A path that when set will override `terminal.integrated.shell.linux` and ignore `shellArgs` values for automation-related terminal usage like tasks and debug.
        "terminal.integrated.automationShell.linux": null,

        // This is deprecated, the new recommended way to configure your automation shell is by creating a terminal automation profile with `terminal.integrated.automationProfile.osx`. This will currently take priority over the new automation profile settings but that will change in the future.
        // A path that when set will override `terminal.integrated.shell.osx` and ignore `shellArgs` values for automation-related terminal usage like tasks and debug.
        "terminal.integrated.automationShell.osx": null,

        // This is deprecated, the new recommended way to configure your automation shell is by creating a terminal automation profile with `terminal.integrated.automationProfile.windows`. This will currently take priority over the new automation profile settings but that will change in the future.
        // A path that when set will override `terminal.integrated.shell.windows` and ignore `shellArgs` values for automation-related terminal usage like tasks and debug.
        "terminal.integrated.automationShell.windows": null,

        // A set of messages that, when encountered in the terminal, will be automatically responded to. Provided the message is specific enough, this can help automate away common responses.
        //
        // Remarks:
        //
        // - Use `"Terminate batch job (Y/N)": "Y\r"` to automatically respond to the terminate batch job prompt on Windows.
        // - The message includes escape sequences so the reply might not happen with styled text.
        // - Each reply can only happen once every second.
        // - Use `"\r"` in the reply to mean the enter key.
        // - To unset a default key, set the value to null.
        // - Restart VS Code if new don't apply.
        "terminal.integrated.autoReplies": {},

        // The number of milliseconds to show the bell within a terminal tab when triggered.
        "terminal.integrated.bellDuration": 1000,

        // A set of command IDs whose keybindings will not be sent to the shell but instead always be handled by VS Code. This allows keybindings that would normally be consumed by the shell to act instead the same as when the terminal is not focused, for example `Ctrl+P` to launch Quick Open.
        //
        // &nbsp;
        //
        // Many commands are skipped by default. To override a default and pass that command's keybinding to the shell instead, add the command prefixed with the `-` character. For example add `-workbench.action.quickOpen` to allow `Ctrl+P` to reach the shell.
        //
        // &nbsp;
        //
        // The following list of default skipped commands is truncated when viewed in Settings Editor. To see the full list, [open the default settings JSON](command:workbench.action.openRawDefaultSettings 'Open Default Settings (JSON)') and search for the first command from the list below.
        //
        // &nbsp;
        //
        // Default Skipped Commands:
        //
        // - editor.action.toggleTabFocusMode
        // - notifications.hideList
        // - notifications.hideToasts
        // - workbench.action.closeQuickOpen
        // - workbench.action.debug.continue
        // - workbench.action.debug.pause
        // - workbench.action.debug.restart
        // - workbench.action.debug.run
        // - workbench.action.debug.start
        // - workbench.action.debug.stepInto
        // - workbench.action.debug.stepOut
        // - workbench.action.debug.stepOver
        // - workbench.action.debug.stop
        // - workbench.action.firstEditorInGroup
        // - workbench.action.focusActiveEditorGroup
        // - workbench.action.focusEighthEditorGroup
        // - workbench.action.focusFifthEditorGroup
        // - workbench.action.focusFirstEditorGroup
        // - workbench.action.focusFourthEditorGroup
        // - workbench.action.focusLastEditorGroup
        // - workbench.action.focusNextPart
        // - workbench.action.focusPreviousPart
        // - workbench.action.focusSecondEditorGroup
        // - workbench.action.focusSeventhEditorGroup
        // - workbench.action.focusSixthEditorGroup
        // - workbench.action.focusThirdEditorGroup
        // - workbench.action.lastEditorInGroup
        // - workbench.action.navigateDown
        // - workbench.action.navigateLeft
        // - workbench.action.navigateRight
        // - workbench.action.navigateUp
        // - workbench.action.nextEditor
        // - workbench.action.nextEditorInGroup
        // - workbench.action.nextPanelView
        // - workbench.action.nextSideBarView
        // - workbench.action.openNextRecentlyUsedEditor
        // - workbench.action.openNextRecentlyUsedEditorInGroup
        // - workbench.action.openPreviousRecentlyUsedEditor
        // - workbench.action.openPreviousRecentlyUsedEditorInGroup
        // - workbench.action.previousEditor
        // - workbench.action.previousEditorInGroup
        // - workbench.action.previousPanelView
        // - workbench.action.previousSideBarView
        // - workbench.action.quickOpen
        // - workbench.action.quickOpenLeastRecentlyUsedEditor
        // - workbench.action.quickOpenLeastRecentlyUsedEditorInGroup
        // - workbench.action.quickOpenPreviousEditor
        // - workbench.action.quickOpenPreviousRecentlyUsedEditor
        // - workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup
        // - workbench.action.quickOpenView
        // - workbench.action.showCommands
        // - workbench.action.tasks.build
        // - workbench.action.tasks.reRunTask
        // - workbench.action.tasks.restartTask
        // - workbench.action.tasks.runTask
        // - workbench.action.tasks.showLog
        // - workbench.action.tasks.showTasks
        // - workbench.action.tasks.terminate
        // - workbench.action.tasks.test
        // - workbench.action.terminal.acceptSelectedSuggestion
        // - workbench.action.terminal.clear
        // - workbench.action.terminal.clearSelection
        // - workbench.action.terminal.copyAndClearSelection
        // - workbench.action.terminal.copyLastCommandOutput
        // - workbench.action.terminal.copySelection
        // - workbench.action.terminal.copySelectionAsHtml
        // - workbench.action.terminal.deleteToLineStart
        // - workbench.action.terminal.deleteWordLeft
        // - workbench.action.terminal.deleteWordRight
        // - workbench.action.terminal.findNext
        // - workbench.action.terminal.findPrevious
        // - workbench.action.terminal.focus
        // - workbench.action.terminal.focusAtIndex1
        // - workbench.action.terminal.focusAtIndex2
        // - workbench.action.terminal.focusAtIndex3
        // - workbench.action.terminal.focusAtIndex4
        // - workbench.action.terminal.focusAtIndex5
        // - workbench.action.terminal.focusAtIndex6
        // - workbench.action.terminal.focusAtIndex7
        // - workbench.action.terminal.focusAtIndex8
        // - workbench.action.terminal.focusAtIndex9
        // - workbench.action.terminal.focusFind
        // - workbench.action.terminal.focusNext
        // - workbench.action.terminal.focusNextPane
        // - workbench.action.terminal.focusPrevious
        // - workbench.action.terminal.focusPreviousPane
        // - workbench.action.terminal.goToRecentDirectory
        // - workbench.action.terminal.hideFind
        // - workbench.action.terminal.hideSuggestWidget
        // - workbench.action.terminal.kill
        // - workbench.action.terminal.killEditor
        // - workbench.action.terminal.moveToEditor
        // - workbench.action.terminal.moveToLineEnd
        // - workbench.action.terminal.moveToLineStart
        // - workbench.action.terminal.moveToTerminalPanel
        // - workbench.action.terminal.navigationModeExit
        // - workbench.action.terminal.navigationModeFocusNext
        // - workbench.action.terminal.navigationModeFocusPrevious
        // - workbench.action.terminal.new
        // - workbench.action.terminal.newInActiveWorkspace
        // - workbench.action.terminal.paste
        // - workbench.action.terminal.pasteSelection
        // - workbench.action.terminal.quickFix
        // - workbench.action.terminal.resizePaneDown
        // - workbench.action.terminal.resizePaneLeft
        // - workbench.action.terminal.resizePaneRight
        // - workbench.action.terminal.resizePaneUp
        // - workbench.action.terminal.runActiveFile
        // - workbench.action.terminal.runRecentCommand
        // - workbench.action.terminal.runSelectedText
        // - workbench.action.terminal.scrollDown
        // - workbench.action.terminal.scrollDownPage
        // - workbench.action.terminal.scrollToBottom
        // - workbench.action.terminal.scrollToNextCommand
        // - workbench.action.terminal.scrollToPreviousCommand
        // - workbench.action.terminal.scrollToTop
        // - workbench.action.terminal.scrollUp
        // - workbench.action.terminal.scrollUpPage
        // - workbench.action.terminal.selectAll
        // - workbench.action.terminal.selectNextPageSuggestion
        // - workbench.action.terminal.selectNextSuggestion
        // - workbench.action.terminal.selectPrevPageSuggestion
        // - workbench.action.terminal.selectPrevSuggestion
        // - workbench.action.terminal.selectToNextCommand
        // - workbench.action.terminal.selectToNextLine
        // - workbench.action.terminal.selectToPreviousCommand
        // - workbench.action.terminal.selectToPreviousLine
        // - workbench.action.terminal.sendSequence
        // - workbench.action.terminal.showAccessibilityHelp
        // - workbench.action.terminal.sizeToContentWidth
        // - workbench.action.terminal.split
        // - workbench.action.terminal.splitInActiveWorkspace
        // - workbench.action.terminal.toggleFindCaseSensitive
        // - workbench.action.terminal.toggleFindRegex
        // - workbench.action.terminal.toggleFindWholeWord
        // - workbench.action.terminal.toggleTerminal
        // - workbench.action.toggleFullScreen
        // - workbench.action.toggleMaximizedPanel
        // - workbench.action.togglePanel
        "terminal.integrated.commandsToSkipShell": [],

        // Controls whether to confirm when the window closes if there are active terminal sessions.
        //  - never: Never confirm.
        //  - always: Always confirm if there are terminals.
        //  - hasChildProcesses: Confirm if there are any terminals that have child processes.
        "terminal.integrated.confirmOnExit": "never",

        // Controls whether to confirm killing terminals when they have child processes. When set to editor, terminals in the editor area will be marked as changed when they have child processes. Note that child process detection may not work well for shells like Git Bash which don't run their processes as child processes of the shell.
        //  - never: Never confirm.
        //  - editor: Confirm if the terminal is in the editor.
        //  - panel: Confirm if the terminal is in the panel.
        //  - always: Confirm if the terminal is either in the editor or panel.
        "terminal.integrated.confirmOnKill": "editor",

        // Controls whether text selected in the terminal will be copied to the clipboard.
        "terminal.integrated.copyOnSelection": false,

        // Controls whether the terminal cursor blinks.
        "terminal.integrated.cursorBlinking": false,

        // Controls the style of terminal cursor.
        "terminal.integrated.cursorStyle": "block",

        // Controls the width of the cursor when `terminal.integrated.cursorStyle` is set to `line`.
        "terminal.integrated.cursorWidth": 1,

        // Whether to draw custom glyphs for block element and box drawing characters instead of using the font, which typically yields better rendering with continuous lines. Note that this doesn't work with the DOM renderer.
        "terminal.integrated.customGlyphs": true,

        // An explicit start path where the terminal will be launched, this is used as the current working directory (cwd) for the shell process. This may be particularly useful in workspace settings if the root directory is not a convenient cwd.
        "terminal.integrated.cwd": "",

        // Controls where newly created terminals will appear.
        //  - editor: Create terminals in the editor
        //  - view: Create terminals in the terminal view
        "terminal.integrated.defaultLocation": "view",

        // The default profile used on Linux. This setting will currently be ignored if either `terminal.integrated.shell.linux` or `terminal.integrated.shellArgs.linux` are set.
        "terminal.integrated.defaultProfile.linux": null,

        // The default profile used on macOS. This setting will currently be ignored if either `terminal.integrated.shell.osx` or `terminal.integrated.shellArgs.osx` are set.
        //  - null: Automatically detect the default
        //  - bash: $(terminal-bash) bash
        // - path: /bin/bash
        // - args: ['-l']
        //  - zsh: $(terminal) zsh
        // - path: /opt/homebrew/bin/zsh
        // - args: ['-l']
        //  - JavaScript Debug Terminal: $($(debug)) JavaScript Debug Terminal
        // - extensionIdentifier: ms-vscode.js-debug
        "terminal.integrated.defaultProfile.osx": null,

        // The default profile used on Windows. This setting will currently be ignored if either `terminal.integrated.shell.windows` or `terminal.integrated.shellArgs.windows` are set.
        "terminal.integrated.defaultProfile.windows": null,

        // Controls whether to detect and set the `$LANG` environment variable to a UTF-8 compliant option since VS Code's terminal only supports UTF-8 encoded data coming from the shell.
        //  - auto: Set the `$LANG` environment variable if the existing variable does not exist or it does not end in `'.UTF-8'`.
        //  - off: Do not set the `$LANG` environment variable.
        //  - on: Always set the `$LANG` environment variable.
        "terminal.integrated.detectLocale": "auto",

        // Controls whether bold text in the terminal will always use the "bright" ANSI color variant.
        "terminal.integrated.drawBoldTextInBrightColors": true,

        // Controls whether the terminal bell is enabled. This shows up as a visual bell next to the terminal's name.
        "terminal.integrated.enableBell": false,

        // Whether to enable file links in terminals. Links can be slow when working on a network drive in particular because each file link is verified against the file system. Changing this will take effect only in new terminals.
        //  - off: Always off.
        //  - on: Enable only when not in a remote workspace.
        //  - notRemote: Always on.
        "terminal.integrated.enableFileLinks": "on",

        // Show a warning dialog when pasting multiple lines into the terminal. The dialog does not show when:
        //
        // - Bracketed paste mode is enabled (the shell supports multi-line paste natively)
        // - The paste is handled by the shell's readline (in the case of pwsh)
        "terminal.integrated.enableMultiLinePasteWarning": true,

        // Persist terminal sessions/history for the workspace across window reloads.
        "terminal.integrated.enablePersistentSessions": true,

        // Object with environment variables that will be added to the VS Code process to be used by the terminal on Linux. Set to `null` to delete the environment variable.
        "terminal.integrated.env.linux": {},

        // Object with environment variables that will be added to the VS Code process to be used by the terminal on macOS. Set to `null` to delete the environment variable.
        "terminal.integrated.env.osx": {},

        // Object with environment variables that will be added to the VS Code process to be used by the terminal on Windows. Set to `null` to delete the environment variable.
        "terminal.integrated.env.windows": {},

        // Whether to display the environment changes indicator on each terminal which explains whether extensions have made, or want to make changes to the terminal's environment.
        //  - off: Disable the indicator.
        //  - on: Enable the indicator.
        //  - warnonly: Only show the warning indicator when a terminal's environment is 'stale', not the information indicator that shows a terminal has had its environment modified by an extension.
        "terminal.integrated.environmentChangesIndicator": "warnonly",

        // Whether to relaunch terminals automatically if extension want to contribute to their environment and have not been interacted with yet.
        "terminal.integrated.environmentChangesRelaunch": true,

        // Scrolling speed multiplier when pressing `Alt`.
        "terminal.integrated.fastScrollSensitivity": 5,

        // Controls the font family of the terminal. Defaults to `editor.fontFamily`'s value.
        "terminal.integrated.fontFamily": "",

        // Controls the font size in pixels of the terminal.
        "terminal.integrated.fontSize": 12,

        // The font weight to use within the terminal for non-bold text. Accepts "normal" and "bold" keywords or numbers between 1 and 1000.
        "terminal.integrated.fontWeight": "normal",

        // The font weight to use within the terminal for bold text. Accepts "normal" and "bold" keywords or numbers between 1 and 1000.
        "terminal.integrated.fontWeightBold": "bold",

        // Controls whether the terminal will leverage the GPU to do its rendering.
        //  - auto: Let VS Code detect which renderer will give the best experience.
        //  - on: Enable GPU acceleration within the terminal.
        //  - off: Disable GPU acceleration within the terminal. The terminal will render much slower when GPU acceleration is off but it should reliably work on all systems.
        //  - canvas: Use the terminal's fallback canvas renderer which uses a 2d context instead of webgl which may perform better on some systems. Note that some features are limited in the canvas renderer like opaque selection.
        "terminal.integrated.gpuAcceleration": "auto",

        // A set of process names to ignore when using the `terminal.integrated.confirmOnKill` setting.
        "terminal.integrated.ignoreProcessNames": [
          "starship",
          "oh-my-posh",
          "bash",
          "zsh",
        ],

        // Whether new shells should inherit their environment from VS Code, which may source a login shell to ensure $PATH and other development variables are initialized. This has no effect on Windows.
        "terminal.integrated.inheritEnv": true,

        // Controls the letter spacing of the terminal. This is an integer value which represents the number of additional pixels to add between characters.
        "terminal.integrated.letterSpacing": 0,

        // Controls the line height of the terminal. This number is multiplied by the terminal font size to get the actual line-height in pixels.
        "terminal.integrated.lineHeight": 1,

        // When local echo should be enabled. This will override `terminal.integrated.localEchoLatencyThreshold`
        //  - on: Always enabled
        //  - off: Always disabled
        //  - auto: Enabled only for remote workspaces
        "terminal.integrated.localEchoEnabled": "auto",

        // Local echo will be disabled when any of these program names are found in the terminal title.
        "terminal.integrated.localEchoExcludePrograms": [
          "vim",
          "vi",
          "nano",
          "tmux",
        ],

        // Length of network delay, in milliseconds, where local edits will be echoed on the terminal without waiting for server acknowledgement. If '0', local echo will always be on, and if '-1' it will be disabled.
        "terminal.integrated.localEchoLatencyThreshold": 30,

        // Terminal style of locally echoed text; either a font style or an RGB color.
        "terminal.integrated.localEchoStyle": "dim",

        // Controls whether to force selection when using Option+click on macOS. This will force a regular (line) selection and disallow the use of column selection mode. This enables copying and pasting using the regular terminal selection, for example, when mouse mode is enabled in tmux.
        "terminal.integrated.macOptionClickForcesSelection": false,

        // Controls whether to treat the option key as the meta key in the terminal on macOS.
        "terminal.integrated.macOptionIsMeta": false,

        // When set, the foreground color of each cell will change to try meet the contrast ratio specified. Note that this will not apply to `powerline` characters per #146406. Example values:
        //
        // - 1: Do nothing and use the standard theme colors.
        // - 4.5: [WCAG AA compliance (minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) (default).
        // - 7: [WCAG AAA compliance (enhanced)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast7.html).
        // - 21: White on black or black on white.
        "terminal.integrated.minimumContrastRatio": 4.5,

        // A multiplier to be used on the `deltaY` of mouse wheel scroll events.
        "terminal.integrated.mouseWheelScrollSensitivity": 1,

        // When the terminal process must be shut down (for example on window or application close), this determines when the previous terminal session contents/history should be restored and processes be recreated when the workspace is next opened.
        //
        // Caveats:
        //
        // - Restoring of the process current working directory depends on whether it is supported by the shell.
        // - Time to persist the session during shutdown is limited, so it may be aborted when using high-latency remote connections.
        //  - onExit: Revive the processes after the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu).
        //  - onExitAndWindowClose: Revive the processes after the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu), or when the window is closed.
        //  - never: Never restore the terminal buffers or recreate the process.
        "terminal.integrated.persistentSessionReviveProcess": "onExit",

        // Controls the maximum amount of lines that will be restored when reconnecting to a persistent terminal session. Increasing this will restore more lines of scrollback at the cost of more memory and increase the time it takes to connect to terminals on start up. This setting requires a restart to take effect and should be set to a value less than or equal to `terminal.integrated.scrollback`.
        "terminal.integrated.persistentSessionScrollback": 100,

        // The Linux profiles to present when creating a new terminal via the terminal dropdown. Set the `path` property manually with an optional `args`.
        //
        // Set an existing profile to `null` to hide the profile from the list, for example: `"bash": null`.
        "terminal.integrated.profiles.linux": {
          // EDITED Sorted
          bash: {
            path: "bash",
            icon: "terminal-bash",
          },
          fish: {
            path: "fish",
          },
          pwsh: {
            path: "pwsh",
            icon: "terminal-powershell",
          },
          tmux: {
            path: "tmux",
            icon: "terminal-tmux",
          },
          zsh: {
            path: "zsh",
          },
        },

        // The macOS profiles to present when creating a new terminal via the terminal dropdown. Set the `path` property manually with an optional `args`.
        //
        // Set an existing profile to `null` to hide the profile from the list, for example: `"bash": null`.
        "terminal.integrated.profiles.osx": {
          // EDITED Sorted
          bash: {
            path: "bash",
            args: ["-l"],
            icon: "terminal-bash",
          },
          fish: {
            path: "fish",
            args: ["-l"],
          },
          pwsh: {
            path: "pwsh",
            icon: "terminal-powershell",
          },
          tmux: {
            path: "tmux",
            icon: "terminal-tmux",
          },
          zsh: {
            path: "zsh",
            args: ["-l"],
          },
        },

        // The Windows profiles to present when creating a new terminal via the terminal dropdown. Use the `source` property to automatically detect the shell's location. Or set the `path` property manually with an optional `args`.
        //
        // Set an existing profile to `null` to hide the profile from the list, for example: `"Ubuntu-20.04 (WSL)": null`.
        "terminal.integrated.profiles.windows": {
          // EDITED Sorted
          "Command Prompt": {
            path: [
              "${env:windir}\\Sysnative\\cmd.exe",
              "${env:windir}\\System32\\cmd.exe",
            ],
            args: [],
            icon: "terminal-cmd",
          },
          "Git Bash": {
            source: "Git Bash",
          },
          "PowerShell": {
            source: "PowerShell",
            icon: "terminal-powershell",
          },
        },

        // Controls how terminal reacts to right click.
        //  - default: Show the context menu.
        //  - copyPaste: Copy when there is a selection, otherwise paste.
        //  - paste: Paste on right click.
        //  - selectWord: Select the word under the cursor and show the context menu.
        //  - nothing: Do nothing and pass event to terminal.
        "terminal.integrated.rightClickBehavior": "selectWord",

        // Controls the maximum number of lines the terminal keeps in its buffer.
        "terminal.integrated.scrollback": 1000,

        // Dispatches most keybindings to the terminal instead of the workbench, overriding `terminal.integrated.commandsToSkipShell`, which can be used alternatively for fine tuning.
        "terminal.integrated.sendKeybindingsToShell": false,

        // This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in `terminal.integrated.profiles.linux#` and setting its profile name as the default in `#terminal.integrated.defaultProfile.linux`. This will currently take priority over the new profiles settings but that will change in the future.
        // The path of the shell that the terminal uses on Linux. [Read more about configuring the shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_terminal-profiles).
        "terminal.integrated.shell.linux": null,

        // This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in `terminal.integrated.profiles.osx#` and setting its profile name as the default in `#terminal.integrated.defaultProfile.osx`. This will currently take priority over the new profiles settings but that will change in the future.
        // The path of the shell that the terminal uses on macOS. [Read more about configuring the shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_terminal-profiles).
        "terminal.integrated.shell.osx": null,

        // This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in `terminal.integrated.profiles.windows#` and setting its profile name as the default in `#terminal.integrated.defaultProfile.windows`. This will currently take priority over the new profiles settings but that will change in the future.
        // The path of the shell that the terminal uses on Windows. [Read more about configuring the shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_terminal-profiles).
        "terminal.integrated.shell.windows": null,

        // This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in `terminal.integrated.profiles.linux#` and setting its profile name as the default in `#terminal.integrated.defaultProfile.linux`. This will currently take priority over the new profiles settings but that will change in the future.
        // The command line arguments to use when on the Linux terminal. [Read more about configuring the shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_terminal-profiles).
        "terminal.integrated.shellArgs.linux": [],

        // This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in `terminal.integrated.profiles.osx#` and setting its profile name as the default in `#terminal.integrated.defaultProfile.osx`. This will currently take priority over the new profiles settings but that will change in the future.
        // The command line arguments to use when on the macOS terminal. [Read more about configuring the shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_terminal-profiles).
        "terminal.integrated.shellArgs.osx": ["-l"],

        // This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in `terminal.integrated.profiles.windows#` and setting its profile name as the default in `#terminal.integrated.defaultProfile.windows`. This will currently take priority over the new profiles settings but that will change in the future.
        // The command line arguments to use when on the Windows terminal. [Read more about configuring the shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_terminal-profiles).
        "terminal.integrated.shellArgs.windows": [],

        // When shell integration is enabled, adds a decoration for each command.
        //  - both: Show decorations in the gutter (left) and overview ruler (right)
        //  - gutter: Show gutter decorations to the left of the terminal
        //  - overviewRuler: Show overview ruler decorations to the right of the terminal
        //  - never: Do not show decorations
        "terminal.integrated.shellIntegration.decorationsEnabled": "both",

        // Determines whether or not shell integration is auto-injected to support features like enhanced command tracking and current working directory detection.
        //
        // Shell integration works by injecting the shell with a startup script. The script gives VS Code insight into what is happening within the terminal.
        //
        // Supported shells:
        //
        // - Linux/macOS: bash, fish, pwsh, zsh
        //  - Windows: pwsh
        //
        // This setting applies only when terminals are created, so you will need to restart your terminals for it to take effect.
        //
        //  Note that the script injection may not work if you have custom arguments defined in the terminal profile, have enabled `editor.accessibilitySupport#`, have a [complex bash `PROMPT_COMMAND`](https://code.visualstudio.com/docs/editor/integrated-terminal#_complex-bash-promptcommand), or other unsupported setup. To disable decorations, see `#terminal.integrated.shellIntegrations.decorationsEnabled`
        "terminal.integrated.shellIntegration.enabled": true,

        // Controls the number of recently used commands to keep in the terminal command history. Set to 0 to disable terminal command history.
        "terminal.integrated.shellIntegration.history": 100,

        // Enables experimental terminal Intellisense suggestions for supported shells when `terminal.integrated.shellIntegration.enabled` is set to `true`. If shell integration is installed manually, `VSCODE_SUGGEST` needs to be set to `1` before calling the script.
        "terminal.integrated.shellIntegration.suggestEnabled": false,

        // Controls whether to show the alert "The terminal process terminated with exit code" when exit code is non-zero.
        "terminal.integrated.showExitAlert": true,

        // Whether to show hovers for links in the terminal output.
        "terminal.integrated.showLinkHover": true,

        // Controls whether the terminal will scroll using an animation.
        "terminal.integrated.smoothScrolling": false,

        // Controls the working directory a split terminal starts with.
        //  - workspaceRoot: A new split terminal will use the workspace root as the working directory. In a multi-root workspace a choice for which root folder to use is offered.
        //  - initial: A new split terminal will use the working directory that the parent terminal started with.
        //  - inherited: On macOS and Linux, a new split terminal will use the working directory of the parent terminal. On Windows, this behaves the same as initial.
        "terminal.integrated.splitCwd": "inherited",

        // A theme color ID to associate with terminal icons by default.
        "terminal.integrated.tabs.defaultColor": null,

        // A codicon ID to associate with terminal icons by default.
        //  - add: $(add)
        //  - plus: $(plus)
        //  - gist-new: $(gist-new)
        //  - repo-create: $(repo-create)
        //  - lightbulb: $(lightbulb)
        //  - light-bulb: $(light-bulb)
        //  - repo: $(repo)
        //  - repo-delete: $(repo-delete)
        //  - gist-fork: $(gist-fork)
        //  - repo-forked: $(repo-forked)
        //  - git-pull-request: $(git-pull-request)
        //  - git-pull-request-abandoned: $(git-pull-request-abandoned)
        //  - record-keys: $(record-keys)
        //  - keyboard: $(keyboard)
        //  - tag: $(tag)
        //  - tag-add: $(tag-add)
        //  - tag-remove: $(tag-remove)
        //  - person: $(person)
        //  - person-follow: $(person-follow)
        //  - person-outline: $(person-outline)
        //  - person-filled: $(person-filled)
        //  - git-branch: $(git-branch)
        //  - git-branch-create: $(git-branch-create)
        //  - git-branch-delete: $(git-branch-delete)
        //  - source-control: $(source-control)
        //  - mirror: $(mirror)
        //  - mirror-public: $(mirror-public)
        //  - star: $(star)
        //  - star-add: $(star-add)
        //  - star-delete: $(star-delete)
        //  - star-empty: $(star-empty)
        //  - comment: $(comment)
        //  - comment-add: $(comment-add)
        //  - alert: $(alert)
        //  - warning: $(warning)
        //  - search: $(search)
        //  - search-save: $(search-save)
        //  - log-out: $(log-out)
        //  - sign-out: $(sign-out)
        //  - log-in: $(log-in)
        //  - sign-in: $(sign-in)
        //  - eye: $(eye)
        //  - eye-unwatch: $(eye-unwatch)
        //  - eye-watch: $(eye-watch)
        //  - circle-filled: $(circle-filled)
        //  - primitive-dot: $(primitive-dot)
        //  - close-dirty: $(close-dirty)
        //  - debug-breakpoint: $(debug-breakpoint)
        //  - debug-breakpoint-disabled: $(debug-breakpoint-disabled)
        //  - debug-hint: $(debug-hint)
        //  - primitive-square: $(primitive-square)
        //  - edit: $(edit)
        //  - pencil: $(pencil)
        //  - info: $(info)
        //  - issue-opened: $(issue-opened)
        //  - gist-private: $(gist-private)
        //  - git-fork-private: $(git-fork-private)
        //  - lock: $(lock)
        //  - mirror-private: $(mirror-private)
        //  - close: $(close)
        //  - remove-close: $(remove-close)
        //  - x: $(x)
        //  - repo-sync: $(repo-sync)
        //  - sync: $(sync)
        //  - clone: $(clone)
        //  - desktop-download: $(desktop-download)
        //  - beaker: $(beaker)
        //  - microscope: $(microscope)
        //  - vm: $(vm)
        //  - device-desktop: $(device-desktop)
        //  - file: $(file)
        //  - file-text: $(file-text)
        //  - more: $(more)
        //  - ellipsis: $(ellipsis)
        //  - kebab-horizontal: $(kebab-horizontal)
        //  - mail-reply: $(mail-reply)
        //  - reply: $(reply)
        //  - organization: $(organization)
        //  - organization-filled: $(organization-filled)
        //  - organization-outline: $(organization-outline)
        //  - new-file: $(new-file)
        //  - file-add: $(file-add)
        //  - new-folder: $(new-folder)
        //  - file-directory-create: $(file-directory-create)
        //  - trash: $(trash)
        //  - trashcan: $(trashcan)
        //  - history: $(history)
        //  - clock: $(clock)
        //  - folder: $(folder)
        //  - file-directory: $(file-directory)
        //  - symbol-folder: $(symbol-folder)
        //  - logo-github: $(logo-github)
        //  - mark-github: $(mark-github)
        //  - github: $(github)
        //  - terminal: $(terminal)
        //  - console: $(console)
        //  - repl: $(repl)
        //  - zap: $(zap)
        //  - symbol-event: $(symbol-event)
        //  - error: $(error)
        //  - stop: $(stop)
        //  - variable: $(variable)
        //  - symbol-variable: $(symbol-variable)
        //  - array: $(array)
        //  - symbol-array: $(symbol-array)
        //  - symbol-module: $(symbol-module)
        //  - symbol-package: $(symbol-package)
        //  - symbol-namespace: $(symbol-namespace)
        //  - symbol-object: $(symbol-object)
        //  - symbol-method: $(symbol-method)
        //  - symbol-function: $(symbol-function)
        //  - symbol-constructor: $(symbol-constructor)
        //  - symbol-boolean: $(symbol-boolean)
        //  - symbol-null: $(symbol-null)
        //  - symbol-numeric: $(symbol-numeric)
        //  - symbol-number: $(symbol-number)
        //  - symbol-structure: $(symbol-structure)
        //  - symbol-struct: $(symbol-struct)
        //  - symbol-parameter: $(symbol-parameter)
        //  - symbol-type-parameter: $(symbol-type-parameter)
        //  - symbol-key: $(symbol-key)
        //  - symbol-text: $(symbol-text)
        //  - symbol-reference: $(symbol-reference)
        //  - go-to-file: $(go-to-file)
        //  - symbol-enum: $(symbol-enum)
        //  - symbol-value: $(symbol-value)
        //  - symbol-ruler: $(symbol-ruler)
        //  - symbol-unit: $(symbol-unit)
        //  - activate-breakpoints: $(activate-breakpoints)
        //  - archive: $(archive)
        //  - arrow-both: $(arrow-both)
        //  - arrow-down: $(arrow-down)
        //  - arrow-left: $(arrow-left)
        //  - arrow-right: $(arrow-right)
        //  - arrow-small-down: $(arrow-small-down)
        //  - arrow-small-left: $(arrow-small-left)
        //  - arrow-small-right: $(arrow-small-right)
        //  - arrow-small-up: $(arrow-small-up)
        //  - arrow-up: $(arrow-up)
        //  - bell: $(bell)
        //  - bold: $(bold)
        //  - book: $(book)
        //  - bookmark: $(bookmark)
        //  - debug-breakpoint-conditional-unverified: $(debug-breakpoint-conditional-unverified)
        //  - debug-breakpoint-conditional: $(debug-breakpoint-conditional)
        //  - debug-breakpoint-conditional-disabled: $(debug-breakpoint-conditional-disabled)
        //  - debug-breakpoint-data-unverified: $(debug-breakpoint-data-unverified)
        //  - debug-breakpoint-data: $(debug-breakpoint-data)
        //  - debug-breakpoint-data-disabled: $(debug-breakpoint-data-disabled)
        //  - debug-breakpoint-log-unverified: $(debug-breakpoint-log-unverified)
        //  - debug-breakpoint-log: $(debug-breakpoint-log)
        //  - debug-breakpoint-log-disabled: $(debug-breakpoint-log-disabled)
        //  - briefcase: $(briefcase)
        //  - broadcast: $(broadcast)
        //  - browser: $(browser)
        //  - bug: $(bug)
        //  - calendar: $(calendar)
        //  - case-sensitive: $(case-sensitive)
        //  - check: $(check)
        //  - checklist: $(checklist)
        //  - chevron-down: $(chevron-down)
        //  - drop-down-button: $(drop-down-button)
        //  - chevron-left: $(chevron-left)
        //  - chevron-right: $(chevron-right)
        //  - chevron-up: $(chevron-up)
        //  - chrome-close: $(chrome-close)
        //  - chrome-maximize: $(chrome-maximize)
        //  - chrome-minimize: $(chrome-minimize)
        //  - chrome-restore: $(chrome-restore)
        //  - circle: $(circle)
        //  - circle-outline: $(circle-outline)
        //  - debug-breakpoint-unverified: $(debug-breakpoint-unverified)
        //  - circle-slash: $(circle-slash)
        //  - circuit-board: $(circuit-board)
        //  - clear-all: $(clear-all)
        //  - clippy: $(clippy)
        //  - close-all: $(close-all)
        //  - cloud-download: $(cloud-download)
        //  - cloud-upload: $(cloud-upload)
        //  - code: $(code)
        //  - collapse-all: $(collapse-all)
        //  - color-mode: $(color-mode)
        //  - comment-discussion: $(comment-discussion)
        //  - compare-changes: $(compare-changes)
        //  - credit-card: $(credit-card)
        //  - dash: $(dash)
        //  - dashboard: $(dashboard)
        //  - database: $(database)
        //  - debug-continue: $(debug-continue)
        //  - debug-disconnect: $(debug-disconnect)
        //  - debug-pause: $(debug-pause)
        //  - debug-restart: $(debug-restart)
        //  - debug-start: $(debug-start)
        //  - debug-step-into: $(debug-step-into)
        //  - debug-step-out: $(debug-step-out)
        //  - debug-step-over: $(debug-step-over)
        //  - debug-stop: $(debug-stop)
        //  - debug: $(debug)
        //  - device-camera-video: $(device-camera-video)
        //  - device-camera: $(device-camera)
        //  - device-mobile: $(device-mobile)
        //  - diff-added: $(diff-added)
        //  - diff-ignored: $(diff-ignored)
        //  - diff-modified: $(diff-modified)
        //  - diff-removed: $(diff-removed)
        //  - diff-renamed: $(diff-renamed)
        //  - diff: $(diff)
        //  - discard: $(discard)
        //  - editor-layout: $(editor-layout)
        //  - empty-window: $(empty-window)
        //  - exclude: $(exclude)
        //  - extensions: $(extensions)
        //  - eye-closed: $(eye-closed)
        //  - file-binary: $(file-binary)
        //  - file-code: $(file-code)
        //  - file-media: $(file-media)
        //  - file-pdf: $(file-pdf)
        //  - file-submodule: $(file-submodule)
        //  - file-symlink-directory: $(file-symlink-directory)
        //  - file-symlink-file: $(file-symlink-file)
        //  - file-zip: $(file-zip)
        //  - files: $(files)
        //  - filter: $(filter)
        //  - flame: $(flame)
        //  - fold-down: $(fold-down)
        //  - fold-up: $(fold-up)
        //  - fold: $(fold)
        //  - folder-active: $(folder-active)
        //  - folder-opened: $(folder-opened)
        //  - gear: $(gear)
        //  - gift: $(gift)
        //  - gist-secret: $(gist-secret)
        //  - gist: $(gist)
        //  - git-commit: $(git-commit)
        //  - git-compare: $(git-compare)
        //  - git-merge: $(git-merge)
        //  - github-action: $(github-action)
        //  - github-alt: $(github-alt)
        //  - globe: $(globe)
        //  - grabber: $(grabber)
        //  - graph: $(graph)
        //  - gripper: $(gripper)
        //  - heart: $(heart)
        //  - home: $(home)
        //  - horizontal-rule: $(horizontal-rule)
        //  - hubot: $(hubot)
        //  - inbox: $(inbox)
        //  - issue-closed: $(issue-closed)
        //  - issue-reopened: $(issue-reopened)
        //  - issues: $(issues)
        //  - italic: $(italic)
        //  - jersey: $(jersey)
        //  - json: $(json)
        //  - bracket: $(bracket)
        //  - kebab-vertical: $(kebab-vertical)
        //  - key: $(key)
        //  - law: $(law)
        //  - lightbulb-autofix: $(lightbulb-autofix)
        //  - link-external: $(link-external)
        //  - link: $(link)
        //  - list-ordered: $(list-ordered)
        //  - list-unordered: $(list-unordered)
        //  - live-share: $(live-share)
        //  - loading: $(loading)
        //  - location: $(location)
        //  - mail-read: $(mail-read)
        //  - mail: $(mail)
        //  - markdown: $(markdown)
        //  - megaphone: $(megaphone)
        //  - mention: $(mention)
        //  - milestone: $(milestone)
        //  - mortar-board: $(mortar-board)
        //  - move: $(move)
        //  - multiple-windows: $(multiple-windows)
        //  - mute: $(mute)
        //  - no-newline: $(no-newline)
        //  - note: $(note)
        //  - octoface: $(octoface)
        //  - open-preview: $(open-preview)
        //  - package: $(package)
        //  - paintcan: $(paintcan)
        //  - pin: $(pin)
        //  - play: $(play)
        //  - run: $(run)
        //  - plug: $(plug)
        //  - preserve-case: $(preserve-case)
        //  - preview: $(preview)
        //  - project: $(project)
        //  - pulse: $(pulse)
        //  - question: $(question)
        //  - quote: $(quote)
        //  - radio-tower: $(radio-tower)
        //  - reactions: $(reactions)
        //  - references: $(references)
        //  - refresh: $(refresh)
        //  - regex: $(regex)
        //  - remote-explorer: $(remote-explorer)
        //  - remote: $(remote)
        //  - remove: $(remove)
        //  - replace-all: $(replace-all)
        //  - replace: $(replace)
        //  - repo-clone: $(repo-clone)
        //  - repo-force-push: $(repo-force-push)
        //  - repo-pull: $(repo-pull)
        //  - repo-push: $(repo-push)
        //  - report: $(report)
        //  - request-changes: $(request-changes)
        //  - rocket: $(rocket)
        //  - root-folder-opened: $(root-folder-opened)
        //  - root-folder: $(root-folder)
        //  - rss: $(rss)
        //  - ruby: $(ruby)
        //  - save-all: $(save-all)
        //  - save-as: $(save-as)
        //  - save: $(save)
        //  - screen-full: $(screen-full)
        //  - screen-normal: $(screen-normal)
        //  - search-stop: $(search-stop)
        //  - server: $(server)
        //  - settings-gear: $(settings-gear)
        //  - settings: $(settings)
        //  - shield: $(shield)
        //  - smiley: $(smiley)
        //  - sort-precedence: $(sort-precedence)
        //  - split-horizontal: $(split-horizontal)
        //  - split-vertical: $(split-vertical)
        //  - squirrel: $(squirrel)
        //  - star-full: $(star-full)
        //  - star-half: $(star-half)
        //  - symbol-class: $(symbol-class)
        //  - symbol-color: $(symbol-color)
        //  - symbol-customcolor: $(symbol-customcolor)
        //  - symbol-constant: $(symbol-constant)
        //  - symbol-enum-member: $(symbol-enum-member)
        //  - symbol-field: $(symbol-field)
        //  - symbol-file: $(symbol-file)
        //  - symbol-interface: $(symbol-interface)
        //  - symbol-keyword: $(symbol-keyword)
        //  - symbol-misc: $(symbol-misc)
        //  - symbol-operator: $(symbol-operator)
        //  - symbol-property: $(symbol-property)
        //  - wrench: $(wrench)
        //  - wrench-subaction: $(wrench-subaction)
        //  - symbol-snippet: $(symbol-snippet)
        //  - tasklist: $(tasklist)
        //  - telescope: $(telescope)
        //  - text-size: $(text-size)
        //  - three-bars: $(three-bars)
        //  - thumbsdown: $(thumbsdown)
        //  - thumbsup: $(thumbsup)
        //  - tools: $(tools)
        //  - triangle-down: $(triangle-down)
        //  - triangle-left: $(triangle-left)
        //  - triangle-right: $(triangle-right)
        //  - triangle-up: $(triangle-up)
        //  - twitter: $(twitter)
        //  - unfold: $(unfold)
        //  - unlock: $(unlock)
        //  - unmute: $(unmute)
        //  - unverified: $(unverified)
        //  - verified: $(verified)
        //  - versions: $(versions)
        //  - vm-active: $(vm-active)
        //  - vm-outline: $(vm-outline)
        //  - vm-running: $(vm-running)
        //  - watch: $(watch)
        //  - whitespace: $(whitespace)
        //  - whole-word: $(whole-word)
        //  - window: $(window)
        //  - word-wrap: $(word-wrap)
        //  - zoom-in: $(zoom-in)
        //  - zoom-out: $(zoom-out)
        //  - list-filter: $(list-filter)
        //  - list-flat: $(list-flat)
        //  - list-selection: $(list-selection)
        //  - selection: $(selection)
        //  - list-tree: $(list-tree)
        //  - debug-breakpoint-function-unverified: $(debug-breakpoint-function-unverified)
        //  - debug-breakpoint-function: $(debug-breakpoint-function)
        //  - debug-breakpoint-function-disabled: $(debug-breakpoint-function-disabled)
        //  - debug-stackframe-active: $(debug-stackframe-active)
        //  - circle-small-filled: $(circle-small-filled)
        //  - debug-stackframe-dot: $(debug-stackframe-dot)
        //  - debug-stackframe: $(debug-stackframe)
        //  - debug-stackframe-focused: $(debug-stackframe-focused)
        //  - debug-breakpoint-unsupported: $(debug-breakpoint-unsupported)
        //  - symbol-string: $(symbol-string)
        //  - debug-reverse-continue: $(debug-reverse-continue)
        //  - debug-step-back: $(debug-step-back)
        //  - debug-restart-frame: $(debug-restart-frame)
        //  - call-incoming: $(call-incoming)
        //  - call-outgoing: $(call-outgoing)
        //  - menu: $(menu)
        //  - expand-all: $(expand-all)
        //  - feedback: $(feedback)
        //  - group-by-ref-type: $(group-by-ref-type)
        //  - ungroup-by-ref-type: $(ungroup-by-ref-type)
        //  - account: $(account)
        //  - bell-dot: $(bell-dot)
        //  - debug-console: $(debug-console)
        //  - library: $(library)
        //  - output: $(output)
        //  - run-all: $(run-all)
        //  - sync-ignored: $(sync-ignored)
        //  - pinned: $(pinned)
        //  - github-inverted: $(github-inverted)
        //  - debug-alt: $(debug-alt)
        //  - server-process: $(server-process)
        //  - server-environment: $(server-environment)
        //  - pass: $(pass)
        //  - stop-circle: $(stop-circle)
        //  - play-circle: $(play-circle)
        //  - record: $(record)
        //  - debug-alt-small: $(debug-alt-small)
        //  - vm-connect: $(vm-connect)
        //  - cloud: $(cloud)
        //  - merge: $(merge)
        //  - export: $(export)
        //  - graph-left: $(graph-left)
        //  - magnet: $(magnet)
        //  - notebook: $(notebook)
        //  - redo: $(redo)
        //  - check-all: $(check-all)
        //  - pinned-dirty: $(pinned-dirty)
        //  - pass-filled: $(pass-filled)
        //  - circle-large-filled: $(circle-large-filled)
        //  - circle-large: $(circle-large)
        //  - circle-large-outline: $(circle-large-outline)
        //  - combine: $(combine)
        //  - gather: $(gather)
        //  - table: $(table)
        //  - variable-group: $(variable-group)
        //  - type-hierarchy: $(type-hierarchy)
        //  - type-hierarchy-sub: $(type-hierarchy-sub)
        //  - type-hierarchy-super: $(type-hierarchy-super)
        //  - git-pull-request-create: $(git-pull-request-create)
        //  - run-above: $(run-above)
        //  - run-below: $(run-below)
        //  - notebook-template: $(notebook-template)
        //  - debug-rerun: $(debug-rerun)
        //  - workspace-trusted: $(workspace-trusted)
        //  - workspace-untrusted: $(workspace-untrusted)
        //  - workspace-unspecified: $(workspace-unspecified)
        //  - terminal-cmd: $(terminal-cmd)
        //  - terminal-debian: $(terminal-debian)
        //  - terminal-linux: $(terminal-linux)
        //  - terminal-powershell: $(terminal-powershell)
        //  - terminal-tmux: $(terminal-tmux)
        //  - terminal-ubuntu: $(terminal-ubuntu)
        //  - terminal-bash: $(terminal-bash)
        //  - arrow-swap: $(arrow-swap)
        //  - copy: $(copy)
        //  - person-add: $(person-add)
        //  - filter-filled: $(filter-filled)
        //  - wand: $(wand)
        //  - debug-line-by-line: $(debug-line-by-line)
        //  - inspect: $(inspect)
        //  - layers: $(layers)
        //  - layers-dot: $(layers-dot)
        //  - layers-active: $(layers-active)
        //  - compass: $(compass)
        //  - compass-dot: $(compass-dot)
        //  - compass-active: $(compass-active)
        //  - azure: $(azure)
        //  - issue-draft: $(issue-draft)
        //  - git-pull-request-closed: $(git-pull-request-closed)
        //  - git-pull-request-draft: $(git-pull-request-draft)
        //  - debug-all: $(debug-all)
        //  - debug-coverage: $(debug-coverage)
        //  - run-errors: $(run-errors)
        //  - folder-library: $(folder-library)
        //  - debug-continue-small: $(debug-continue-small)
        //  - beaker-stop: $(beaker-stop)
        //  - graph-line: $(graph-line)
        //  - graph-scatter: $(graph-scatter)
        //  - pie-chart: $(pie-chart)
        //  - bracket-dot: $(bracket-dot)
        //  - bracket-error: $(bracket-error)
        //  - lock-small: $(lock-small)
        //  - azure-devops: $(azure-devops)
        //  - verified-filled: $(verified-filled)
        //  - newline: $(newline)
        //  - layout: $(layout)
        //  - layout-activitybar-left: $(layout-activitybar-left)
        //  - layout-activitybar-right: $(layout-activitybar-right)
        //  - layout-panel-left: $(layout-panel-left)
        //  - layout-panel-center: $(layout-panel-center)
        //  - layout-panel-justify: $(layout-panel-justify)
        //  - layout-panel-right: $(layout-panel-right)
        //  - layout-panel: $(layout-panel)
        //  - layout-sidebar-left: $(layout-sidebar-left)
        //  - layout-sidebar-right: $(layout-sidebar-right)
        //  - layout-statusbar: $(layout-statusbar)
        //  - layout-menubar: $(layout-menubar)
        //  - layout-centered: $(layout-centered)
        //  - layout-sidebar-right-off: $(layout-sidebar-right-off)
        //  - layout-panel-off: $(layout-panel-off)
        //  - layout-sidebar-left-off: $(layout-sidebar-left-off)
        //  - target: $(target)
        //  - indent: $(indent)
        //  - record-small: $(record-small)
        //  - error-small: $(error-small)
        //  - arrow-circle-down: $(arrow-circle-down)
        //  - arrow-circle-left: $(arrow-circle-left)
        //  - arrow-circle-right: $(arrow-circle-right)
        //  - arrow-circle-up: $(arrow-circle-up)
        //  - heart-filled: $(heart-filled)
        //  - map: $(map)
        //  - map-filled: $(map-filled)
        //  - circle-small: $(circle-small)
        //  - bell-slash: $(bell-slash)
        //  - bell-slash-dot: $(bell-slash-dot)
        //  - comment-unresolved: $(comment-unresolved)
        //  - git-pull-request-go-to-changes: $(git-pull-request-go-to-changes)
        //  - git-pull-request-new-changes: $(git-pull-request-new-changes)
        //  - search-fuzzy: $(search-fuzzy)
        //  - comment-draft: $(comment-draft)
        //  - dialog-error: $(dialog-error)
        //  - dialog-warning: $(dialog-warning)
        //  - dialog-info: $(dialog-info)
        //  - dialog-close: $(dialog-close)
        //  - tree-item-expanded: $(tree-item-expanded)
        //  - tree-filter-on-type-on: $(tree-filter-on-type-on)
        //  - tree-filter-on-type-off: $(tree-filter-on-type-off)
        //  - tree-filter-clear: $(tree-filter-clear)
        //  - tree-item-loading: $(tree-item-loading)
        //  - menu-selection: $(menu-selection)
        //  - menu-submenu: $(menu-submenu)
        //  - menubar-more: $(menubar-more)
        //  - scrollbar-button-left: $(scrollbar-button-left)
        //  - scrollbar-button-right: $(scrollbar-button-right)
        //  - scrollbar-button-up: $(scrollbar-button-up)
        //  - scrollbar-button-down: $(scrollbar-button-down)
        //  - toolbar-more: $(toolbar-more)
        //  - quick-input-back: $(quick-input-back)
        "terminal.integrated.tabs.defaultIcon": "terminal",

        // Controls the terminal description, which appears to the right of the title. Variables are substituted based on the context:
        // - `${cwd}`: the terminal's current working directory
        // - `${cwdFolder}`: the terminal's current working directory, displayed for multi-root workspaces or in a single root workspace when the value differs from the initial working directory. On Windows, this will only be displayed when shell integration is enabled.
        // - `${workspaceFolder}`: the workspace in which the terminal was launched
        // - `${local}`: indicates a local terminal in a remote workspace
        // - `${process}`: the name of the terminal process
        // - `${separator}`: a conditional separator (` - `) that only shows when surrounded by variables with values or static text.
        // - `${sequence}`: the name provided to the terminal by the process
        // - `${task}`: indicates this terminal is associated with a task
        "terminal.integrated.tabs.description":
          "${task}${separator}${local}${separator}${cwdFolder}",

        // Controls whether terminal tab statuses support animation (eg. in progress tasks).
        "terminal.integrated.tabs.enableAnimation": true,

        // Controls whether terminal tabs display as a list to the side of the terminal. When this is disabled a dropdown will display instead.
        "terminal.integrated.tabs.enabled": true,

        // Controls whether focusing the terminal of a tab happens on double or single click.
        //  - singleClick: Focus the terminal when clicking a terminal tab
        //  - doubleClick: Focus the terminal when double-clicking a terminal tab
        "terminal.integrated.tabs.focusMode": "doubleClick",

        // Controls whether the terminal tabs view will hide under certain conditions.
        //  - never: Never hide the terminal tabs view
        //  - singleTerminal: Hide the terminal tabs view when there is only a single terminal opened
        //  - singleGroup: Hide the terminal tabs view when there is only a single terminal group opened
        "terminal.integrated.tabs.hideCondition": "singleTerminal",

        // Controls the location of the terminal tabs, either to the left or right of the actual terminal(s).
        //  - left: Show the terminal tabs view to the left of the terminal
        //  - right: Show the terminal tabs view to the right of the terminal
        "terminal.integrated.tabs.location": "right",

        // Separator used by `terminal.integrated.tabs.title` and `terminal.integrated.tabs.title`.
        "terminal.integrated.tabs.separator": " - ",

        // Controls whether terminal split and kill buttons are displays next to the new terminal button.
        //  - always: Always show the actions
        //  - singleTerminal: Show the actions when it is the only terminal opened
        //  - singleTerminalOrNarrow: Show the actions when it is the only terminal opened or when the tabs view is in its narrow textless state
        //  - never: Never show the actions
        "terminal.integrated.tabs.showActions": "singleTerminalOrNarrow",

        // Shows the active terminal information in the view. This is particularly useful when the title within the tabs aren't visible.
        //  - always: Always show the active terminal
        //  - singleTerminal: Show the active terminal when it is the only terminal opened
        //  - singleTerminalOrNarrow: Show the active terminal when it is the only terminal opened or when the tabs view is in its narrow textless state
        //  - never: Never show the active terminal
        "terminal.integrated.tabs.showActiveTerminal": "singleTerminalOrNarrow",

        // Controls the terminal title. Variables are substituted based on the context:
        // - `${cwd}`: the terminal's current working directory
        // - `${cwdFolder}`: the terminal's current working directory, displayed for multi-root workspaces or in a single root workspace when the value differs from the initial working directory. On Windows, this will only be displayed when shell integration is enabled.
        // - `${workspaceFolder}`: the workspace in which the terminal was launched
        // - `${local}`: indicates a local terminal in a remote workspace
        // - `${process}`: the name of the terminal process
        // - `${separator}`: a conditional separator (` - `) that only shows when surrounded by variables with values or static text.
        // - `${sequence}`: the name provided to the terminal by the process
        // - `${task}`: indicates this terminal is associated with a task
        "terminal.integrated.tabs.title": "${process}",

        // The number of cells in a tab stop.
        "terminal.integrated.tabStopWidth": 8,

        // Controls what version of Unicode to use when evaluating the width of characters in the terminal. If you experience emoji or other wide characters not taking up the right amount of space or backspace either deleting too much or too little then you may want to try tweaking this setting.
        //  - 6: Version 6 of Unicode. This is an older version which should work better on older systems.
        //  - 11: Version 11 of Unicode. This version provides better support on modern systems that use modern versions of Unicode.
        "terminal.integrated.unicodeVersion": "11",

        // Controls whether or not WSL distros are shown in the terminal dropdown
        "terminal.integrated.useWslProfiles": true,

        // Whether to use ConPTY for Windows terminal process communication (requires Windows 10 build number 18309+). Winpty will be used if this is false.
        "terminal.integrated.windowsEnableConpty": true,

        // A string containing all characters to be considered word separators by the double-click to select word feature.
        "terminal.integrated.wordSeparators": " ()[]{}',\"`─‘’",

        // Enable automatic tasks - note that tasks won't run in an untrusted workspace.
        //  - on: Always
        //  - off: Never
        "task.allowAutomaticTasks": "on",

        // Controls enablement of `provideTasks` for all task provider extension. If the Tasks: Run Task command is slow, disabling auto detect for task providers may help. Individual extensions may also provide settings that disable auto detection.
        "task.autoDetect": "on",

        // Configures whether to show the problem matcher prompt when running a task. Set to `true` to never prompt, or use a dictionary of task types to turn off prompting only for specific task types.
        "task.problemMatchers.neverPrompt": false,

        // Controls whether to show the task detail for tasks that have a detail in task quick picks, such as Run Task.
        "task.quickOpen.detail": true,

        // Controls the number of recent items tracked in task quick open dialog.
        "task.quickOpen.history": 30,

        // Causes the Tasks: Run Task command to use the slower "show all" behavior instead of the faster two level picker where tasks are grouped by provider.
        "task.quickOpen.showAll": false,

        // Controls whether the task quick pick is skipped when there is only one task to pick from.
        "task.quickOpen.skip": false,

        // On window reload, reconnect to tasks that have problem matchers.
        "task.reconnection": true,

        // Save all dirty editors before running a task.
        //  - always: Always saves all editors before running.
        //  - never: Never saves editors before running.
        //  - prompt: Prompts whether to save editors before running.
        "task.saveBeforeRun": "always",

        // Configures whether a warning is shown when a provider is slow
        "task.slowProviderWarning": true,

        // Controls whether Problems view should automatically reveal files when opening them.
        "problems.autoReveal": true,

        // Show Errors & Warnings on files and folder.
        "problems.decorations.enabled": true,

        // Controls the default view mode of the Problems view.
        "problems.defaultViewMode": "tree",

        // When enabled shows the current problem in the status bar.
        "problems.showCurrentInStatus": false,

        // Controls the order in which problems are navigated.
        //  - severity: Navigate problems ordered by severity
        //  - position: Navigate problems ordered by position
        "problems.sortOrder": "severity",

        // Enable/disable navigation breadcrumbs.
        "breadcrumbs.enabled": true,

        // Controls whether and how file paths are shown in the breadcrumbs view.
        //  - on: Show the file path in the breadcrumbs view.
        //  - off: Do not show the file path in the breadcrumbs view.
        //  - last: Only show the last element of the file path in the breadcrumbs view.
        "breadcrumbs.filePath": "on",

        // Render breadcrumb items with icons.
        "breadcrumbs.icons": true,

        // When enabled breadcrumbs show `array`-symbols.
        "breadcrumbs.showArrays": true,

        // When enabled breadcrumbs show `boolean`-symbols.
        "breadcrumbs.showBooleans": true,

        // When enabled breadcrumbs show `class`-symbols.
        "breadcrumbs.showClasses": true,

        // When enabled breadcrumbs show `constant`-symbols.
        "breadcrumbs.showConstants": true,

        // When enabled breadcrumbs show `constructor`-symbols.
        "breadcrumbs.showConstructors": true,

        // When enabled breadcrumbs show `enumMember`-symbols.
        "breadcrumbs.showEnumMembers": true,

        // When enabled breadcrumbs show `enum`-symbols.
        "breadcrumbs.showEnums": true,

        // When enabled breadcrumbs show `event`-symbols.
        "breadcrumbs.showEvents": true,

        // When enabled breadcrumbs show `field`-symbols.
        "breadcrumbs.showFields": true,

        // When enabled breadcrumbs show `file`-symbols.
        "breadcrumbs.showFiles": true,

        // When enabled breadcrumbs show `function`-symbols.
        "breadcrumbs.showFunctions": true,

        // When enabled breadcrumbs show `interface`-symbols.
        "breadcrumbs.showInterfaces": true,

        // When enabled breadcrumbs show `key`-symbols.
        "breadcrumbs.showKeys": true,

        // When enabled breadcrumbs show `method`-symbols.
        "breadcrumbs.showMethods": true,

        // When enabled breadcrumbs show `module`-symbols.
        "breadcrumbs.showModules": true,

        // When enabled breadcrumbs show `namespace`-symbols.
        "breadcrumbs.showNamespaces": true,

        // When enabled breadcrumbs show `null`-symbols.
        "breadcrumbs.showNull": true,

        // When enabled breadcrumbs show `number`-symbols.
        "breadcrumbs.showNumbers": true,

        // When enabled breadcrumbs show `object`-symbols.
        "breadcrumbs.showObjects": true,

        // When enabled breadcrumbs show `operator`-symbols.
        "breadcrumbs.showOperators": true,

        // When enabled breadcrumbs show `package`-symbols.
        "breadcrumbs.showPackages": true,

        // When enabled breadcrumbs show `property`-symbols.
        "breadcrumbs.showProperties": true,

        // When enabled breadcrumbs show `string`-symbols.
        "breadcrumbs.showStrings": true,

        // When enabled breadcrumbs show `struct`-symbols.
        "breadcrumbs.showStructs": true,

        // When enabled breadcrumbs show `typeParameter`-symbols.
        "breadcrumbs.showTypeParameters": true,

        // When enabled breadcrumbs show `variable`-symbols.
        "breadcrumbs.showVariables": true,

        // Controls whether and how symbols are shown in the breadcrumbs view.
        //  - on: Show all symbols in the breadcrumbs view.
        //  - off: Do not show symbols in the breadcrumbs view.
        //  - last: Only show the current symbol in the breadcrumbs view.
        "breadcrumbs.symbolPath": "on",

        // Controls how symbols are sorted in the breadcrumbs outline view.
        //  - position: Show symbol outline in file position order.
        //  - name: Show symbol outline in alphabetical order.
        //  - type: Show symbol outline in symbol type order.
        "breadcrumbs.symbolSortOrder": "position",

        // If this setting is false, no telemetry will be sent regardless of the new setting's value. Deprecated due to being combined into the `telemetry.telemetryLevel` setting.
        // Enable crash reports to be collected. This helps us improve stability.
        // This option requires restart to take effect.
        "telemetry.enableCrashReporter": true,

        // If this setting is false, no telemetry will be sent regardless of the new setting's value. Deprecated in favor of the `telemetry.telemetryLevel` setting.
        // Enable diagnostic data to be collected. This helps us to better understand how Visual Studio Code is performing and where improvements need to be made. [Read more](https://go.microsoft.com/fwlink/?LinkId=786907) about what we collect and our privacy statement.
        "telemetry.enableTelemetry": true,

        //
        // Controls Visual Studio Code telemetry, first-party extension telemetry, and participating third-party extension telemetry. Some third party extensions might not respect this setting. Consult the specific extension's documentation to be sure. Telemetry helps us better understand how Visual Studio Code is performing, where improvements need to be made, and how features are being used. Read more about the [data we collect](https://aka.ms/vscode-telemetry) and our [privacy statement](https://go.microsoft.com/fwlink/?LinkId=786907). A full restart of the application is necessary for crash reporting changes to take effect.
        //
        // &nbsp;
        //
        // The following table outlines the data sent with each setting:
        //
        // |       | Crash Reports | Error Telemetry | Usage Data |
        // |:------|:---------------------:|:---------------:|:--------------:|
        // | all   |            ✓          |        ✓        |        ✓       |
        // | error |            ✓          |        ✓        |        -       |
        // | crash |            ✓          |        -        |        -       |
        // | off   |            -          |        -        |        -       |
        //
        //
        // &nbsp;
        //
        // ****Note:*** If this setting is 'off', no telemetry will be sent regardless of other telemetry settings. If this setting is set to anything except 'off' and telemetry is disabled with deprecated settings, no telemetry will be sent.*
        //
        //  - all: Sends usage data, errors, and crash reports.
        //  - error: Sends general error telemetry and crash reports.
        //  - crash: Sends OS level crash reports.
        //  - off: Disables all product telemetry.
        "telemetry.telemetryLevel": "all",

        // Controls whether Outline items are collapsed or expanded.
        //  - alwaysCollapse: Collapse all items.
        //  - alwaysExpand: Expand all items.
        "outline.collapseItems": "alwaysExpand",

        // Render Outline elements with icons.
        "outline.icons": true,

        // Use badges for errors and warnings on Outline elements.
        "outline.problems.badges": true,

        // Use colors for errors and warnings on Outline elements.
        "outline.problems.colors": true,

        // Show errors and warnings on Outline elements.
        "outline.problems.enabled": true,

        // When enabled, Outline shows `array`-symbols.
        "outline.showArrays": true,

        // When enabled, Outline shows `boolean`-symbols.
        "outline.showBooleans": true,

        // When enabled, Outline shows `class`-symbols.
        "outline.showClasses": true,

        // When enabled, Outline shows `constant`-symbols.
        "outline.showConstants": true,

        // When enabled, Outline shows `constructor`-symbols.
        "outline.showConstructors": true,

        // When enabled, Outline shows `enumMember`-symbols.
        "outline.showEnumMembers": true,

        // When enabled, Outline shows `enum`-symbols.
        "outline.showEnums": true,

        // When enabled, Outline shows `event`-symbols.
        "outline.showEvents": true,

        // When enabled, Outline shows `field`-symbols.
        "outline.showFields": true,

        // When enabled, Outline shows `file`-symbols.
        "outline.showFiles": true,

        // When enabled, Outline shows `function`-symbols.
        "outline.showFunctions": true,

        // When enabled, Outline shows `interface`-symbols.
        "outline.showInterfaces": true,

        // When enabled, Outline shows `key`-symbols.
        "outline.showKeys": true,

        // When enabled, Outline shows `method`-symbols.
        "outline.showMethods": true,

        // When enabled, Outline shows `module`-symbols.
        "outline.showModules": true,

        // When enabled, Outline shows `namespace`-symbols.
        "outline.showNamespaces": true,

        // When enabled, Outline shows `null`-symbols.
        "outline.showNull": true,

        // When enabled, Outline shows `number`-symbols.
        "outline.showNumbers": true,

        // When enabled, Outline shows `object`-symbols.
        "outline.showObjects": true,

        // When enabled, Outline shows `operator`-symbols.
        "outline.showOperators": true,

        // When enabled, Outline shows `package`-symbols.
        "outline.showPackages": true,

        // When enabled, Outline shows `property`-symbols.
        "outline.showProperties": true,

        // When enabled, Outline shows `string`-symbols.
        "outline.showStrings": true,

        // When enabled, Outline shows `struct`-symbols.
        "outline.showStructs": true,

        // When enabled, Outline shows `typeParameter`-symbols.
        "outline.showTypeParameters": true,

        // When enabled, Outline shows `variable`-symbols.
        "outline.showVariables": true,

        // Experimental. Controls whether the Timeline view will load the next page of items when you scroll to the end of the list.
        "timeline.pageOnScroll": false,

        // The number of items to show in the Timeline view by default and when loading more items. Setting to `null` (the default) will automatically choose a page size based on the visible area of the Timeline view.
        "timeline.pageSize": null,

        // Plays a sound when the focus moves to a deleted line in diff review mode or to the next/previous change
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.diffLineDeleted": "auto",

        // Plays a sound when the focus moves to an inserted line in diff review mode or to the next/previous change
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.diffLineInserted": "auto",

        // Plays a sound when the focus moves to a modified line in diff review mode or to the next/previous change
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.diffLineModified": "auto",

        // Deprecated. Use the specific setting for each audio cue instead (`audioCues.*`).
        //
        "audioCues.enabled": null,

        // Plays a sound when the active line has a breakpoint.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.lineHasBreakpoint": "auto",

        // Plays a sound when the active line has an error.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.lineHasError": "auto",

        // Plays a sound when the active line has a folded area that can be unfolded.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.lineHasFoldedArea": "auto",

        // Plays a sound when the active line has an inline suggestion.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.lineHasInlineSuggestion": "auto",

        // Plays a sound when the active line has a warning.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.lineHasWarning": "off",

        // Plays a sound when trying to read a line with inlay hints that has no inlay hints.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.noInlayHints": "auto",

        // Plays a sound when a notebook cell execution is successfully completed.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.notebookCellCompleted": "auto",

        // Plays a sound when a notebook cell execution fails.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.notebookCellFailed": "auto",

        // Plays a sound when the debugger stopped on a breakpoint.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.onDebugBreak": "auto",

        // Plays a sound when a task is completed.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.taskCompleted": "auto",

        // Plays a sound when a task fails (non-zero exit code).
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.taskFailed": "auto",

        // Plays a sound when terminal Quick Fixes are available.
        //  - auto: Enable audio cue when a screen reader is attached.
        //  - on: Enable audio cue.
        //  - off: Disable audio cue.
        "audioCues.terminalQuickFix": "auto",

        // The volume of the audio cues in percent (0-100).
        "audioCues.volume": 70,

        // The name under which the remote tunnel access is registered. If not set, the host name is used.
        "remote.tunnels.access.hostNameOverride": "",

        // Prevent the computer from sleeping when remote tunnel access is turned on.
        "remote.tunnels.access.preventSleep": false,

        // When enabled, new running processes are detected and ports that they listen on are automatically forwarded. Disabling this setting will not prevent all ports from being forwarded. Even when disabled, extensions will still be able to cause ports to be forwarded, and opening some URLs will still cause ports to forwarded.
        "remote.autoForwardPorts": true,

        // Sets the source from which ports are automatically forwarded when `remote.autoForwardPorts` is true. On Windows and Mac remotes, the `process` option has no effect and `output` will be used. Requires a reload to take effect.
        //  - process: Ports will be automatically forwarded when discovered by watching for processes that are started and include a port.
        //  - output: Ports will be automatically forwarded when discovered by reading terminal and debug output. Not all processes that use ports will print to the integrated terminal or debug console, so some ports will be missed. Ports forwarded based on output will not be "un-forwarded" until reload or until the port is closed by the user in the Ports view.
        "remote.autoForwardPortsSource": "process",

        // When enabled extensions are downloaded locally and installed on remote.
        "remote.downloadExtensionsLocally": false,

        // Override the kind of an extension. `ui` extensions are installed and run on the local machine while `workspace` extensions are run on the remote. By overriding an extension's default kind using this setting, you specify if that extension should be installed and enabled locally or remotely.
        "remote.extensionKind": {
          "pub.name": ["ui"],
        },

        // Controls whether local URLs with a port will be forwarded when opened from the terminal and the debug console.
        "remote.forwardOnOpen": true,

        // Specifies the local host name that will be used for port forwarding.
        "remote.localPortHost": "localhost",

        // Set default properties that are applied to all ports that don't get properties from the setting `remote.portsAttributes`. For example:
        //
        // ```
        // {
        //   "onAutoForward": "ignore"
        // }
        // ```
        "remote.otherPortsAttributes": {},

        // Set properties that are applied when a specific port number is forwarded. For example:
        //
        // ```
        // "3000": {
        //   "label": "Application"
        // },
        // "40000-55000": {
        //   "onAutoForward": "ignore"
        // },
        // ".+\\/server.js": {
        //  "onAutoForward": "openPreview"
        // }
        // ```
        "remote.portsAttributes": {
          "443": {
            protocol: "https",
          },
          "8443": {
            protocol: "https",
          },
        },

        // Restores the ports you forwarded in a workspace.
        "remote.restoreForwardedPorts": true,

        //
        //  - smart: Uses the default diffing algorithm.
        //  - experimental: Uses an experimental diffing algorithm.
        "mergeEditor.diffAlgorithm": "experimental",

        // Controls if deletions in base or one of the inputs should be indicated by a vertical bar.
        "mergeEditor.showDeletionMarkers": true,

        // An array of languages where Emmet abbreviations should not be expanded.
        "emmet.excludeLanguages": ["markdown"],

        // An array of paths, where each path can contain Emmet syntaxProfiles and/or snippet files.
        // In case of conflicts, the profiles/snippets of later paths will override those of earlier paths.
        // See https://code.visualstudio.com/docs/editor/emmet for more information and an example snippet file.
        "emmet.extensionsPath": [],

        // Enable Emmet abbreviations in languages that are not supported by default. Add a mapping here between the language and Emmet supported language.
        //  For example: `{"vue-html": "html", "javascript": "javascriptreact"}`
        "emmet.includeLanguages": {},

        // When set to `false`, the whole file is parsed to determine if current position is valid for expanding Emmet abbreviations. When set to `true`, only the content around the current position in CSS/SCSS/Less files is parsed.
        "emmet.optimizeStylesheetParsing": true,

        // Preferences used to modify behavior of some actions and resolvers of Emmet.
        "emmet.preferences": {},

        // Shows possible Emmet abbreviations as suggestions. Not applicable in stylesheets or when emmet.showExpandedAbbreviation is set to `"never"`.
        "emmet.showAbbreviationSuggestions": true,

        // Shows expanded Emmet abbreviations as suggestions.
        // The option `"inMarkupAndStylesheetFilesOnly"` applies to html, haml, jade, slim, xml, xsl, css, scss, sass, less and stylus.
        // The option `"always"` applies to all parts of the file regardless of markup/css.
        "emmet.showExpandedAbbreviation": "always",

        // If `true`, then Emmet suggestions will show up as snippets allowing you to order them as per `editor.snippetSuggestions` setting.
        "emmet.showSuggestionsAsSnippets": false,

        // Define profile for specified syntax or use your own profile with specific rules.
        "emmet.syntaxProfiles": {},

        // When enabled, Emmet abbreviations are expanded when pressing TAB, even when completions do not show up. When disabled, completions that show up can still be accepted by pressing TAB.
        "emmet.triggerExpansionOnTab": false,

        // If `true`, Emmet will use inline completions to suggest expansions. To prevent the non-inline completion item provider from showing up as often while this setting is `true`, turn `editor.quickSuggestions` to `inline` or `off` for the `other` item.
        "emmet.useInlineCompletions": false,

        // Variables to be used in Emmet snippets.
        "emmet.variables": {},

        // Controls whether force push (with or without lease) is enabled.
        "git.allowForcePush": false,

        // Controls whether commits without running pre-commit and commit-msg hooks are allowed.
        "git.allowNoVerifyCommit": false,

        // Always show the Staged Changes resource group.
        "git.alwaysShowStagedChangesResourceGroup": false,

        // Controls the signoff flag for all commits.
        "git.alwaysSignOff": false,

        // When set to true, commits will automatically be fetched from the default remote of the current Git repository. Setting to `all` will fetch from all remotes.
        "git.autofetch": false,

        // Duration in seconds between each automatic git fetch, when `git.autofetch` is enabled.
        "git.autofetchPeriod": 180,

        // Whether auto refreshing is enabled.
        "git.autorefresh": true,

        // Configures when repositories should be automatically detected.
        //  - true: Scan for both subfolders of the current opened folder and parent folders of open files.
        //  - false: Disable automatic repository scanning.
        //  - subFolders: Scan for subfolders of the currently opened folder.
        //  - openEditors: Scan for parent folders of open files.
        "git.autoRepositoryDetection": true,

        // Stash any changes before pulling and restore them after successful pull.
        "git.autoStash": false,

        // Prefix used when creating a new branch.
        "git.branchPrefix": "",

        // List of protected branches. By default, a prompt is shown before changes are committed to a protected branch. The prompt can be controlled using the `git.branchProtectionPrompt`  setting.
        "git.branchProtection": [],

        // Controls whether a prompt is being shown before changes are committed to a protected branch.
        //  - alwaysCommit: Always commit changes to the protected branch.
        //  - alwaysCommitToNewBranch: Always commit changes to a new branch.
        //  - alwaysPrompt: Always prompt before changes are committed to a protected branch.
        "git.branchProtectionPrompt": "alwaysPrompt",

        // List of dictionaries used for the randomly generated branch name. Each value represents the dictionary used to generate the segment of the branch name. Supported dictionaries: `adjectives`, `animals`, `colors` and `numbers`.
        //  - adjectives: A random adjective
        //  - animals: A random animal name
        //  - colors: A random color name
        //  - numbers: A random number between 100 and 999
        "git.branchRandomName.dictionary": ["adjectives", "animals"],

        // Controls whether a random name is generated when creating a new branch.
        "git.branchRandomName.enable": false,

        // Controls the sort order for branches.
        "git.branchSortOrder": "committerdate",

        // A regular expression to validate new branch names.
        "git.branchValidationRegex": "",

        // The character to replace whitespace in new branch names, and to separate segments of a randomly generated branch name.
        "git.branchWhitespaceChar": "-",

        // Controls what type of git refs are listed when running `Checkout to...`.
        //  - local: Local branches
        //  - tags: Tags
        //  - remote: Remote branches
        "git.checkoutType": ["local", "remote", "tags"],

        // Controls whether the diff editor should be automatically closed when changes are stashed, committed, discarded, staged, or unstaged.
        "git.closeDiffOnOperation": false,

        // List of git commands (ex: commit, push) that would have their `stdout` logged to the [git output](command:git.showOutput). If the git command has a client-side hook configured, the client-side hook's `stdout` will also be logged to the [git output](command:git.showOutput).
        "git.commandsToLog": [],

        // Always confirm the creation of empty commits for the 'Git: Commit Empty' command.
        "git.confirmEmptyCommits": true,

        // Controls whether to ask for confirmation before force-pushing.
        "git.confirmForcePush": true,

        // Controls whether to ask for confirmation before committing without verification.
        "git.confirmNoVerifyCommit": true,

        // Confirm before synchronizing git repositories.
        "git.confirmSync": true,

        // Controls the Git count badge.
        //  - all: Count all changes.
        //  - tracked: Count only tracked changes.
        //  - off: Turn off counter.
        "git.countBadge": "all",

        // Controls whether Git contributes colors and badges to the Explorer and the Open Editors view.
        "git.decorations.enabled": true,

        // The default location to clone a git repository.
        "git.defaultCloneDirectory": null,

        // Controls whether to automatically detect git submodules.
        "git.detectSubmodules": true,

        // Controls the limit of git submodules detected.
        "git.detectSubmodulesLimit": 10,

        // Enables commit signing with GPG or X.509.
        "git.enableCommitSigning": false,

        // Whether git is enabled.
        "git.enabled": true,

        // Commit all changes when there are no staged changes.
        "git.enableSmartCommit": false,

        // Controls whether the Git Sync command appears in the status bar.
        "git.enableStatusBarSync": true,

        // When enabled, fetch all branches when pulling. Otherwise, fetch just the current one.
        "git.fetchOnPull": false,

        // Push all annotated tags when running the sync command.
        "git.followTagsWhenSync": false,

        // This setting is now deprecated, please use `github.gitAuthentication` instead.
        //
        "git.githubAuthentication": null,

        // List of git repositories to ignore.
        "git.ignoredRepositories": [],

        // Ignores the legacy Git warning.
        "git.ignoreLegacyWarning": false,

        // Ignores the warning when there are too many changes in a repository.
        "git.ignoreLimitWarning": false,

        // Ignores the warning when Git is missing.
        "git.ignoreMissingGitWarning": false,

        // Ignores the warning when it looks like the branch might have been rebased when pulling.
        "git.ignoreRebaseWarning": false,

        // Ignore modifications to submodules in the file tree.
        "git.ignoreSubmodules": false,

        // Ignores the warning when Git 2.25 - 2.26 is installed on Windows.
        "git.ignoreWindowsGit27Warning": false,

        // Controls when to show commit message input validation.
        "git.inputValidation": "warn",

        // Controls the commit message length threshold for showing a warning.
        "git.inputValidationLength": 72,

        // Controls the commit message subject length threshold for showing a warning. Unset it to inherit the value of `config.inputValidationLength`.
        "git.inputValidationSubjectLength": 50,

        // Open the merge editor for files that are currently under conflict.
        "git.mergeEditor": false,

        // Controls whether to open a repository automatically after cloning.
        //  - always: Always open in current window.
        //  - alwaysNewWindow: Always open in a new window.
        //  - whenNoFolderOpen: Only open in current window when no folder is opened.
        //  - prompt: Always prompt for action.
        "git.openAfterClone": "prompt",

        // Controls whether the diff editor should be opened when clicking a change. Otherwise the regular editor will be opened.
        "git.openDiffOnClick": true,

        // Control whether a repository in parent folders of workspaces or open files should be opened.
        //  - always: Always open a repository in parent folders of workspaces or open files.
        //  - never: Never open a repository in parent folders of workspaces or open files.
        //  - prompt: Prompt before opening a repository the parent folders of workspaces or open files.
        "git.openRepositoryInParentFolders": "prompt",

        // Controls whether to optimistically update the state of the Source Control view after running git commands.
        "git.optimisticUpdate": true,

        // Path and filename of the git executable, e.g. `C:\Program Files\Git\bin\git.exe` (Windows). This can also be an array of string values containing multiple paths to look up.
        "git.path": null,

        // Run a git command after a successful commit.
        //  - none: Don't run any command after a commit.
        //  - push: Run 'git push' after a successful commit.
        //  - sync: Run 'git pull' and 'git push' after a successful commit.
        "git.postCommitCommand": "none",

        // Controls whether Git should check for unsaved files before committing.
        //  - always: Check for any unsaved files.
        //  - staged: Check only for unsaved staged files.
        //  - never: Disable this check.
        "git.promptToSaveFilesBeforeCommit": "always",

        // Controls whether Git should check for unsaved files before stashing changes.
        //  - always: Check for any unsaved files.
        //  - staged: Check only for unsaved staged files.
        //  - never: Disable this check.
        "git.promptToSaveFilesBeforeStash": "always",

        // Prune when fetching.
        "git.pruneOnFetch": false,

        // Controls whether a branch that does not have outgoing commits is fast-forwarded before it is checked out.
        "git.pullBeforeCheckout": false,

        // Fetch all tags when pulling.
        "git.pullTags": true,

        // Force git to use rebase when running the sync command.
        "git.rebaseWhenSync": false,

        // Remember the last git command that ran after a commit.
        "git.rememberPostCommitCommand": false,

        // List of folders that are ignored while scanning for Git repositories when `git.autoRepositoryDetection` is set to `true` or `subFolders`.
        "git.repositoryScanIgnoredFolders": ["node_modules"],

        // Controls the depth used when scanning workspace folders for Git repositories when `git.autoRepositoryDetection` is set to `true` or `subFolders`. Can be set to `-1` for no limit.
        "git.repositoryScanMaxDepth": 1,

        // Controls whether to require explicit Git user configuration or allow Git to guess if missing.
        "git.requireGitUserConfig": true,

        // List of paths to search for git repositories in.
        "git.scanRepositories": [],

        // Controls whether an action button is shown in the Source Control view.
        "git.showActionButton": {
          commit: true,
          publish: true,
          sync: true,
        },

        // Controls whether to show the commit input in the Git source control panel.
        "git.showCommitInput": true,

        // Controls whether to show an inline Open File action in the Git changes view.
        "git.showInlineOpenFileAction": true,

        // Controls whether git actions should show progress.
        "git.showProgress": true,

        // Controls whether to show a notification when a push is successful.
        "git.showPushSuccessNotification": false,

        // Control which changes are automatically staged by Smart Commit.
        //  - all: Automatically stage all changes.
        //  - tracked: Automatically stage tracked changes only.
        "git.smartCommitChanges": "all",

        // Controls how to limit the number of changes that can be parsed from Git status command. Can be set to 0 for no limit.
        "git.statusLimit": 10000,

        // Suggests to enable smart commit (commit all changes when there are no staged changes).
        "git.suggestSmartCommit": true,

        // Controls whether a notification comes up when running the Sync action, which allows the user to cancel the operation.
        "git.supportCancellation": false,

        // Controls whether to enable VS Code to be the authentication handler for Git processes spawned in the Integrated Terminal. Note: Terminals need to be restarted to pick up a change in this setting.
        "git.terminalAuthentication": true,

        // Controls whether to enable VS Code to be the Git editor for Git processes spawned in the integrated terminal. Note: Terminals need to be restarted to pick up a change in this setting.
        "git.terminalGitEditor": false,

        // Controls which date to use for items in the Timeline view.
        //  - committed: Use the committed date
        //  - authored: Use the authored date
        "git.timeline.date": "committed",

        // Controls whether to show the commit author in the Timeline view.
        "git.timeline.showAuthor": true,

        // Controls whether to show uncommitted changes in the Timeline view.
        "git.timeline.showUncommitted": false,

        // Controls how untracked changes behave.
        //  - mixed: All changes, tracked and untracked, appear together and behave equally.
        //  - separate: Untracked changes appear separately in the Source Control view. They are also excluded from several actions.
        //  - hidden: Untracked changes are hidden and excluded from several actions.
        "git.untrackedChanges": "mixed",

        // Controls whether to use the message from the commit input box as the default stash message.
        "git.useCommitInputAsStashMessage": false,

        // Controls whether a full text editor will be used to author commit messages, whenever no message is provided in the commit input box.
        "git.useEditorAsCommitInput": true,

        // Controls whether force pushing uses the safer force-with-lease variant.
        "git.useForcePushWithLease": true,

        // Controls whether GIT_ASKPASS should be overwritten to use the integrated version.
        "git.useIntegratedAskPass": true,

        // Enable verbose output when `git.useEditorAsCommitInput` is enabled.
        "git.verboseCommit": false,

        // Controls whether to enable automatic GitHub authentication for git commands within VS Code.
        "github.gitAuthentication": true,

        // Controls which protocol is used to clone a GitHub repository
        "github.gitProtocol": "https",

        // GitHub Enterprise Server URI
        "github-enterprise.uri": "",

        // Controls enablement of Grunt task detection. Grunt task detection can cause files in any open workspace to be executed.
        "grunt.autoDetect": "off",

        // Controls enablement of Gulp task detection. Gulp task detection can cause files in any open workspace to be executed.
        "gulp.autoDetect": "off",

        // Enable/disable pasting of images into Markdown cells in ipynb notebook files. Pasted images are inserted as attachments to the cell.
        "ipynb.pasteImagesAsAttachments.enabled": true,

        // Controls enablement of Jake task detection. Jake task detection can cause files in any open workspace to be executed.
        "jake.autoDetect": "off",

        // Enable/disable rendering math in the built-in Markdown preview.
        "markdown.math.enabled": true,

        // Whether to automatically navigate to the next merge conflict after resolving a merge conflict.
        "merge-conflict.autoNavigateNextConflict.enabled": false,

        // Create a CodeLens for merge conflict blocks within editor.
        "merge-conflict.codeLens.enabled": true,

        // Create decorators for merge conflict blocks within editor.
        "merge-conflict.decorators.enabled": true,

        // Controls where the diff view should be opened when comparing changes in merge conflicts.
        //  - Current: Open the diff view in the current editor group.
        //  - Beside: Open the diff view next to the current editor group.
        //  - Below: Open the diff view below the current editor group.
        "merge-conflict.diffViewPosition": "Current",

        // Configures which processes to automatically attach and debug when `debug.node.autoAttach` is on. A Node process launched with the `--inspect` flag will always be attached to, regardless of this setting.
        //  - always: Auto attach to every Node.js process launched in the terminal.
        //  - smart: Auto attach when running scripts that aren't in a node_modules folder.
        //  - onlyWithFlag: Only auto attach when the `--inspect` is given.
        //  - disabled: Auto attach is disabled and not shown in status bar.
        "debug.javascript.autoAttachFilter": "disabled",

        // Configures glob patterns for determining when to attach in "smart" `debug.javascript.autoAttachFilter` mode. `$KNOWN_TOOLS$` is replaced with a list of names of common test and code runners. [Read more on the VS Code docs](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_auto-attach-smart-patterns).
        "debug.javascript.autoAttachSmartPattern": [
          "${workspaceFolder}/**",
          "!**/node_modules/**",
          "**/$KNOWN_TOOLS$/**",
        ],

        // When debugging a remote web app, configures whether to automatically tunnel the remote server to your local machine.
        "debug.javascript.automaticallyTunnelRemoteServer": true,

        // Whether to stop when conditional breakpoints throw an error.
        "debug.javascript.breakOnConditionalError": false,

        // Where a "Run" and "Debug" code lens should be shown in your npm scripts. It may be on "all", scripts, on "top" of the script section, or "never".
        "debug.javascript.codelens.npmScripts": "top",

        // Options used when debugging open links clicked from inside the JavaScript Debug Terminal. Can be set to "off" to disable this behavior, or "always" to enable debugging in all terminals.
        "debug.javascript.debugByLinkOptions": "on",

        // The default `runtimeExecutable` used for launch configurations, if unspecified. This can be used to config custom paths to Node.js or browser installations.
        "debug.javascript.defaultRuntimeExecutable": {
          "pwa-node": "node",
        },

        // Default options used when debugging a process through the `Debug: Attach to Node.js Process` command
        "debug.javascript.pickAndAttachOptions": {},

        // Request options to use when loading resources, such as source maps, in the debugger. You may need to configure this if your sourcemaps require authentication or use a self-signed certificate, for instance. Options are used to create a request using the [`got`](https://github.com/sindresorhus/got) library.
        //
        // A common case to disable certificate verification can be done by passing `{ "https": { "rejectUnauthorized": false } }`.
        "debug.javascript.resourceRequestOptions": {},

        // Default launch options for the JavaScript debug terminal and npm scripts.
        "debug.javascript.terminalOptions": {},

        // Configures whether sourcemapped file where the original file can't be read will automatically be unmapped. If this is false (default), a prompt is shown.
        "debug.javascript.unmapMissingSources": false,

        // Controls whether npm scripts should be automatically detected.
        "npm.autoDetect": "on",

        // Enable running npm scripts contained in a folder from the Explorer context menu.
        "npm.enableRunFromFolder": false,

        // The NPM Script Explorer is now available in 'Views' menu in the Explorer in all folders.
        // Enable an explorer view for npm scripts when there is no top-level 'package.json' file.
        "npm.enableScriptExplorer": false,

        // Configure glob patterns for folders that should be excluded from automatic script detection.
        "npm.exclude": "",

        // Fetch data from https://registry.npmjs.org and https://registry.bower.io to provide auto-completion and information on hover features on npm dependencies.
        "npm.fetchOnlinePackageInfo": true,

        // The package manager used to run scripts.
        //  - auto: Auto-detect which package manager to use for running scripts based on lock files and installed package managers.
        //  - npm: Use npm as the package manager for running scripts.
        //  - yarn: Use yarn as the package manager for running scripts.
        //  - pnpm: Use pnpm as the package manager for running scripts.
        "npm.packageManager": "auto",

        // Run npm commands with the `--silent` option.
        "npm.runSilent": false,

        // The default click action used in the NPM Scripts Explorer: `open` or `run`, the default is `open`.
        "npm.scriptExplorerAction": "open",

        // An array of regular expressions that indicate which scripts should be excluded from the NPM Scripts view.
        "npm.scriptExplorerExclude": [],

        // Display hover with 'Run' and 'Debug' commands for scripts.
        "npm.scriptHover": true,

        // Controls whether 'Peek References' or 'Find References' is invoked when selecting CodeLens references.
        //  - peek: Show references in peek editor.
        //  - view: Show references in separate view.
        "references.preferredLocation": "peek",

        // Enable/disable the floating indicator that shows when focused in the simple browser.
        "simpleBrowser.focusLockIndicator.enabled": true,

        // Specifies custom documentation overrides on a per module basis
        "nodeReadme.overrides": null,

        // The setting is deprecated. Use editor.codeActionsOnSave instead with a source.fixAll.eslint member.
        // Turns auto fix on save on or off.
        "eslint.autoFixOnSave": false,

        // Show disable lint rule in the quick fix menu.
        "eslint.codeAction.disableRuleComment": {
          enable: true,
          location: "separateLine",
          commentStyle: "line",
        },

        // Show open lint rule documentation web page in the quick fix menu.
        "eslint.codeAction.showDocumentation": {
          enable: true,
        },

        // Specifies the code action mode. Possible values are 'all' and 'problems'.
        //  - all: Fixes all possible problems in the file. This option might take some time.
        //  - problems: Fixes only reported problems that have non-overlapping textual edits. This option runs a lot faster.
        "eslint.codeActionsOnSave.mode": "all",

        // The rules that should be executed when computing the code actions on save or formatting a file. Defaults to the rules configured via the ESLint configuration
        "eslint.codeActionsOnSave.rules": null,

        // Enables ESLint debug mode (same as `--debug` on the command line)
        "eslint.debug": false,

        // Controls whether eslint is enabled or not.
        "eslint.enable": true,

        // Additional exec argv argument passed to the runtime. This can for example be used to control the maximum heap space using --max_old_space_size
        "eslint.execArgv": null,

        // Enables support of experimental Flat Config (aka eslint.config.js, supported by ESLint version 8.21 or later).
        "eslint.experimental.useFlatConfig": false,

        // Enables ESLint as a formatter.
        "eslint.format.enable": false,

        // If true, untitled files won't be validated by ESLint.
        "eslint.ignoreUntitled": false,

        // Controls whether a task for linting the whole workspace will be available.
        "eslint.lintTask.enable": false,

        // Command line options applied when running the task for linting the whole workspace (see https://eslint.org/docs/user-guide/command-line-interface).
        "eslint.lintTask.options": ".",

        // Whether ESlint should migrate auto fix on save settings.
        "eslint.migration.2_x": "on",

        // The value of `NODE_ENV` to use when running eslint tasks.
        "eslint.nodeEnv": null,

        // A path added to `NODE_PATH` when resolving the eslint module.
        "eslint.nodePath": null,

        // A special rules customization section for text cells in notebook documents.
        "eslint.notebooks.rules.customizations": [],

        // Whether ESLint should issue a warning on ignored files.
        "eslint.onIgnoredFiles": "off",

        // The eslint options object to provide args normally passed to eslint when executed from a command line (see https://eslint.org/docs/developer-guide/nodejs-api#eslint-class).
        "eslint.options": {},

        // The package manager you use to install node modules.
        "eslint.packageManager": "npm",

        // An array of language ids for which the extension should probe if support is installed.
        "eslint.probe": [
          "javascript",
          "javascriptreact",
          "typescript",
          "typescriptreact",
          "html",
          "vue",
          "markdown",
        ],

        // Shortens the text spans of underlined problems to their first related line.
        "eslint.problems.shortenToSingleLine": false,

        // This option is deprecated. Use eslint.lintTask.enable instead.
        // Controls whether a task for linting the whole workspace will be available.
        "eslint.provideLintTask": false,

        // Turns on quiet mode, which ignores warnings.
        "eslint.quiet": false,

        // Override the severity of one or more rules reported by this extension, regardless of the project's ESLint config. Use globs to apply default severities for multiple rules.
        "eslint.rules.customizations": [],

        // Run the linter on save (onSave) or on type (onType)
        "eslint.run": "onType",

        // The location of the node binary to run ESLint under.
        "eslint.runtime": null,

        // The time budget in milliseconds to spend on computing fixes before showing a warning or error.
        "eslint.timeBudget.onFixes": {
          warn: 3000,
          error: 6000,
        },

        // The time budget in milliseconds to spend on validation before showing a warning or error.
        "eslint.timeBudget.onValidation": {
          warn: 4000,
          error: 8000,
        },

        // Traces the communication between VSCode and the eslint linter service.
        "eslint.trace.server": "off",

        // Since version 7 ESLint offers a new API call ESLint. Use it even if the old CLIEngine is available. From version 8 on forward on ESLint class is available.
        "eslint.useESLintClass": false,

        // An array of language ids which should be validated by ESLint. If not installed ESLint will show an error.
        "eslint.validate": [],

        // Specifies how the working directories ESLint is using are computed. ESLint resolves configuration files (e.g. `eslintrc`, `.eslintignore`) relative to a working directory so it is important to configure this correctly.
        "eslint.workingDirectories": [],

        // Include parentheses around a sole arrow function parameter
        "prettier.arrowParens": "always",

        // If true, puts the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being alone on the next line (does not apply to self closing elements).
        "prettier.bracketSameLine": false,

        // Controls the printing of spaces inside object literals
        "prettier.bracketSpacing": true,

        // Path to the prettier configuration file
        "prettier.configPath": "",

        // This feature is no longer supported. Instead, configure VS Code [default formatters](https://github.com/prettier/prettier-vscode#default-formatter) or use .prettierignore.
        // A list of languages IDs to disable this extension on
        "prettier.disableLanguages": [],

        // A list of [glob patterns](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) to register Prettier formatter
        "prettier.documentSelectors": [],

        // Control whether Prettier formats quoted code embedded in the file.
        "prettier.embeddedLanguageFormatting": "auto",

        // Controls whether prettier is enabled or not.
        "prettier.enable": true,

        // Enable debug logs for troubleshooting.
        "prettier.enableDebugLogs": false,

        // Specify the end of line used by prettier
        "prettier.endOfLine": "lf",

        // Specify the global whitespace sensitivity for HTML files.
        //  Valid options:
        // - `css` - Respect the default value of CSS display property.
        // - `strict` - Whitespaces are considered sensitive.
        // - `ignore` - Whitespaces are considered insensitive.
        "prettier.htmlWhitespaceSensitivity": "css",

        // Path to a .prettierignore file
        "prettier.ignorePath": ".prettierignore",

        // Prettier can insert a special @format marker at the top of files specifying that the file has been formatted with prettier. This works well when used in tandem with the `--require-pragma` option. If there is already a docblock at the top of the file then this option will add a newline to it with the @format marker.
        "prettier.insertPragma": false,

        // This option has been deprecated in v2.4.0, use `bracketSameLine` instead.
        // If true, puts the `>` of a multi-line jsx element at the end of the last line instead of being alone on the next line (does not apply to self closing elements).
        "prettier.jsxBracketSameLine": false,

        // Use single quotes instead of double quotes in JSX
        "prettier.jsxSingleQuote": false,

        // Package manager is now automatically detected by VS Code. This setting is no longer used.
        // The package manager you use to install node modules.
        "prettier.packageManager": "npm",

        // Path to the prettier module
        "prettier.prettierPath": "",

        // Fit code within this line limit
        "prettier.printWidth": 80,

        // (Markdown) wrap prose over multiple lines
        "prettier.proseWrap": "preserve",

        // Change when properties in objects are quoted
        "prettier.quoteProps": "as-needed",

        // Require a prettier configuration file to format. See [documentation for valid configuration files](https://prettier.io/docs/en/configuration.html).
        //
        // > _Note, untitled files will still be formatted using the VS Code prettier settings even when this setting is set._
        "prettier.requireConfig": false,

        // Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the top of the file. This is very useful when gradually transitioning large, unformatted codebases to prettier.
        "prettier.requirePragma": false,

        // When enabled, this extension will attempt to use global npm or yarn modules if local modules cannot be resolved.
        // > _This setting can have a negative performance impact, particularly on Windows when you have attached network drives. Only enable this if you must use global modules._
        "prettier.resolveGlobalModules": false,

        // Whether to add a semicolon at the end of every line
        "prettier.semi": true,

        // If true, enforces single attribute per line in HTML, Vue and JSX.
        "prettier.singleAttributePerLine": false,

        // If true, will use single instead of double quotes
        "prettier.singleQuote": false,

        // Number of spaces it should use per tab
        "prettier.tabWidth": 2,

        // Controls the printing of trailing commas wherever possible. Valid options:
        // - `none` - No trailing commas
        // - `es5` - Trailing commas where valid in ES5 (objects, arrays, etc)
        // - `all` - Trailing commas wherever possible (function arguments)
        "prettier.trailingComma": "es5",

        // Whether or not to take `.editorconfig` into account when parsing configuration. See the [prettier.resolveConfig](https://prettier.io/docs/en/api.html) docs for details.
        "prettier.useEditorConfig": true,

        // Indent lines with tabs
        "prettier.useTabs": false,

        // Whether or not to indent the code inside `<script>` and `<style>` tags in Vue files.
        "prettier.vueIndentScriptAndStyle": false,

        // If true, this extension will process files in node_modules
        "prettier.withNodeModules": false,

        // Assigns the issue you're working on to you. Only applies when the issue you're working on is in a repo you currently have open.
        "githubIssues.assignWhenWorking": true,

        // Controls whether an issue number (ex. #1234) or a full url (ex. https://github.com/owner/name/issues/1234) is inserted when the Create Issue code action is run.
        "githubIssues.createInsertFormat": "number",

        // Strings that will cause the 'Create issue from comment' code action to show.
        "githubIssues.createIssueTriggers": [
          "TODO",
          "todo",
          "BUG",
          "FIXME",
          "ISSUE",
          "HACK",
        ],

        // Languages that the '#' character should not be used to trigger issue completion suggestions.
        "githubIssues.ignoreCompletionTrigger": [
          "coffeescript",
          "diff",
          "dockerfile",
          "dockercompose",
          "ignore",
          "ini",
          "julia",
          "makefile",
          "perl",
          "powershell",
          "python",
          "r",
          "ruby",
          "shellscript",
          "yaml",
        ],

        // An array of milestones titles to never show issues from.
        "githubIssues.ignoreMilestones": [],

        // Languages that the '@' character should not be used to trigger user completion suggestions.
        "githubIssues.ignoreUserCompletionTrigger": ["python"],

        // Advanced settings for the name of the branch that is created when you start working on an issue.
        // - `${user}` will be replace with the currently logged in username
        // - `${issueNumber}` will be replaced with the current issue number
        // - `${sanitizedIssueTitle}` will be replaced with the issue title, with all spaces and unsupported characters (https://git-scm.com/docs/git-check-ref-format) removed
        "githubIssues.issueBranchTitle": "${user}/issue${issueNumber}",

        // Sets the format of issue completions in the SCM inputbox.
        // - `${user}` will be replace with the currently logged in username
        // - `${issueNumber}` will be replaced with the current issue number
        // - `${issueNumberLabel}` will be replaced with a label formatted as #number or owner/repository#number, depending on whether the issue is in the current repository
        "githubIssues.issueCompletionFormatScm":
          "${issueTitle} ${issueNumberLabel}",

        // Controls whether completion suggestions are shown for issues.
        "githubIssues.issueCompletions.enabled": true,

        // Specifies what queries should be used in the GitHub issues tree using [GitHub search syntax](https://help.github.com/en/articles/understanding-the-search-syntax) with variables. The first query listed will be expanded in the Issues view. The "default" query includes issues assigned to you by Milestone. If you want to preserve these, make sure they are still in the array when you modify the setting.
        "githubIssues.queries": [
          {
            label: "My Issues",
            query: "default",
          },
          {
            label: "Created Issues",
            query:
              "author:${user} state:open repo:${owner}/${repository} sort:created-desc",
          },
          {
            label: "Recent Issues",
            query: "state:open repo:${owner}/${repository} sort:updated-desc",
          },
        ],

        // Determines whether a branch should be checked out when working on an issue. To configure the name of the branch, set `githubIssues.issueBranchTitle`.
        //  - on: A branch will always be checked out when you start working on an issue. If the branch doesn't exist, it will be created.
        //  - off: A branch will not be created when you start working on an issue. If you have worked on an issue before and a branch was created for it, that same branch will be checked out.
        //  - prompt: A prompt will show for setting the name of the branch that will be created and checked out.
        "githubIssues.useBranchForIssues": "on",

        // Controls whether completion suggestions are shown for users.
        "githubIssues.userCompletions.enabled": true,

        // Sets the format of the commit message that is set in the SCM inputbox when you **Start Working on an Issue**. Defaults to `${issueTitle}
        // Fixes #${issueNumber}`
        "githubIssues.workingIssueFormatScm":
          "${issueTitle} \nFixes ${issueNumberLabel}",

        // All pull requests created with this extension will be assigned to this user. To assign to yourself, use the '${user}' variable.
        "githubPullRequests.assignCreated": "",

        // Controls whether comments are expanded when a document with comments is opened.
        //  - expandUnresolved: All unresolved comments will be expanded.
        //  - collapseAll: All comments will be collapsed
        "githubPullRequests.commentExpandState": "expandUnresolved",

        // Whether the "Draft" checkbox will be checked by default when creating a pull request.
        "githubPullRequests.createDraft": false,

        // Create a pull request when a branch is published.
        //  - never: Never create a pull request when a branch is published.
        //  - ask: Ask if you want to create a pull request when a branch is published.
        "githubPullRequests.createOnPublishBranch": "ask",

        // The default comment type to use when submitting a comment and there is no active review
        //  - single: Submits the comment as a single comment that will be immediately visible to other users
        //  - review: Submits the comment as a review comment that will be visible to other users once the review is submitted
        "githubPullRequests.defaultCommentType": "single",

        // When true, the option to delete the local branch will be selected by default when deleting a branch from a pull request.
        "githubPullRequests.defaultDeletionMethod.selectLocalBranch": true,

        // When true, the option to delete the remote will be selected by default when deleting a branch from a pull request.
        "githubPullRequests.defaultDeletionMethod.selectRemote": true,

        // The method to use when merging pull requests.
        "githubPullRequests.defaultMergeMethod": "merge",

        // Enables experimental quick diff in the editor gutter for checked-out pull requests. Requires a reload to take effect
        "githubPullRequests.experimental.quickDiff": false,

        // The layout to use when displaying changed files list.
        "githubPullRequests.fileListLayout": "tree",

        // The layout to use when a pull request is checked out. Set to false to prevent layout changes.
        "githubPullRequests.focusedMode": "firstDiff",

        // Prevents branches that are associated with a pull request from being automatically detected. This will prevent review mode from being entered on these branches.
        "githubPullRequests.ignoredPullRequestBranches": [],

        // The setting `githubPullRequests.includeRemotes` has been deprecated. Use `githubPullRequests.remotes` to configure what remotes are shown.
        // By default we only support remotes created by users. If you want to see pull requests from remotes this extension created for pull requests, change this setting to 'all'.
        "githubPullRequests.includeRemotes": "default",

        // Logging for GitHub Pull Request extension. The log is emitted to the output channel named as GitHub Pull Request.
        "githubPullRequests.logLevel": "info",

        // If GitHub notifications should be shown to the user.
        "githubPullRequests.notifications": "off",

        // The default branch for a repository is set on github.com. With this setting, you can override that default with another branch.
        "githubPullRequests.overrideDefaultBranch": "",

        // The action to take after creating a pull request.
        //  - none: No action
        //  - openOverview: Open the overview page of the pull request
        //  - checkoutDefaultBranch: Checkout the default branch of the repository
        "githubPullRequests.postCreate": "openOverview",

        // Pull changes from the remote when a PR branch is checked out locally. Changes are detected when the PR is manually refreshed and during periodic background updates.
        //  - prompt: Prompt to pull a PR branch when changes are detected in the PR.
        //  - never: Never pull a PR branch when changes are detected in the PR.
        //  - always: Always pull a PR branch when changes are detected in the PR. When `"git.autoStash": true` this will instead `prompt` to prevent unexpected file changes.
        "githubPullRequests.pullBranch": "prompt",

        // The description used when creating pull requests.
        //  - template: Use a pull request template and commit description, or just use the commit description if no templates were found
        //  - commit: Use the latest commit message only
        "githubPullRequests.pullRequestDescription": "template",

        // The pull request title now uses the same defaults as GitHub, and can be edited before create.
        // The title used when creating pull requests.
        //  - commit: Use the latest commit message
        //  - branch: Use the branch name
        //  - custom: Specify a custom title
        //  - ask: Ask which of the above methods to use
        "githubPullRequests.pullRequestTitle": "ask",

        // Push the "from" branch when creating a PR and the "from" branch is not available on the remote.
        //  - prompt: Prompt to push the branch when creating a PR and the "from" branch is not available on the remote.
        //  - always: Always push the branch when creating a PR and the "from" branch is not available on the remote.
        "githubPullRequests.pushBranch": "prompt",

        // Specifies what queries should be used in the GitHub Pull Requests tree. All queries are made against **the currently opened repos**. Each query object has a `label` that will be shown in the tree and a search `query` using [GitHub search syntax](https://help.github.com/en/articles/understanding-the-search-syntax). The variable `${user}` can be used to specify the logged in user within a search. By default these queries define the categories "Waiting For My Review", "Assigned To Me" and "Created By Me". If you want to preserve these, make sure they are still in the array when you modify the setting.
        "githubPullRequests.queries": [
          {
            label: "Waiting For My Review",
            query: "is:open review-requested:${user}",
          },
          {
            label: "Assigned To Me",
            query: "is:open assignee:${user}",
          },
          {
            label: "Created By Me",
            query: "is:open author:${user}",
          },
        ],

        // List of remotes, by name, to fetch pull requests from.
        "githubPullRequests.remotes": ["origin", "upstream"],

        // This setting is deprecated. Views can now be dragged to any location.
        // When true, show GitHub Pull Requests within the SCM viewlet. Otherwise show a separate view container for them.
        "githubPullRequests.showInSCM": false,

        // Default handler for terminal links.
        //  - github: Create the pull request on GitHub
        //  - vscode: Create the pull request in VS Code
        //  - ask: Ask which method to use
        "githubPullRequests.terminalLinksHandler": "ask",

        // Choose which pull request states will use review mode. "Open" pull requests will always use review mode.
        "githubPullRequests.useReviewMode": {
          merged: true,
          closed: false,
        },

        // Enables various accessibility features, such as audio cues about what is happening in the session.
        "liveshare.accessibility.accessibilityFeaturesEnabled": "auto",

        // Output device to play audio in accessibility mode.
        "liveshare.accessibility.outputDevice": "Default",

        // Enables sound effects about activity.
        "liveshare.accessibility.soundsEnabled": true,

        // Controls the volume of sound audio in accessibility mode (between 0 and 100).
        "liveshare.accessibility.soundVolume": 100,

        // Controls the rate of speech in accessibility mode.
        "liveshare.accessibility.speechRate": 2,

        // The voice used for speech in accessibility mode.
        "liveshare.accessibility.voice": "en-US-Jenny",

        // Enables spoken announcements about activity.
        "liveshare.accessibility.voiceEnabled": true,

        // Controls the volume of voice audio in accessibility mode (between 0 and 100).
        "liveshare.accessibility.voiceVolume": 100,

        // Allow guests to start and stop debugging sessions.
        "liveshare.allowGuestDebugControl": false,

        // Allow guests to run and terminate workspace tasks.
        "liveshare.allowGuestTaskControl": false,

        // Specifies who to allow session invitations from.
        "liveshare.allowInvites": "contacts",

        // Ensures that the session's host is always followed.
        "liveshare.alwaysFollowHost": false,

        // Controls how to handle join requests from anonymous guests.
        "liveshare.anonymousGuestApproval": "prompt",

        // Controls whether web servers are automatically shared, when started from the integrated terminal or well-known extensions.
        "liveshare.autoShareServers": true,

        // Controls whether terminals are automatically shared with guests (read-only).
        "liveshare.autoShareTerminals": true,

        // Controls whether to show the CodeLens for starting a collaboration session.
        "liveshare.codeLens": true,

        // Controls whether to allow comments in collaboration sessions
        "liveshare.comments": true,

        // Type of connection used for collaboration; the default (auto) mode prefers a direct connection, but may fallback to a cloud relay if the direct connection failed.
        "liveshare.connectionMode": "auto",

        // Enables the Visual Studio Live Share output channel.
        "liveshare.diagnosticLogging": false,

        // Specifies the level of logging output from Visual Studio Live Share Extension
        "liveshare.diagnosticLoggingLevel": "Warning",

        // Enables diagnostic notifications and logs.
        "liveshare.diagnosticMode": false,

        // Controls set of active features. By selecting `insiders`, you agree to the [Pre-Release Software License Terms](https://aka.ms/vsls-license-preview) and [Privacy Statement](https://aka.ms/vsls-privacy).
        "liveshare.featureSet": "stable",

        // Specifies how to respond to focus requests from other participants.
        "liveshare.focusBehavior": "accept",

        // Controls whether the host needs to explicitly approve guest requests to join collaboration sessions.
        "liveshare.guestApprovalRequired": false,

        // Increases the guest limit from 5 to 30.
        "liveshare.increasedGuestLimit": true,

        // Controls how the participant will join incoming shared debug sessions.
        "liveshare.joinDebugSessionOption": "Automatic",

        // Sets the number of seconds to wait before sending keep-alive messages in an idle session, used to detect abnormal network disconnection. Set to -1 to disable sending keep-alive messages.
        "liveshare.keepAliveInterval": 20,

        // Allow guests to run arbitrary commands via Code Actions (“Quick Fixes”) and CodeLens
        "liveshare.languages.allowGuestCommandControl": false,

        // Specifies the client to launch when clicking on a Live Share URL.
        "liveshare.launcherClient": "web",

        // Controls when to display a participant's name tag instead of just their cursor.
        "liveshare.nameTagVisibility": "Activity",

        // Allow guests to run notebook cells
        "liveshare.notebooks.allowGuestExecuteCells": false,

        // Controls whether to automatically open shared servers in your default browser.
        "liveshare.openSharedServers": true,

        // Specifies when to automatically populate your Git commit message with guest attribution (using the Git-co-author trailer).
        "liveshare.populateGitCoAuthors": "always",

        // Controls whether to publish your presence to other users, and allow in-tool invites for collaboration sessions
        "liveshare.presence": false,

        // Controls whether to publish your current workspace folder to other users
        "liveshare.publishWorkspaceInfo": false,

        // Height of shared terminal window, characters.
        "liveshare.sharedTerminalHeight": 50,

        // Width of shared terminal window, characters.
        "liveshare.sharedTerminalWidth": 120,

        // Automatically share external files opened by the host during a collaboration session.
        "liveshare.shareExternalFiles": true,

        // Show or hide the Live Share status bar items.
        "liveshare.showInStatusBar": "always",

        // Controls visibility of the cursor and highlights for read-only users.
        "liveshare.showReadOnlyUsersInEditor": "whileFollowing",

        // Controls whether to show verbose notifications, such as when a guest joins and leaves a session.
        "liveshare.showVerboseNotifications": true,

        // EDITED Moved all overrides to the bottom

        // Configure settings to be overridden for the clojure language.
        "[clojure]": {
          "diffEditor.ignoreTrimWhitespace": false,
        },

        // Configure settings to be overridden for the coffeescript language.
        "[coffeescript]": {
          "diffEditor.ignoreTrimWhitespace": false,
        },

        // Configure settings to be overridden for the csharp language.
        "[csharp]": {
          "editor.maxTokenizationLineLength": 2500,
        },

        // Configure settings to be overridden for the css language.
        "[css]": {
          "editor.suggest.insertMode": "replace",
        },

        // Configure settings to be overridden for the dockercompose language.
        "[dockercompose]": {
          // EDITED Sorting
          "editor.autoIndent": "advanced",
          "editor.insertSpaces": true,
          "editor.tabSize": 2,
        },

        // Configure settings to be overridden for the dockerfile language.
        "[dockerfile]": {
          "editor.quickSuggestions": {
            strings: true,
          },
        },

        // Configure settings to be overridden for the fsharp language.
        "[fsharp]": {
          "diffEditor.ignoreTrimWhitespace": false,
        },

        // Configure settings to be overridden for the git-commit language.
        "[git-commit]": {
          "editor.rulers": [72],
          "workbench.editor.restoreViewState": false,
        },

        // Configure settings to be overridden for the git-rebase language.
        "[git-rebase]": {
          "workbench.editor.restoreViewState": false,
        },

        // Configure settings to be overridden for the go language.
        "[go]": {
          "editor.insertSpaces": false,
        },

        // Configure settings to be overridden for the handlebars language.
        "[handlebars]": {
          "editor.suggest.insertMode": "replace",
        },

        // Configure settings to be overridden for the html language.
        "[html]": {
          "editor.suggest.insertMode": "replace",
        },

        // Configure settings to be overridden for the jade language.
        "[jade]": {
          "diffEditor.ignoreTrimWhitespace": false,
        },

        // Configure settings to be overridden for the javascript language.
        "[javascript]": {
          "editor.maxTokenizationLineLength": 2500,
        },

        // Configure settings to be overridden for the json language.
        "[json]": {
          "editor.quickSuggestions": {
            strings: true,
          },
          "editor.suggest.insertMode": "replace",
        },

        // Configure settings to be overridden for the jsonc language.
        "[jsonc]": {
          "editor.quickSuggestions": {
            strings: true,
          },
          "editor.suggest.insertMode": "replace",
        },

        // Configure settings to be overridden for the less language.
        "[less]": {
          "editor.suggest.insertMode": "replace",
        },

        // Configure settings to be overridden for the makefile language.
        "[makefile]": {
          "editor.insertSpaces": false,
        },

        // Configure settings to be overridden for the markdown language.
        "[markdown]": {
          // EDITED diffEditor. above editor.
          "diffEditor.ignoreTrimWhitespace": false,
          // EDITED sorting
          "editor.quickSuggestions": {
            comments: "off",
            strings: "off",
            other: "off",
          },
          "editor.unicodeHighlight.ambiguousCharacters": false,
          "editor.unicodeHighlight.invisibleCharacters": false,
          "editor.wordWrap": "on",
        },

        // Configure settings to be overridden for the plaintext language.
        "[plaintext]": {
          "editor.unicodeHighlight.ambiguousCharacters": false,
          "editor.unicodeHighlight.invisibleCharacters": false,
        },

        // Configure settings to be overridden for the python language.
        "[python]": {
          "diffEditor.ignoreTrimWhitespace": false,
        },

        // Configure settings to be overridden for the scss language.
        "[scss]": {
          "editor.suggest.insertMode": "replace",
        },

        // Configure settings to be overridden for the search-result language.
        "[search-result]": {
          "editor.lineNumbers": "off",
        },

        // Configure settings to be overridden for the shellscript language.
        "[shellscript]": {
          "files.eol": "\n",
        },

        // Configure settings to be overridden for the yaml language.
        "[yaml]": {
          // EDITED diffEditor. above editor.
          "diffEditor.ignoreTrimWhitespace": false,
          // EDITED sorting
          "editor.autoIndent": "advanced",
          "editor.insertSpaces": true,
          "editor.tabSize": 2,
        },
      }));

    it.todo("https://code.visualstudio.com/docs/editor/intellisense#_settings");

    it.todo(
      "https://code.visualstudio.com/docs/editor/workspace-trust#_enabling-extensions"
    );

    it.todo("https://code.visualstudio.com/docs/terminal/profiles");

    it.todo(
      "https://code.visualstudio.com/docs/languages/powershell#_typesps1xml-and-formatps1xml-files"
    );

    it("https://code.visualstudio.com/docs/devcontainers/containers#_personalizing-with-dotfile-repositories", () =>
      expectExample({
        "dotfiles.repository": "your-github-id/your-dotfiles-repo",
        "dotfiles.targetPath": "~/dotfiles",
        "dotfiles.installCommand": "~/dotfiles/install.sh",
      }));

    it("https://code.visualstudio.com/docs/java/java-project#_manage-dependencies-for-unmanaged-folder Exclude some libraries", () =>
      expectExample({
        "java.project.referencedLibraries": {
          include: ["library/**/*.jar", "/home/username/lib/foo.jar"],
          exclude: ["library/sources/**"],
        },
      }));

    it("https://code.visualstudio.com/docs/java/java-project#_manage-dependencies-for-unmanaged-folder Attach source jars", () =>
      expectExample({
        "java.project.referencedLibraries": {
          include: ["library/**/*.jar", "/home/username/lib/foo.jar"],
          exclude: ["library/sources/**"],
          sources: {
            "library/bar.jar": "library/sources/bar-src.jar",
          },
        },
      }));

    it("https://code.visualstudio.com/Docs/languages/json#_mapping-in-the-user-settings", () =>
      expectExample({
        "json.schemas": [
          {
            fileMatch: ["/.babelrc"],
            url: "https://json.schemastore.org/babelrc",
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/languages/json#_mapping-to-a-schema-in-the-workspace", () =>
      expectExample({
        "json.schemas": [
          {
            fileMatch: ["/*.foo.json"],
            url: "./myschema.json",
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/languages/json#_mapping-to-a-schema-defined-in-settings", () =>
      expectExample({
        "json.schemas": [
          {
            fileMatch: ["/.myconfig"],
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the entry",
                },
              },
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/languages/json#_define-snippets-in-json-schemas", () =>
      expectExample({
        "json.schemas": [
          {
            schema: {
              type: "array",
              title: "Keybindings configuration",
              items: {
                type: "object",
                required: ["key"],
                defaultSnippets: [
                  {
                    label: "New keybinding",
                    description: "Binds a key to a command for a given state",
                    body: { key: "$1", command: "$2", when: "$3" },
                  },
                ],
                properties: {
                  key: {
                    type: "string",
                  },
                  // ...
                },
              },
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/Docs/languages/json#_use-rich-formatting-in-hovers", () =>
      expectExample({
        "json.schemas": [
          {
            schema: {
              $schema: "http://json-schema.org/schema",
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the entry",
                  markdownDescription:
                    "The name of the entry. [See the documentation](https://example.com)",
                },
              },
            },
          },
        ],
      }));
  }
);

describe.each([{ filename: "snippets/language.json", format: formatJSON }])(
  "%p",
  () => {
    it.todo(
      "https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets"
    );
  }
);

describe.each([{ filename: "snippets.json", format: formatJSON }])("%p", () => {
  it.todo(
    "https://code.visualstudio.com/docs/editor/emmet#_using-custom-emmet-snippets"
  );
});

describe.each([{ filename: ".vscode/tasks.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://code.visualstudio.com/docs/getstarted/tips-and-tricks#_auto-detect-tasks", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        tasks: [
          {
            type: "npm",
            script: "install",
            group: {
              kind: "build",
              isDefault: true,
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_typescript-hello-world", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        tasks: [
          {
            type: "typescript",
            tsconfig: "tsconfig.json",
            problemMatcher: ["$tsc"],
            group: {
              kind: "build",
              isDefault: true,
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_task-autodetection", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        tasks: [
          {
            type: "npm",
            script: "lint",
            problemMatcher: ["$eslint-stylish"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_custom-tasks", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        tasks: [
          {
            label: "Run tests",
            type: "shell",
            command: "./scripts/test.sh",
            group: "test",
            presentation: {
              reveal: "always",
              panel: "new",
            },
            // EDITED put windows at bottom
            windows: {
              command: ".\\scripts\\test.cmd",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_custom-tasks 1", () =>
      expectExample({
        tasks: [
          {
            label: "dir",
            type: "shell",
            command: "dir 'folder with spaces'",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_custom-tasks 2", () =>
      expectExample({
        tasks: [
          {
            label: "dir",
            type: "shell",
            command: "dir",
            args: ["folder with spaces"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_custom-tasks 3", () =>
      expectExample({
        tasks: [
          {
            label: "dir",
            type: "shell",
            command: "dir",
            args: [
              {
                value: "folder with spaces",
                quoting: "escape",
              },
            ],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_compound-tasks", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "Client Build",
            command: "gulp",
            args: ["build"],
            options: {
              cwd: "${workspaceFolder}/client",
            },
          },
          {
            label: "Server Build",
            command: "gulp",
            args: ["build"],
            options: {
              cwd: "${workspaceFolder}/server",
            },
          },
          {
            label: "Build",
            dependsOn: ["Client Build", "Server Build"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_compound-tasks dependsOrder", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "One",
            type: "shell",
            command: "echo Hello ",
            dependsOrder: "sequence",
            dependsOn: ["Two", "Three"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_output-behavior", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        tasks: [
          {
            type: "npm",
            script: "lint",
            problemMatcher: ["$eslint-stylish"],
            presentation: {
              reveal: "never",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_output-behavior 1", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        tasks: [
          {
            type: "npm",
            script: "lint",
            problemMatcher: ["$eslint-stylish"],
            presentation: {
              reveal: "never",
            },
          },
          {
            label: "Run tests",
            type: "shell",
            command: "./scripts/test.sh",
            group: "test",
            presentation: {
              reveal: "always",
              panel: "new",
            },
            // EDITED put windows at bottom
            windows: {
              command: ".\\scripts\\test.cmd",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_variable-substitution", () =>
      expectExample({
        tasks: [
          {
            label: "TypeScript compile",
            type: "shell",
            command: "tsc ${file}",
            problemMatcher: ["$tsc"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_variable-substitution 1", () =>
      expectExample({
        tasks: [
          {
            label: "autopep8 current file",
            type: "process",
            command: "${config:python.formatting.autopep8Path}",
            args: ["--in-place", "${file}"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_operating-system-specific-properties", () =>
      expectExample({
        tasks: [
          {
            label: "Run Node",
            type: "process",
            // EDITED put linux before windows
            linux: {
              command: "/usr/bin/node",
            },
            windows: {
              command: "C:\\Program Files\\nodejs\\node.exe",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_operating-system-specific-properties presentation", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        presentation: {
          panel: "new",
        },
        tasks: [
          {
            label: "TS - Compile current file",
            type: "shell",
            command: "tsc ${file}",
            problemMatcher: ["$tsc"],
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_character-escaping-in-powershell", () =>
      expectExample({
        tasks: [
          {
            label: "PowerShell example 1 (unexpected escaping)",
            type: "shell",
            command: 'Get-ChildItem "Folder With Spaces"',
          },
          {
            label: "PowerShell example 2 (expected escaping)",
            type: "shell",
            command: "Get-ChildItem",
            args: ["Folder With Spaces"],
          },
          {
            label: "PowerShell example 3 (manual escaping)",
            type: "shell",
            command: '& Get-ChildItem \\"Folder With Spaces\\"',
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_defining-a-problem-matcher", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "build",
            command: "gcc",
            args: ["-Wall", "helloWorld.c", "-o", "helloWorld"],
            problemMatcher: {
              owner: "cpp",
              fileLocation: ["relative", "${workspaceFolder}"],
              pattern: {
                regexp: "^(.*):(\\d+):(\\d+):\\s+(warning|error):\\s+(.*)$",
                file: 1,
                line: 2,
                column: 3,
                severity: 4,
                message: 5,
              },
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_defining-a-multiline-problem-matcher", () =>
      expectExample({
        tasks: [
          {
            problemMatcher: {
              owner: "javascript",
              fileLocation: ["relative", "${workspaceFolder}"],
              pattern: [
                {
                  regexp: "^([^\\s].*)$",
                  file: 1,
                },
                {
                  regexp:
                    "^\\s+(\\d+):(\\d+)\\s+(error|warning|info)\\s+(.*)\\s\\s+(.*)$",
                  line: 1,
                  column: 2,
                  severity: 3,
                  // EDITED put code before message
                  code: 5,
                  message: 4,
                },
              ],
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_defining-a-multiline-problem-matcher eslint", () =>
      expectExample({
        tasks: [
          {
            problemMatcher: {
              owner: "javascript",
              fileLocation: ["relative", "${workspaceFolder}"],
              pattern: [
                {
                  regexp: "^([^\\s].*)$",
                  file: 1,
                },
                {
                  regexp:
                    "^\\s+(\\d+):(\\d+)\\s+(error|warning|info)\\s+(.*)\\s\\s+(.*)$",
                  line: 1,
                  column: 2,
                  severity: 3,
                  // EDITED put code before message
                  code: 5,
                  message: 4,
                  loop: true,
                },
              ],
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_modifying-an-existing-problem-matcher", () =>
      expectExample({
        tasks: [
          {
            type: "npm",
            script: "watch",
            // EDITED put isBackground before problemMatcher
            isBackground: true,
            problemMatcher: {
              base: "$tsc-watch",
              applyTo: "allDocuments",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_background-watching-tasks", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "watch",
            command: "tsc",
            args: ["--watch"],
            isBackground: true,
            problemMatcher: {
              owner: "typescript",
              fileLocation: "relative",
              pattern: {
                regexp:
                  "^([^\\s].*)\\((\\d+|\\d+,\\d+|\\d+,\\d+,\\d+,\\d+)\\):\\s+(error|warning|info)\\s+(TS\\d+)\\s*:\\s*(.*)$",
                file: 1,
                location: 2,
                severity: 3,
                code: 4,
                message: 5,
              },
              background: {
                activeOnStart: true,
                beginsPattern:
                  "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - File change detected\\. Starting incremental compilation\\.\\.\\.",
                endsPattern:
                  "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - Compilation complete\\. Watching for file changes\\.",
              },
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/tasks#_can-a-task-use-a-different-shell-than-the-one-specified-for-the-integrated-terminal", () =>
      expectExample({
        version: "2.0.0",
        windows: {
          options: {
            shell: {
              executable: "cmd.exe",
              args: ["/d", "/c"],
            },
          },
        },
      }));

    it("https://code.visualstudio.com/docs/editor/variables-reference#_input-variables", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "task name",
            command: "${input:variableID}",
            // ...
          },
        ],
        inputs: [
          {
            id: "variableID",
            type: "type of input variable",
            // type specific configuration attributes
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/variables-reference#_input-variables angular cli", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "ng g",
            type: "shell",
            command: "ng",
            args: ["g", "${input:componentType}", "${input:componentName}"],
          },
        ],
        inputs: [
          {
            // EDITED put id before type
            id: "componentType",
            type: "pickString",
            description: "What type of component do you want to create?",
            options: [
              "component",
              "directive",
              "pipe",
              "service",
              "class",
              "guard",
              "interface",
              "enum",
            ],
            default: "component",
          },
          {
            // EDITED put id before type
            id: "componentName",
            type: "promptString",
            description: "Name your component.",
            default: "my-new-component",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/variables-reference#_input-variables terminateAll", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "Terminate All Tasks",
            // EDITED put type before command
            type: "shell",
            command: "echo ${input:terminate}",
            problemMatcher: [],
          },
        ],
        inputs: [
          {
            id: "terminate",
            type: "command",
            command: "workbench.action.tasks.terminate",
            args: "terminateAll",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/terminal/basics", () =>
      expectExample({
        version: "2.0.0",
        presentation: {
          echo: false,
          reveal: "always",
          focus: false,
          panel: "dedicated",
          showReuseMessage: true,
        },
        tasks: [
          {
            label: "Create terminals",
            dependsOn: ["First", "Second"],
            // Mark as the default build task so cmd/ctrl+shift+b will create them
            group: {
              kind: "build",
              isDefault: true,
            },
            // Try start the task on folder open
            runOptions: {
              runOn: "folderOpen",
            },
          },
          {
            // The name that shows up in terminal tab
            label: "First",
            // The task will launch a shell
            type: "shell",
            command: "",
            // Set the shell type
            options: {
              shell: {
                executable: "cmd.exe",
                args: [],
              },
            },
            // Mark as a background task to avoid the spinner animation on the terminal tab
            isBackground: true,
            problemMatcher: [],
            // Create the tasks in a terminal group
            presentation: {
              group: "my-group",
            },
          },
          {
            label: "Second",
            type: "shell",
            command: "",
            options: {
              shell: {
                executable: "pwsh.exe",
                args: [],
              },
            },
            isBackground: true,
            problemMatcher: [],
            presentation: {
              group: "my-group",
            },
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/languages/css", () =>
      expectExample({
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        version: "2.0.0",
        tasks: [
          {
            label: "Sass Compile",
            type: "shell",
            command: "sass styles.scss styles.css",
            group: "build",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/nodejs/working-with-javascript#_running-babel", () =>
      expectExample({
        version: "2.0.0",
        tasks: [
          {
            label: "watch",
            // EDITED type above command
            type: "shell",
            command: "${workspaceFolder}/node_modules/.bin/babel",
            args: ["src", "--out-dir", "lib", "-w", "--source-maps"],
            // EDITED isBackground above group
            isBackground: true,
            group: { kind: "build", isDefault: true },
          },
        ],
      }));
  }
);

describe.each([{ filename: "arbitrary.code-workspace", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://code.visualstudio.com/docs/editor/multi-root-workspaces#_workspace-file-schema", () =>
      expectExample({
        folders: [
          {
            // Source code
            name: "Product",
            path: "vscode",
          },
          {
            // Docs and release notes
            name: "Documentation",
            path: "vscode-docs",
          },
          {
            // Yeoman extension generator
            name: "Extension generator",
            path: "vscode-generator-code",
          },
        ],
      }));

    it("https://code.visualstudio.com/docs/editor/multi-root-workspaces#_settings", () =>
      expectExample({
        folders: [
          {
            path: "vscode",
          },
          {
            path: "vscode-docs",
          },
          {
            path: "vscode-generator-code",
          },
        ],
        settings: {
          "window.zoomLevel": 1,
          "files.autoSave": "afterDelay",
        },
      }));

    it("https://code.visualstudio.com/docs/editor/multi-root-workspaces#_workspace-launch-configurations", () =>
      expectExample({
        folders: [
          {
            path: "Server",
          },
          {
            path: "Client",
          },
        ],
        settings: {},
        launch: {
          configurations: {},
          compounds: {},
        },
      }));

    it("https://code.visualstudio.com/docs/editor/multi-root-workspaces#_workspace-task-configuration", () =>
      expectExample({
        folders: [],
        tasks: [],
      }));

    it("https://code.visualstudio.com/docs/editor/multi-root-workspaces#_extension-recommendations", () =>
      expectExample({
        folders: [
          {
            path: "vscode",
          },
          {
            path: "vscode-docs",
          },
        ],
        extensions: {
          recommendations: [
            // EDITED sorted and uniqed
            "dbaeumer.vscode-eslint",
            "eg2.tslint",
            "esbenp.prettier-vscode",
          ],
        },
      }));
  }
);
