import { get, isEqual } from 'lodash'
import { readFileSync, writeFileSync } from 'fs'
import process from 'process'
import readlineSync from 'readline-sync'
import { shallowToJson } from 'enzyme-to-json'
import diff from 'jest-diff'
import getSnapshotPath from './util/get-snapshot-path'

const stringify = object => JSON.stringify(object, (key, value) => {
  if (typeof value === 'function') {
    return '[Function]'
  }

  return value
}, 2)

/**
 * maybeUpdateSnapshot will prompt the user to update the snapshot if the
 * environmental variable, UPDATE_SNAPSHOTS, has been set.
 */

const maybeUpdateSnapshot = (snapshotPath, relativeSnapshotPath, component) => {
  if (get(process, 'env.UPDATE_SNAPSHOTS')) {
    const shouldUpdate = readlineSync.question(`\n\x07Write new snapshot to ${relativeSnapshotPath}? (y/n): `)

    if (shouldUpdate === 'y') {
      writeFileSync(
        snapshotPath,
        stringify(component),
        { flag: 'w' },
      )
    }
  }
}

module.exports = (assert, component, id, outputBuffer = process.stdout) => {
  const serialisedComponent = JSON.parse(stringify(shallowToJson(component, { noKey: true })))
  const { snapshotPath, relativeSnapshotPath } = getSnapshotPath(id)

  try {
    const snapshot = JSON.parse(readFileSync(snapshotPath))
    if (isEqual(serialisedComponent, snapshot)) {
      assert.pass(`Snapshot matches ${id}`)
      return
    }

    assert.fail(`Snapshot for ${id} has changed`)
    outputBuffer.write(`${diff(snapshot, serialisedComponent)}\n`)
  } catch (err) {
    assert.fail(`Snapshot for ${id} missing or invalid`)
  }

  maybeUpdateSnapshot(snapshotPath, relativeSnapshotPath, serialisedComponent)
}
