const assert = require("assert");
const fs = require("fs");

const css = fs.readFileSync("frontend/src/components/Header.css", "utf8");

const mobileMedia = css.match(/@media\s*\(max-width:\s*768px\)\s*{([\s\S]*?)\n}/);
assert.ok(mobileMedia, "Header.css should include mobile header styles");

const mobileCss = mobileMedia[1];

assert.match(
  mobileCss,
  /\.header-actions\s*{[\s\S]*?align-items:\s*stretch\s*;/,
  "mobile header actions should stretch buttons to the same left and right edges"
);
assert.match(
  mobileCss,
  /\.header-actions\s+\.btn-outline\s*{[\s\S]*?margin-left:\s*0\s*;/,
  "mobile outline buttons should not keep the desktop left margin"
);

console.log("header mobile layout checks passed");
