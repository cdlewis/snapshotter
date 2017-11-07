'use strict';

var _lodash = require('lodash');

var _fs = require('fs');

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

var _enzymeToJson = require('enzyme-to-json');

var _jestDiff = require('jest-diff');

var _jestDiff2 = _interopRequireDefault(_jestDiff);

var _getSnapshotPath2 = require('./util/get-snapshot-path');

var _getSnapshotPath3 = _interopRequireDefault(_getSnapshotPath2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  if ((0, _lodash.get)(_process2.default, 'env.UPDATE_SNAPSHOTS')) {
    var shouldUpdate = _readlineSync2.default.question('\nWrite new snapshot to ' + relativeSnapshotPath + '? (y/n): ');

    if (shouldUpdate === 'y') {
      (0, _fs.writeFileSync)(snapshotPath, stringify(component), { flag: 'w' });
    }
  }
};

module.exports = function (assert, component, id) {
  var outputBuffer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _process2.default.stdout;

  var serialisedComponent = JSON.parse(stringify((0, _enzymeToJson.shallowToJson)(component, { noKey: true })));

  var _getSnapshotPath = (0, _getSnapshotPath3.default)(id),
      snapshotPath = _getSnapshotPath.snapshotPath,
      relativeSnapshotPath = _getSnapshotPath.relativeSnapshotPath;

  try {
    var snapshot = JSON.parse((0, _fs.readFileSync)(snapshotPath));
    if ((0, _lodash.isEqual)(serialisedComponent, snapshot)) {
      assert.pass('Snapshot matches ' + id);
      return;
    }

    assert.fail('Snapshot for ' + id + ' has changed');
    outputBuffer.write((0, _jestDiff2.default)(snapshot, serialisedComponent) + '\n');
  } catch (err) {
    assert.fail('Snapshot for ' + id + ' missing or invalid');
  }

  maybeUpdateSnapshot(snapshotPath, relativeSnapshotPath, serialisedComponent);
};