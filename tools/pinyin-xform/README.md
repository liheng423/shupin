pinyin-xform

Lightweight xform parser + transformer for Rime-like YAML rules.

Usage
  node index.js --schema <yaml> [--section <path>] [--input <text> | --file <input.txt> | < stdin]

Options
  --schema   Path to YAML schema file
  --section  Optional dot-path to limit rules (e.g. speller.algebra)
  --input    Input string to transform
  --file     Read input from file
  --mode     token | line  (default: token)
  --dump     Print parsed rules and exit

Examples
  node index.js --schema ../../schemas/shupins/shupin_tongyin.schema.yaml --section speller.algebra --input "zyi ci si"
  echo "zyi ci si" | node index.js --schema ../../schemas/shupins/shupin_tongyin.schema.yaml

Structure
  index.js           CLI entry
  src/cli.js         CLI argument parsing
  src/io.js          File/stdin helpers
  src/xform.js       xform rule parser
  src/yaml-scan.js   YAML line scanner
  src/transform.js   Rule application

Notes
  - This tool does not fully parse YAML. It scans for lines like "- xform/.../.../".
  - If you need strict YAML semantics, we can add a real YAML parser later.
