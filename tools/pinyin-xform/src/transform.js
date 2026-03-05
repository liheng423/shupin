"use strict";

function buildRuleObjects(rules) {
  return rules.map((r) => ({
    regex: new RegExp(r.pattern),
    replacement: r.replacement,
  }));
}

function applyRulesToToken(token, rules) {
  let out = token;
  for (const rule of rules) {
    out = out.replace(rule.regex, rule.replacement);
  }
  return out;
}

function applyRulesToText(text, rules, mode) {
  if (mode === "line") {
    return applyRulesToToken(text, rules);
  }

  const parts = text.split(/(\s+)/);
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i] || /^\s+$/.test(parts[i])) continue;
    parts[i] = applyRulesToToken(parts[i], rules);
  }
  return parts.join("");
}

module.exports = {
  buildRuleObjects,
  applyRulesToText,
};
