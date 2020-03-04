// copied from jest/packages/jest-util/src/index.js

import fileExists from "jest-file-exists";
import path from "path";
import process from "process";

export default () => {
  const cwd = process.cwd();

  // Is the cwd somewhere within an npm package?
  let root = cwd;
  while (!fileExists(path.join(root, "package.json"))) {
    if (root === "/" || root.match(/^[A-Z]:\\/)) {
      root = cwd;
      break;
    }
    root = path.resolve(root, "..");
  }

  return root;
};
