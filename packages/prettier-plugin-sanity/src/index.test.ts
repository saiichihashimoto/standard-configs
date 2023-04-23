import { formatJSON } from "@configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: "sanity.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://www.sanity.io/v2-docs/sanity-json", () =>
      expectExample({
        root: true,
        project: {
          name: "Movies",
          basePath: "/studio",
        },
        api: {
          projectId: "<yourProjectID>",
          dataset: "production",
        },
        plugins: [
          "@sanity/base",
          "@sanity/components",
          "@sanity/default-layout",
          "@sanity/default-login",
          "@sanity/desk-tool",
          "@sanity/google-maps-input",
        ],
        parts: [
          {
            name: "part:@sanity/base/schema",
            path: "./schemas/schema.js",
          },
        ],
      }));

    it("https://www.sanity.io/v2-docs/sanity-json#933842c25dea", () =>
      expectExample({
        // ...,
        api: {
          projectId: "<yourProjectId>",
          dataset: "production",
        },
        env: {
          development: {
            api: {
              dataset: "staging",
            },
          },
        },
        // ...
      }));

    it("https://www.sanity.io/v2-docs/sanity-json#01caa12d9641", () =>
      expectExample({
        // ...,
        server: {
          hostname: "0.0.0.0", // Listen on all devices
          port: 3333,
        },
        // ...
      }));
  }
);
