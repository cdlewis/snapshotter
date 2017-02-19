'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestFileExists = require('jest-file-exists');

var _jestFileExists2 = _interopRequireDefault(_jestFileExists);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var cwd = _process2.default.cwd();

  // Is the cwd somewhere within an npm package?
  var root = cwd;
  while (!(0, _jestFileExists2.default)(_path2.default.join(root, 'package.json'))) {
    if (root === '/' || root.match(/^[A-Z]:\\/)) {
      root = cwd;
      break;
    }
    root = _path2.default.resolve(root, '..');
  }

  return root;
}; // copied from jest/packages/jest-util/src/index.js