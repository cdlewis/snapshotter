'use strict';

var _lodash = require('lodash');

var _fs = require('fs');

var _path = require('path');

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

var _enzymeToJson = require('enzyme-to-json');

var _jestDiff = require('jest-diff');

var _jestDiff2 = _interopRequireDefault(_jestDiff);

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
 * findTestFolder attempts to find the project's test folder by traversing
 * between the working directory and the path of the main JS file.
 */

var findTestFolder = function findTestFolder() {
  var mainPath = (0, _path.dirname)(require.main.filename);
  var workingDirectory = _process2.default.cwd();
  var relativePath = (0, _path.relative)(workingDirectory, mainPath);

  var result = workingDirectory.split('/');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = relativePath.split('/')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var folder = _step.value;

      result.push(folder);
      if (folder === 'test') {
        return { relativePath: relativePath, testFolder: result.join('/') };
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return { relativePath: relativePath, testFolder: workingDirectory };
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

module.exports = function (assert, component, id, outputBuffer) {
  var serialisedComponent = JSON.parse(stringify((0, _enzymeToJson.shallowToJson)(component)));

  var _findTestFolder = findTestFolder(),
      relativePath = _findTestFolder.relativePath,
      testFolder = _findTestFolder.testFolder;

  var snapshotPath = testFolder + '/snapshots/' + id + '.json';
  var relativeSnapshotPath = relativePath + '/snapshots/' + id + '.json';

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