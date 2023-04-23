import { formatJSON } from "@configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: ".bowerrc", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://bower.io/docs/config/#bowerrc-specification", () =>
      expectExample({
        "cwd": "~/.my-project",
        "directory": "bower_components",
        "registry": "https://registry.bower.io",
        "shorthand-resolver": "git://github.com//.git",
        "proxy": "http://proxy.local",
        "https-proxy": "http://proxy.local",
        "ca": "/var/certificate.pem",
        "color": true,
        "timeout": 60000,
        "save": true,
        "save-exact": true,
        "strict-ssl": true,
        "storage": {
          packages: "~/.bower/packages",
          registry: "~/.bower/registry",
          links: "~/.bower/links",
        },
        "interactive": true,
        "resolvers": ["mercurial-bower-resolver"],
        "shallowCloneHosts": ["myGitHost.example.com"],
        "scripts": {
          preinstall: "",
          postinstall: "",
          preuninstall: "",
          postuninstall: "",
        },
        "ignoredDependencies": ["jquery"],
      }));
  }
);
