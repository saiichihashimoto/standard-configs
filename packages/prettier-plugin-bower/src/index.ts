import { type Config, indexOf } from "@configs/config";
import { jsonPlugin } from "@configs/plugin-json";

const bowerConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "cwd",
          "directory",
          "registry",
          "shorthand-resolver",
          "proxy",
          "https-proxy",
          "ca",
          "color",
          "timeout",
          "save",
          "save-exact",
          "strict-ssl",
          "storage",
          "interactive",
          "resolvers",
          "shallowCloneHosts",
          "scripts",
          "ignoredDependencies",
        ]),
      ],
    },
    {
      path: /^scripts$/,
      sortKeys: [
        indexOf(["preinstall", "postinstall", "preuninstall", "postuninstall"]),
      ],
    },
    {
      path: /^storage$/,
      sortKeys: [indexOf(["packages", "registry", "links"])],
    },
  ],
};

export const bowerJSONConfigs = {
  ".bowerrc": { ...bowerConfig, parsers: ["json"] },
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(bowerJSONConfigs);
