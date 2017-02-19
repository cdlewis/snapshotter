'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _getPackageRoot = require('./get-package-root');

var _getPackageRoot2 = _interopRequireDefault(_getPackageRoot);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global global */

exports.default = function (id) {
  var cachedPath = (0, _lodash.get)(global, 'snapshotter.testPath');

  if (cachedPath) {
    return cachedPath;
  }

  var packageRoot = (0, _getPackageRoot2.default)();
  var config = (0, _lodash.get)(JSON.parse((0, _fs.readFileSync)(packageRoot + '/package.json')), 'snapshotter', {
    snapshotPath: './test/snapshots'
  });

  var snapshotPath = _path2.default.join(config.snapshotPath, id + '.json');

  var result = {
    snapshotPath: snapshotPath,
    relativeSnapshotPath: _path2.default.relative(packageRoot, snapshotPath)
  };

  (0, _lodash.set)(global, 'snapshotter.snapshotPath', result);
  return result;
};