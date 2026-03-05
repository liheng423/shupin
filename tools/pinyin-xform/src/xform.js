"use strict";

function readSegment(input, start) {
  let out = "";
  for (let i = start; i < input.length; i++) {
    const ch = input[i];
    if (ch === "/") {
      return { segment: out, next: i };
    }
    if (ch === "\\") {
      if (i + 1 < input.length) {
        out += input[i + 1];
        i += 1;
        continue;
      }
    }
    out += ch;
  }
  return { segment: null, next: input.length };
}

function parseXform(value) {
  const prefix = "xform/";
  if (!value.startsWith(prefix)) return null;

  let i = prefix.length;
  const first = readSegment(value, i);
  if (!first.segment) return null;
  i = first.next;
  if (value[i] !== "/") return null;
  i += 1;

  const second = readSegment(value, i);
  if (second.segment === null) return null;
  i = second.next;
  if (value[i] !== "/") return null;

  return {
    pattern: first.segment,
    replacement: second.segment,
  };
}

module.exports = {
  parseXform,
};
