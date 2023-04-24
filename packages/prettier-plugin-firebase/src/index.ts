import { type Config, indexOf } from "@standard-configs/config";
import { jsonPlugin } from "@standard-configs/plugin-json";

const firebaseConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "database",
          "hosting",
          "firestore",
          "storage",
          "emulators",
          "functions",
        ]),
      ],
    },
    {
      path: /^emulators$/,
      sortKeys: [
        indexOf(["singleProjectMode", "firestore", "ui", "auth", "pubsub"]),
      ],
    },
    {
      path: /^emulators\.hosting$/,
      sortKeys: [indexOf(["port", "host"])],
    },
    {
      path: /^firestore$/,
      sortKeys: [indexOf(["rules", "indexes"])],
    },
    {
      path: /^hosting$/,
      sortKeys: [
        indexOf([
          "public",
          "ignore",
          "redirects",
          "appAssociation",
          "rewrites",
          "headers",
          "cleanUrls",
          "trailingSlash",
        ]),
      ],
    },
    {
      path: /^hosting\.headers\[\d+]$/,
      sortKeys: [indexOf(["source", "headers"])],
    },
    {
      path: /^hosting\.redirects\[\d+]$/,
      sortKeys: [indexOf(["source", "destination", "type"])],
    },
    {
      path: /^hosting\.rewrites\[\d+]$/,
      sortKeys: [
        indexOf(["source", "destination", "function", "region", "run"]),
      ],
    },
    {
      path: /^hosting\.rewrites\[\d+]\.run$/,
      sortKeys: [indexOf(["serviceId", "region"])],
    },
  ],
};

const firestoreIndexesConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [indexOf(["indexes", "fieldOverrides"])],
    },
    {
      path: /^indexes\[\d+]$/,
      sortKeys: [indexOf(["collectionGroup", "queryScope", "fields"])],
    },
    {
      path: /^indexes\[\d+]\.fields\[\d+]$/,
      sortKeys: [indexOf(["fieldPath", "order", "arrayConfig"])],
    },
    {
      path: /^fieldOverrides\[\d+]$/,
      sortKeys: [indexOf(["collectionGroup", "fieldPath", "ttl", "indexes"])],
    },
    {
      path: /^fieldOverrides\[\d+]\.indexes\[\d+]$/,
      sortKeys: [indexOf(["queryScope", "order", "arrayConfig"])],
    },
  ],
};

export const firebaseJSONConfigs = {
  "firebase.json": firebaseConfig,
  "firestore.indexes.json": firestoreIndexesConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(firebaseJSONConfigs);
