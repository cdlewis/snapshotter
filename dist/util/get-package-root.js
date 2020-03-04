"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jestFileExists = _interopRequireDefault(require("jest-file-exists"));

var _path = _interopRequireDefault(require("path"));

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// copied from jest/packages/jest-util/src/index.js
var _default = () => {
  const cwd = _process.default.cwd(); // Is the cwd somewhere within an npm package?


  let root = cwd;

  while (!(0, _jestFileExists.default)(_path.default.join(root, 'package.json'))) {
    if (root === '/' || root.match(/^[A-Z]:\\/)) {
      root = cwd;
      break;
    }

    root = _path.default.resolve(root, '..');
  }

  return root;
};

exports.default = _default;