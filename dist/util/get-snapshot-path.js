"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _getPackageRoot = _interopRequireDefault(require("./get-package-root"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getSnapshotFilePath = (packageRoot, snapshotDir, id) => {
  const snapshotPath = _path.default.join(snapshotDir, `${id}.json`);

  const relativeSnapshotPath = _path.default.relative(packageRoot, snapshotPath);

  return {
    relativeSnapshotPath,
    snapshotPath
  };
};

var _default = id => {
  const cacheHit = (0, _lodash.get)(global, 'snapshotter');

  if (cacheHit) {
    const {
      packageRoot,
      snapshotPath
    } = cacheHit;
    return getSnapshotFilePath(packageRoot, snapshotPath, id);
  }

  const packageRoot = (0, _getPackageRoot.default)();
  const config = (0, _lodash.get)(JSON.parse((0, _fs.readFileSync)(`${packageRoot}/package.json`)), 'snapshotter', {
    snapshotPath: './test/snapshots'
  });
  (0, _lodash.set)(global, 'snapshotter', _objectSpread(_objectSpread({}, config), {}, {
    packageRoot
  }));
  return getSnapshotFilePath(packageRoot, config.snapshotPath, id);
};

exports.default = _default;