"use strict";

var _lodash = require("lodash");

var _fs = require("fs");

var _process = _interopRequireDefault(require("process"));

var _readlineSync = _interopRequireDefault(require("readline-sync"));

var _enzymeToJson = require("enzyme-to-json");

var _jestDiff = _interopRequireDefault(require("jest-diff"));

var _getSnapshotPath = _interopRequireDefault(require("./util/get-snapshot-path"));

var _utils = require("enzyme-to-json/utils.js");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const stringify = object => JSON.stringify(object, (key, value) => {
  if (typeof value === 'function') {
    return '[Function]';
  }

  return value;
}, 2);
/**
 * maybeUpdateSnapshot will prompt the user to update the snapshot if the
 * environmental variable, UPDATE_SNAPSHOTS, has been set.
 */


const maybeUpdateSnapshot = (snapshotPath, relativeSnapshotPath, component) => {
  if ((0, _lodash.get)(_process.default, 'env.UPDATE_SNAPSHOTS')) {
    const shouldUpdate = _readlineSync.default.question(`\n\x07Write new snapshot to ${relativeSnapshotPath}? (y/n): `);

    if (shouldUpdate === 'y') {
      // Attempt to create the directory if it doesn't already exist (requires Node 10+)
      const parentDirectory = (0, _path.dirname)(snapshotPath);
      (0, _fs.mkdirSync)(parentDirectory, {
        recursive: true
      });
      (0, _fs.writeFileSync)(snapshotPath, stringify(component), {
        flag: 'w'
      });
    }
  }
};

module.exports = (assert, component, id, outputBuffer = _process.default.stdout) => {
  const serialisedComponent = (0, _utils.isEnzymeWrapper)(component) ? JSON.parse(stringify((0, _enzymeToJson.shallowToJson)(component, {
    noKey: true
  }))) : component;
  const {
    snapshotPath,
    relativeSnapshotPath
  } = (0, _getSnapshotPath.default)(id);

  try {
    const snapshot = JSON.parse((0, _fs.readFileSync)(snapshotPath).toString());

    if ((0, _lodash.isEqual)(serialisedComponent, snapshot)) {
      assert.pass(`Snapshot matches ${id}`);
      return;
    }

    assert.fail(`Snapshot for ${id} has changed`);
    outputBuffer.write(`${(0, _jestDiff.default)(snapshot, serialisedComponent)}\n`);
  } catch (err) {
    assert.fail(`Snapshot for ${id} missing or invalid`);
  }

  maybeUpdateSnapshot(snapshotPath, relativeSnapshotPath, serialisedComponent);
};