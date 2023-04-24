import { formatJSON } from "@standard-configs/plugin-json/src/test-utils";
import { formatYAML } from "@standard-configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

describe.each([
  { filename: ".releaserc.json", format: formatJSON },
  { filename: ".releaserc.yaml", format: formatYAML },
  { filename: ".releaserc.yml", format: formatYAML },
  { filename: ".releaserc", format: formatJSON },
  // TODO { filename: ".releaserc", format: formatYAML },
])("%p", ({ filename, format }) => {
  const { expectExample } = format(filename, plugin);

  it("https://github.com/semantic-release/semantic-release/blob/master/docs/developer-guide/js-api.md#usage", () =>
    expectExample({
      // Core options
      branches: [
        "+([0-9])?(.{+([0-9]),x}).x",
        "master",
        "next",
        "next-major",
        { name: "beta", prerelease: true },
        { name: "alpha", prerelease: true },
      ],
      repositoryUrl: "https://github.com/me/my-package.git",
      // Shareable config
      extends: "my-shareable-config",
      // Plugin options
      githubUrl: "https://my-ghe.com",
      githubApiPathPrefix: "/api-prefix",
    }));

  it("https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md#name", () =>
    expectExample({
      branches: [
        { name: "1.x", range: "1.x", channel: "1.x" }, // Only after the `1.x` is created in the repo
        { name: "2.x", range: "2.x", channel: "2.x" }, // Only after the `2.x` is created in the repo
        { name: "master" },
        { name: "next", channel: "next" }, // Only after the `next` is created in the repo
      ],
    }));

  it("https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md#channel", () =>
    expectExample({
      branches: [
        { name: "master" }, // `channel` is undefined so the default distribution channel will be used
        { name: "next", channel: "channel-next" }, // `channel` is built with the template `channel-${name}`
      ],
    }));

  it("https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md#range", () =>
    expectExample({
      branches: [
        { name: "1.1.x", range: "1.1.x", channel: "1.1.x" },
        { name: "1.2.x", range: "1.2.x", channel: "1.2.x" },
        { name: "master" },
      ],
    }));

  it("https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md#prerelease", () =>
    expectExample({
      branches: [
        { name: "master" },
        { name: "pre/rc", channel: "pre/rc", prerelease: "rc" }, // `prerelease` is built with the template `${name.replace(/^pre\\//g, "")}`
        { name: "beta", channel: "beta", prerelease: true }, // `prerelease` is set to `beta` as it is the value of `name`
      ],
    }));
});
