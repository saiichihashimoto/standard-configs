import { formatJSON } from "@configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: "firebase.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://firebase.google.com/docs/cli#the_firebasejson_file", () =>
      expectExample({
        hosting: {
          public: "public",
          ignore: ["firebase.json", "**/.*", "**/node_modules/**"],
        },
        firestore: {
          rules: "firestore.rules",
          indexes: "firestore.indexes.json",
        },
        functions: {
          predeploy: [
            'npm --prefix "$RESOURCE_DIR" run lint',
            'npm --prefix "$RESOURCE_DIR" run build',
          ],
        },
      }));

    it.todo("https://firebase.google.com/docs/cli");

    it("https://firebase.google.com/docs/emulator-suite/use_hosting#emulators-no-local-host", () =>
      expectExample({
        emulators: {
          // ...

          hosting: {
            port: 5000,
            host: "0.0.0.0",
          },
        },
      }));

    it("https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration", () =>
      expectExample({
        // Existing firebase configuration ...
        database: {
          rules: "database.rules.json",
        },
        firestore: {
          rules: "firestore.rules",
        },
        storage: {
          rules: "storage.rules",
        },

        // ...

        // Optional emulator configuration. Default
        // values are used if absent.
        emulators: {
          singleProjectMode: false, // do not warn on detection of multiple project IDs
          firestore: {
            port: "8080",
          },
          ui: {
            enabled: true, // Default is `true`
            port: 4000, // If unspecified, see CLI log for selected port
          },
          auth: {
            port: "9099",
          },
          pubsub: {
            port: "8085",
          },
        },
      }));

    it.todo("https://firebase.google.com/docs/database/security");

    it("https://firebase.google.com/docs/hosting/full-config#rewrite-functions", () =>
      expectExample({
        hosting: {
          // ...

          // Directs all requests from the page `/bigben` to execute the `bigben` function
          rewrites: [
            {
              source: "/bigben",
              function: "bigben",
              region: "us-central1", // optional (see note below)
            },
          ],
        },
      }));

    it("https://firebase.google.com/docs/hosting/full-config#rewrite-cloud-run-container", () =>
      expectExample({
        hosting: {
          // ...

          // Directs all requests from the page `/helloworld` to trigger and run a `helloworld` container
          rewrites: [
            {
              source: "/helloworld",
              run: {
                serviceId: "helloworld", // "service name" (from when you deployed the container image)
                region: "us-central1", // optional (if omitted, default is us-central1)
              },
            },
          ],
        },
      }));

    it("https://firebase.google.com/docs/hosting/full-config#rewrite-dynamic-links", () =>
      expectExample({
        hosting: {
          // ...

          appAssociation: "AUTO", // required for Dynamic Links (default is AUTO if not specified)

          // Add the "rewrites" attribute within "hosting"
          rewrites: [
            {
              source: "/**", // the Dynamic Links start with "https://CUSTOM_DOMAIN/"
              dynamicLinks: true,
            },
          ],
        },
      }));

    it("https://firebase.google.com/docs/hosting/full-config#rewrite-dynamic-links custom domain path prefixes", () =>
      expectExample({
        hosting: {
          // ...

          appAssociation: "AUTO", // required for Dynamic Links (default is AUTO if not specified)

          // Add the "rewrites" attribute within "hosting"
          rewrites: [
            {
              source: "/promos/**", // the Dynamic Links start with "https://CUSTOM_DOMAIN/promos/"
              dynamicLinks: true,
            },
            {
              source: "/links/share/**", // the Dynamic Links start with "https://CUSTOM_DOMAIN/links/share/"
              dynamicLinks: true,
            },
          ],
        },
      }));

    it("https://firebase.google.com/docs/hosting/full-config#headers", () =>
      expectExample({
        hosting: {
          // ...

          // Applies a CORS header for all font files
          headers: [
            {
              source: "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
              headers: [
                {
                  key: "Access-Control-Allow-Origin",
                  value: "*",
                },
              ],
            },
          ],
        },
      }));

    it("https://firebase.google.com/docs/hosting/full-config#firebase-json_example", () =>
      expectExample({
        hosting: {
          public: "dist/app", // "public" is the only required attribute for Hosting

          ignore: ["firebase.json", "**/.*", "**/node_modules/**"],

          redirects: [
            {
              source: "/foo",
              destination: "/bar",
              type: 301,
            },
            {
              source: "/firebase/**",
              destination: "https://www.firebase.com",
              type: 302,
            },
          ],

          // EDITED put appAssociation above rewrites
          // Required to configure custom domains for Dynamic Links
          appAssociation: "AUTO",

          rewrites: [
            {
              // Shows the same content for multiple URLs
              source: "/app/**",
              destination: "/app/index.html",
            },
            {
              // Configures a custom domain for Dynamic Links
              source: "/promos/**",
              dynamicLinks: true,
            },
            {
              // Directs a request to Cloud Functions
              source: "/bigben",
              function: "bigben",
            },
            {
              // Directs a request to a Cloud Run containerized app
              source: "/helloworld",
              run: {
                serviceId: "helloworld",
                region: "us-central1",
              },
            },
          ],

          headers: [
            {
              source: "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
              headers: [
                {
                  key: "Access-Control-Allow-Origin",
                  value: "*",
                },
              ],
            },
            {
              source: "**/*.@(jpg|jpeg|gif|png)",
              headers: [
                {
                  key: "Cache-Control",
                  value: "max-age=7200",
                },
              ],
            },
            {
              source: "404.html",
              headers: [
                {
                  key: "Cache-Control",
                  value: "max-age=300",
                },
              ],
            },
          ],

          cleanUrls: true,

          trailingSlash: false,
        },
      }));

    it("https://firebase.google.com/docs/hosting/i18n-rewrites#set-up-i18n-rewrites", () =>
      expectExample({
        hosting: {
          public: "public",

          ignore: ["firebase.json", "**/.*", "**/node_modules/**"],

          i18n: {
            root: "/localized-files", // directory that contains your "i18n content"
          },

          // ...
        },
      }));

    it.todo("https://firebase.google.com/docs/rules");

    it("https://firebase.google.com/docs/extensions/manifest", () =>
      expectExample({
        extensions: {
          "my-bigquery-extension": "firebase/firestore-bigquery-export@^0.1.18",
          "my-image-resizer": "firebase/storage-resize-images@^0.1.22",
        },
      }));
  }
);

describe.each([{ filename: "firestore.indexes.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { expectExample } = format(filename, plugin);

    it("https://firebase.google.com/docs/reference/firestore/indexes", () =>
      expectExample({
        // Required, specify compound indexes
        indexes: [
          {
            collectionGroup: "posts",
            queryScope: "COLLECTION",
            fields: [
              { fieldPath: "author", arrayConfig: "CONTAINS" },
              { fieldPath: "timestamp", order: "DESCENDING" },
            ],
          },
        ],

        // Optional, disable indexes or enable single-field collection group indexes
        fieldOverrides: [
          {
            collectionGroup: "posts",
            fieldPath: "myBigMapField",
            // We want to disable indexing on our big map field, and so empty the indexes array
            indexes: [],
          },
        ],
      }));
  }
);
