"use strict";
const next = __non_webpack_require__("next");

function init(options) {
  return next(options);
}

function dispose() {
  Object.keys(__non_webpack_require__.cache).forEach((k) => {
    console.debug("deleting cached module", k);
    delete __non_webpack_require__.cache[k];
  });
  return new Promise((res) => {
    setTimeout(res, 500);
  });
}

module.exports = { init, dispose };