'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global global */

var _lodash = require('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _getPackageRoot = require('./get-package-root');

var _getPackageRoot2 = _interopRequireDefault(_getPackageRoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSnapshotFilePath = function getSnapshotFilePath(packageRoot, snapshotDir, id) {
  var snapshotPath = _path2.default.join(snapshotDir, id + '.json');
  var relativeSnapshotPath = _path2.default.relative(packageRoot, snapshotPath);
  return { relativeSnapshotPath: relativeSnapshotPath, snapshotPath: snapshotPath };
};

exports.default = function (id) {
  var cacheHit = (0, _lodash.get)(global, 'snapshotter');
  if (cacheHit) {
    var _packageRoot = cacheHit.packageRoot,
        snapshotPath = cacheHit.snapshotPath;

    return getSnapshotFilePath(_packageRoot, snapshotPath, id);
  }

  var packageRoot = (0, _getPackageRoot2.default)();
  var config = (0, _lodash.get)(JSON.parse((0, _fs.readFileSync)(packageRoot + '/package.json')), 'snapshotter', {
    snapshotPath: './test/snapshots'
  });

  (0, _lodash.set)(global, 'snapshotter', _extends({}, config, { packageRoot: packageRoot }));
  return getSnapshotFilePath(packageRoot, config.snapshotPath, id);
};