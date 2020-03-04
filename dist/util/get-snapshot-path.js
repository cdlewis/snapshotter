"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = require("lodash");

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _getPackageRoot = _interopRequireDefault(require("./get-package-root"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getSnapshotFilePath = function getSnapshotFilePath(packageRoot, snapshotDir, id) {
  var snapshotPath = _path["default"].join(snapshotDir, "".concat(id, ".json"));

  var relativeSnapshotPath = _path["default"].relative(packageRoot, snapshotPath);

  return {
    relativeSnapshotPath: relativeSnapshotPath,
    snapshotPath: snapshotPath
  };
};

var _default = function _default(id) {
  var cacheHit = (0, _lodash.get)(global, 'snapshotter');

  if (cacheHit) {
    var _packageRoot = cacheHit.packageRoot,
        snapshotPath = cacheHit.snapshotPath;
    return getSnapshotFilePath(_packageRoot, snapshotPath, id);
  }

  var packageRoot = (0, _getPackageRoot["default"])();
  var config = (0, _lodash.get)(JSON.parse((0, _fs.readFileSync)("".concat(packageRoot, "/package.json"))), 'snapshotter', {
    snapshotPath: './test/snapshots'
  });
  (0, _lodash.set)(global, 'snapshotter', _objectSpread({}, config, {
    packageRoot: packageRoot
  }));
  return getSnapshotFilePath(packageRoot, config.snapshotPath, id);
};

exports["default"] = _default;