"use strict";

const { parseXform } = require("./xform");

function stripComment(line) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (ch === "#" && !inSingle && !inDouble) {
      return line.slice(0, i);
    }
  }
  return line;
}

function unquote(text) {
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  return text;
}

function parseRulesFromYamlText(yamlText, sectionPath) {
  const lines = yamlText.split(/\r?\n/);
  const rules = [];
  const pathStack = [];

  function currentPathForIndent(indent) {
    return pathStack.filter((p) => p.indent < indent).map((p) => p.key);
  }

  for (const rawLine of lines) {
    const lineNoComment = stripComment(rawLine);
    if (!lineNoComment.trim()) continue;

    const keyMatch = lineNoComment.match(/^(\s*)([A-Za-z0-9_\-]+)\s*:/);
    const trimmed = lineNoComment.trim();
    const indent = lineNoComment.match(/^\s*/)[0].length;

    if (keyMatch && !trimmed.startsWith("-")) {
      const keyIndent = keyMatch[1].length;
      const key = keyMatch[2];
      while (pathStack.length && pathStack[pathStack.length - 1].indent >= keyIndent) {
        pathStack.pop();
      }
      pathStack.push({ indent: keyIndent, key });
      continue;
    }

    if (!trimmed.startsWith("-")) continue;

    const value = unquote(trimmed.slice(1).trim());
    if (!value.startsWith("xform/")) continue;

    if (sectionPath) {
      const currentPath = currentPathForIndent(indent).join(".");
      if (currentPath !== sectionPath) continue;
    }

    const parsed = parseXform(value);
    if (parsed) rules.push(parsed);
  }

  return rules;
}

module.exports = {
  parseRulesFromYamlText,
};
