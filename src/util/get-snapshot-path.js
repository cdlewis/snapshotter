/* global global */

import { get, set } from 'lodash'
import getPackageRoot from './get-package-root'
import path from 'path'
import { readFileSync } from 'fs'

export default (id) => {
  const cachedPath = get(global, 'snapshotter.testPath')

  if (cachedPath) {
    return cachedPath
  }

  const packageRoot = getPackageRoot()
  const config = get(JSON.parse(readFileSync(`${packageRoot}/package.json`)), 'snapshotter', {
    snapshotPath: './test/snapshots',
  })

  const snapshotPath = path.join(config.snapshotPath, `${id}.json`)

  const result = {
    snapshotPath,
    relativeSnapshotPath: path.relative(packageRoot, snapshotPath),
  }

  set(global, 'snapshotter.snapshotPath', result)
  return result
}
