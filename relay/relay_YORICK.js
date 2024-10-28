const { getRevision, write } = require("kolmafia");

function main() {
  write(
    "<html><body><script>" +
      `window.parent.parent.revision = ${getRevision()};` +
      'window.parent.parent.frames.mainpane.location.href = "/yorick/load.html";' +
      "</script></body></html>",
  );
}

module.exports.main = main;
