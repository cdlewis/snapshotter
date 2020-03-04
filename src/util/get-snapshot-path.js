/* global global */

import { get, set } from 'lodash';
import path from 'path';
import { readFileSync } from 'fs';
import getPackageRoot from './get-package-root';

const getSnapshotFilePath = (packageRoot, snapshotDir, id) => {
  const snapshotPath = path.join(snapshotDir, `${id}.json`);
  const relativeSnapshotPath = path.relative(packageRoot, snapshotPath);
  return { relativeSnapshotPath, snapshotPath };
};

export default id => {
  const cacheHit = get(global, 'snapshotter');
  if (cacheHit) {
    const { packageRoot, snapshotPath } = cacheHit;
    return getSnapshotFilePath(packageRoot, snapshotPath, id);
  }

  const packageRoot = getPackageRoot();
  const config = get(
    JSON.parse(readFileSync(`${packageRoot}/package.json`)),
    'snapshotter',
    {
      snapshotPath: './test/snapshots'
    }
  );

  set(global, 'snapshotter', { ...config, packageRoot });
  return getSnapshotFilePath(packageRoot, config.snapshotPath, id);
};
