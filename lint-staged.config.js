const eslintCmd = `cross-env TIMING=1 eslint --quiet --ext .js,.jsx,.ts,.tsx --fix --cache --cache-strategy content`;
const prettierCmd = `prettier --ignore-unknown --write --cache`;

// TODO globally run commands should `git add .` BEFORE command brings back stash https://github.com/okonet/lint-staged/issues/1253
// Until that issue is resolved, we'll always --no-stash and just stash/unstash and add everything on our own

/**
 * @type {import('lint-staged').Config}
 */
const config = {
  "*.{gif,jpeg,jpg,png,svg}": ["imagemin-lint-staged"],
  "*.{js,jsx,ts,tsx}": [eslintCmd],
  "*": [prettierCmd],
  "{.eslint*,package.json}": () => [`${eslintCmd} .`, "git add ."],
  "{.prettier*,package.json}": () => [`${prettierCmd} .`, "git add ."],
  "package.json": () => [
    "manypkg fix",
    "manypkg check",
    "git add **/package.json",
  ],
  "Brewfile": (files) =>
    files.map((file) =>
      [
        `cat ${file}`,
        `awk 'BEGIN{FS=OFS=" "}
                /^tap/  {print 1 "\t" $0; next}
                /^brew/ {print 2 "\t" $0; next}
                /^cask/ {print 3 "\t" $0; next}
                /^mas/  {print 4 "\t" $0; next}
                        {print 9 "\t" $0}'`,
        "sort -u",
        `awk 'BEGIN{FS="\t";OFS=""}{$1=""; print $0}'`,
        "sed '/^ *$/d'",
        `sponge ${file}`,
      ].join(" | ")
    ),
  "{.env*,.gitattributes}": (files) =>
    files.map((file) => `sort -o ${file} ${file}`),
};

module.exports = config;
