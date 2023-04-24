import { formatJSON } from "@standard-configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: "package.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);
    it("sorts by sort-package-json", () =>
      expect(
        pluginFormat({
          author: "",
          bin: "",
          browser: "",
          bugs: {},
          bundleDependencies: {},
          config: {},
          contributors: [],
          cpu: [],
          dependencies: {},
          description: "",
          devDependencies: {},
          directories: {},
          engines: {},
          files: [],
          funding: {},
          homepage: [],
          keywords: [],
          license: "",
          main: "",
          man: "",
          name: "",
          optionalDependencies: {},
          os: [],
          overrides: {},
          peerDependencies: {},
          peerDependenciesMeta: {},
          private: false,
          publishConfig: {},
          repository: {},
          scripts: {},
          tsup: {},
          version: "",
          workspaces: [],
        })
      ).toStrictEqual(
        defaultFormat({
          name: "",
          version: "",
          private: false,
          description: "",
          keywords: [],
          homepage: [],
          bugs: {},
          repository: {},
          funding: {},
          license: "",
          author: "",
          contributors: [],
          main: "",
          browser: "",
          bin: "",
          man: "",
          directories: {},
          files: [],
          workspaces: [],
          scripts: {},
          config: {},
          tsup: {},
          dependencies: {},
          devDependencies: {},
          peerDependencies: {},
          peerDependenciesMeta: {},
          optionalDependencies: {},
          bundleDependencies: {},
          overrides: {},
          engines: {},
          os: [],
          cpu: [],
          publishConfig: {},
        })
      ));

    it("uniq on some arrays", () =>
      expect(
        pluginFormat({
          categories: ["b", "a", "b"],
          keywords: ["d", "c", "d"],
          files: ["index.js", "a.js", "index.js"],
          activationEvents: ["event", "a", "event"],
        })
      ).toStrictEqual(
        defaultFormat({
          categories: ["b", "a"],
          keywords: ["d", "c"],
          files: ["index.js", "a.js"],
          activationEvents: ["event", "a"],
        })
      ));

    it("sorts bugs by documentation example", () =>
      expect(
        pluginFormat({
          bugs: {
            email: "project@hostname.com",
            url: "https://github.com/owner/project/issues",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          bugs: {
            url: "https://github.com/owner/project/issues",
            email: "project@hostname.com",
          },
        })
      ));

    it("sorts url objects by documentation example", () =>
      expect(
        pluginFormat({
          repository: {
            directory: "packages/react-dom",
            url: "https://github.com/facebook/react.git",
            type: "git",
          },
          funding: { url: "http://example.com/donate", type: "individual" },
          license: { url: "https://opensource.org/licenses/ISC", type: "ISC" },
          licenses: [
            { url: "https://opensource.org/licenses/ISC", type: "ISC" },
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          repository: {
            type: "git",
            url: "https://github.com/facebook/react.git",
            directory: "packages/react-dom",
          },
          funding: { type: "individual", url: "http://example.com/donate" },
          license: { type: "ISC", url: "https://opensource.org/licenses/ISC" },
          licenses: [
            { type: "ISC", url: "https://opensource.org/licenses/ISC" },
          ],
        })
      ));

    it("sorts url objects in funding array by documentation example", () =>
      expect(
        pluginFormat({
          funding: [
            "http://example.com/donate",
            { url: "http://example.com/donate", type: "individual" },
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          funding: [
            "http://example.com/donate",
            { type: "individual", url: "http://example.com/donate" },
          ],
        })
      ));

    it("sorts people objects by documentation example", () =>
      expect(
        pluginFormat({
          author: {
            url: "http://barnyrubble.tumblr.com/",
            email: "b@rubble.com",
            name: "Barney Rubble",
          },
          maintainers: [
            {
              url: "http://barnyrubble.tumblr.com/",
              email: "b@rubble.com",
              name: "Barney Rubble",
            },
          ],
          contributors: [
            {
              url: "http://barnyrubble.tumblr.com/",
              email: "b@rubble.com",
              name: "Barney Rubble",
            },
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          author: {
            name: "Barney Rubble",
            email: "b@rubble.com",
            url: "http://barnyrubble.tumblr.com/",
          },
          maintainers: [
            {
              name: "Barney Rubble",
              email: "b@rubble.com",
              url: "http://barnyrubble.tumblr.com/",
            },
          ],
          contributors: [
            {
              name: "Barney Rubble",
              email: "b@rubble.com",
              url: "http://barnyrubble.tumblr.com/",
            },
          ],
        })
      ));

    it("sorts directories object by sort-package-json", () =>
      expect(
        pluginFormat({
          directories: {
            bin: "bin",
            doc: "doc",
            example: "example",
            lib: "lib",
            man: "man",
            test: "test",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          directories: {
            lib: "lib",
            bin: "bin",
            man: "man",
            doc: "doc",
            example: "example",
            test: "test",
          },
        })
      ));

    it("sorts binary object by sort-package-json", () =>
      expect(
        pluginFormat({
          binary: {
            host: "host",
            module_name: "module_name",
            module_path: "module_path",
            package_name: "package_name",
            remote_path: "remote_path",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          binary: {
            module_name: "module_name",
            module_path: "module_path",
            remote_path: "remote_path",
            package_name: "package_name",
            host: "host",
          },
        })
      ));

    it("uniq and sorts some arrays", () =>
      expect(
        pluginFormat({
          extensionPack: [
            "zobo.php-intellisense",
            "xdebug.php-debug",
            "zobo.php-intellisense",
          ],
          extensionDependencies: [
            "zobo.php-intellisense",
            "xdebug.php-debug",
            "zobo.php-intellisense",
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          extensionPack: ["xdebug.php-debug", "zobo.php-intellisense"],
          extensionDependencies: ["xdebug.php-debug", "zobo.php-intellisense"],
        })
      ));

    it("sorts badges objects by sort-package-json", () =>
      expect(
        pluginFormat({
          badges: [{ description: "description", href: "href", url: "url" }],
        })
      ).toStrictEqual(
        defaultFormat({
          badges: [{ url: "url", href: "href", description: "description" }],
        })
      ));

    it("sorts scripts alphabetically respecting pre- and post- prefixes by", () =>
      expect(
        pluginFormat({
          scripts: {
            build: "build",
            dev: "dev",
            postbuild: "postbuild",
            postdev: "postdev",
            prebuild: "prebuild",
            predev: "predev",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          scripts: {
            prebuild: "prebuild",
            build: "build",
            postbuild: "postbuild",
            predev: "predev",
            dev: "dev",
            postdev: "postdev",
          },
        })
      ));

    it("sorts scripts treating prepare|prepublish|prepublishOnly not like pre(pare|plublish|publishOnly)", () =>
      expect(
        pluginFormat({
          scripts: {
            a: "a",
            pb: "pb",
            posta: "posta",
            postpb: "postpb",
            postprepare: "postprepare",
            postprepublish: "postprepublish",
            postprepublishOnly: "postprepublishOnly",
            postz: "postz",
            prea: "prea",
            prepare: "prepare",
            prepb: "prepb",
            preprepare: "preprepare",
            preprepublish: "preprepublish",
            preprepublishOnly: "preprepublishOnly",
            prepublish: "prepublish",
            prepublishOnly: "prepublishOnly",
            prez: "prez",
            z: "z",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          scripts: {
            prea: "prea",
            a: "a",
            posta: "posta",
            prepb: "prepb",
            pb: "pb",
            postpb: "postpb",
            preprepare: "preprepare",
            prepare: "prepare",
            postprepare: "postprepare",
            preprepublish: "preprepublish",
            prepublish: "prepublish",
            postprepublish: "postprepublish",
            preprepublishOnly: "preprepublishOnly",
            prepublishOnly: "prepublishOnly",
            postprepublishOnly: "postprepublishOnly",
            prez: "prez",
            z: "z",
            postz: "postz",
          },
        })
      ));

    it('sorts scripts putting "nested" scripts before post-', () =>
      expect(
        pluginFormat({
          scripts: {
            "dev:b": "dev:b",
            "dev:a:d": "dev:a:d",
            "dev:a:c": "dev:a:c",
            "dev:a": "run-s dev:a:*",
            "dev": "run-s dev:*",
            "postdev": "postdev",
            "predev": "predev",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          scripts: {
            "predev": "predev",
            "dev": "run-s dev:*",
            "dev:a": "run-s dev:a:*",
            "dev:a:c": "dev:a:c",
            "dev:a:d": "dev:a:d",
            "dev:b": "dev:b",
            "postdev": "postdev",
          },
        })
      ));

    it("sorts ava like an ava config", () =>
      expect(
        pluginFormat({ ava: { concurrency: 0, match: [] } })
      ).toStrictEqual(defaultFormat({ ava: { match: [], concurrency: 0 } })));

    it("sorts babel like an babel config", () =>
      expect(
        pluginFormat({ babel: { plugins: [], presets: [] } })
      ).toStrictEqual(defaultFormat({ babel: { presets: [], plugins: [] } })));

    it("sorts eslintConfig like an eslintrc", () =>
      expect(
        pluginFormat({
          eslintConfig: {
            overrides: [{ excludedFiles: [], files: [] }],
            rules: {},
          },
        })
      ).toStrictEqual(
        defaultFormat({
          eslintConfig: {
            rules: {},
            overrides: [{ files: [], excludedFiles: [] }],
          },
        })
      ));

    it("sorts eslintIgnore like an eslintignore", () =>
      expect(pluginFormat({ eslintIgnore: ["b", "a", "b"] })).toStrictEqual(
        defaultFormat({ eslintIgnore: ["a", "b"] })
      ));

    it("sorts husky like a huskyrc", () =>
      expect(
        pluginFormat({
          husky: {
            hooks: {
              "commit-msg": "commit-msg",
              "prepare-commit-msg": "prepare-commit-msg",
            },
          },
        })
      ).toStrictEqual(
        defaultFormat({
          husky: {
            hooks: {
              "prepare-commit-msg": "prepare-commit-msg",
              "commit-msg": "commit-msg",
            },
          },
        })
      ));

    it("sorts prettier like an prettierrc", () =>
      expect(
        pluginFormat({
          prettier: {
            overrides: [{ options: { semi: false, tabWidth: 0 }, files: [] }],
            parser: "",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          prettier: {
            parser: "",
            overrides: [{ files: [], options: { tabWidth: 0, semi: false } }],
          },
        })
      ));

    it("sorts release like a semantic-release config", () =>
      expect(
        pluginFormat({ release: { extends: "", repositoryUrl: "" } })
      ).toStrictEqual(
        defaultFormat({ release: { repositoryUrl: "", extends: "" } })
      ));

    it("sorts simple-git-hooks like a simple-git-hooks.json", () =>
      expect(
        pluginFormat({
          "simple-git-hooks": {
            "commit-msg": "commit-msg",
            "prepare-commit-msg": "prepare-commit-msg",
          },
        })
      ).toStrictEqual(
        defaultFormat({
          "simple-git-hooks": {
            "prepare-commit-msg": "prepare-commit-msg",
            "commit-msg": "commit-msg",
          },
        })
      ));

    it("sorts tsup like an tsup config", () =>
      expect(pluginFormat({ tsup: { clean: true, entry: [] } })).toStrictEqual(
        defaultFormat({ tsup: { entry: [], clean: true } })
      ));

    describe("examples", () => {
      it.todo("example tests for package.json? use sort-package-json tests?");
    });
  }
);
