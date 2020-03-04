"use strict";

var _lodash = require("lodash");

var _fs = require("fs");

var _process = _interopRequireDefault(require("process"));

var _readlineSync = _interopRequireDefault(require("readline-sync"));

var _enzymeToJson = require("enzyme-to-json");

var _jestDiff = _interopRequireDefault(require("jest-diff"));

var _getSnapshotPath2 = _interopRequireDefault(require("./util/get-snapshot-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var stringify = function stringify(object) {
  return JSON.stringify(object, function (key, value) {
    if (typeof value === 'function') {
      return '[Function]';
    }

    return value;
  }, 2);
};
/**
 * maybeUpdateSnapshot will prompt the user to update the snapshot if the
 * environmental variable, UPDATE_SNAPSHOTS, has been set.
 */


var maybeUpdateSnapshot = function maybeUpdateSnapshot(snapshotPath, relativeSnapshotPath, component) {
  if ((0, _lodash.get)(_process["default"], 'env.UPDATE_SNAPSHOTS')) {
    var shouldUpdate = _readlineSync["default"].question("\n\x07Write new snapshot to ".concat(relativeSnapshotPath, "? (y/n): "));

    if (shouldUpdate === 'y') {
      (0, _fs.writeFileSync)(snapshotPath, stringify(component), {
        flag: 'w'
      });
    }
  }
};

module.exports = function (assert, component, id) {
  var outputBuffer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _process["default"].stdout;
  var serialisedComponent = JSON.parse(stringify((0, _enzymeToJson.shallowToJson)(component, {
    noKey: true
  })));

  var _getSnapshotPath = (0, _getSnapshotPath2["default"])(id),
      snapshotPath = _getSnapshotPath.snapshotPath,
      relativeSnapshotPath = _getSnapshotPath.relativeSnapshotPath;

  try {
    var snapshot = JSON.parse((0, _fs.readFileSync)(snapshotPath));

    if ((0, _lodash.isEqual)(serialisedComponent, snapshot)) {
      assert.pass("Snapshot matches ".concat(id));
      return;
    }

    assert.fail("Snapshot for ".concat(id, " has changed"));
    outputBuffer.write("".concat((0, _jestDiff["default"])(snapshot, serialisedComponent), "\n"));
  } catch (err) {
    assert.fail("Snapshot for ".concat(id, " missing or invalid"));
  }

  maybeUpdateSnapshot(snapshotPath, relativeSnapshotPath, serialisedComponent);
};