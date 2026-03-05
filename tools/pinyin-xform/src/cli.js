"use strict";

const { readText, readStdin } = require("./io");
const { parseRulesFromYamlText } = require("./yaml-scan");
const { buildRuleObjects, applyRulesToText } = require("./transform");

function usage() {
  const text = `Usage:
  node index.js --schema <yaml> [--section <path>] [--input <text> | --file <input.txt> | < stdin]

Options:
  --schema   Path to YAML schema file
  --section  Optional dot-path to limit rules (e.g. speller.algebra)
  --input    Input string to transform
  --file     Read input from file
  --mode     token | line  (default: token)
  --dump     Print parsed rules and exit

Examples:
  node index.js --schema shupin_tongyin.schema.yaml --section speller.algebra --input "zyi ci si"
  echo "zyi ci si" | node index.js --schema shupin_tongyin.schema.yaml
`;
  process.stderr.write(text);
}

function getArg(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return null;
  return args[idx + 1] || null;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || hasFlag(args, "-h") || hasFlag(args, "--help")) {
    usage();
    process.exit(1);
  }

  const schemaPath = getArg(args, "--schema");
  if (!schemaPath) {
    usage();
    process.exit(1);
  }

  const section = getArg(args, "--section");
  const mode = getArg(args, "--mode") || "token";
  if (mode !== "token" && mode !== "line") {
    process.stderr.write("Invalid --mode. Use token or line.\n");
    process.exit(1);
  }

  const yamlText = readText(schemaPath);
  const rulesRaw = parseRulesFromYamlText(yamlText, section);
  const rules = buildRuleObjects(rulesRaw);

  if (hasFlag(args, "--dump")) {
    process.stdout.write(JSON.stringify(rulesRaw, null, 2) + "\n");
    return;
  }

  let input = getArg(args, "--input");
  const filePath = getArg(args, "--file");

  if (filePath) {
    input = readText(filePath);
  }

  if (input == null) {
    input = readStdin();
  }

  const output = applyRulesToText(input, rules, mode);
  process.stdout.write(output);
}

module.exports = {
  main,
};
