const makeSpacedFont = require("make-spaced-font");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

module.exports = async function makeSpacedFontHandler(ctx) {
  const outputFile = await makeSpacedFont({
    inputFile: ctx.request.body.files.inputFile.path,
    letterSpacing: ctx.request.body.fields.letterSpacing
  });
  const ext = path.extname(ctx.request.body.files.inputFile.path).toLowerCase();
  const types = {
    ".eot": "application/vnd.ms-fontobject",
    ".woff": "application/font-woff",
    ".woff2": "font/woff2",
    ".ttf": "application/x-font-truetype",
    ".otf": "application/x-font-opentype"
  };
  ctx.set("content-type", types[ext] || "application/octet-stream");
  ctx.response.body = fs.createReadStream(outputFile);
  ctx.response.attachment(path.basename(outputFile));
};
