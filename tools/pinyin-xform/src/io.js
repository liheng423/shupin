"use strict";

const fs = require("fs");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readStdin() {
  return fs.readFileSync(0, "utf8");
}

module.exports = {
  readText,
  readStdin,
};
