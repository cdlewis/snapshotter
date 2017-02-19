import { get, isEqual } from 'lodash'
import { readFileSync, writeFileSync } from 'fs'
import { dirname, relative } from 'path'
import process from 'process'
import readlineSync from 'readline-sync'
import { shallowToJson } from 'enzyme-to-json'
import diff from 'jest-diff'

const stringify = object => JSON.stringify(object, (key, value) => {
  if (typeof value === 'function') {
    return '[Function]'
  }

  return value
}, 2)

/**
 * findTestFolder attempts to find the project's test folder by traversing
 * between the working directory and the path of the main JS file.
 */

const findTestFolder = () => {
  const mainPath = dirname(require.main.filename)
  const workingDirectory = process.cwd()
  const relativePath = relative(workingDirectory, mainPath)

  const result = workingDirectory.split('/')
  for (const folder of relativePath.split('/')) {
    result.push(folder)
    if (folder === 'test') {
      return { relativePath, testFolder: result.join('/') }
    }
  }

  return { relativePath, testFolder: workingDirectory }
}

/**
 * maybeUpdateSnapshot will prompt the user to update the snapshot if the
 * environmental variable, UPDATE_SNAPSHOTS, has been set.
 */

const maybeUpdateSnapshot = (snapshotPath, relativeSnapshotPath, component) => {
  if (get(process, 'env.UPDATE_SNAPSHOTS')) {
    const shouldUpdate = readlineSync.question(`\nWrite new snapshot to ${relativeSnapshotPath}? (y/n): `)

    if (shouldUpdate === 'y') {
      writeFileSync(
        snapshotPath,
        stringify(component),
        { flag: 'w' },
      )
    }
  }
}

module.exports = (assert, component, id, outputBuffer) => {
  const serialisedComponent = JSON.parse(stringify(shallowToJson(component)))

  const { relativePath, testFolder } = findTestFolder()
  const snapshotPath = `${testFolder}/snapshots/${id}.json`
  const relativeSnapshotPath = `${relativePath}/snapshots/${id}.json`

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
