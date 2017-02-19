# Snapshotter

Snapshot testing is a compelling feature but sometimes it isn't possible to port
large projects to tools like Jest. Snapshotter is designed to work within an
existing Tape/Enzyme setup while providing some basic snapshot functionality.

![Screenshot](/screenshot.png?raw=true "Screenshot")

# Getting Started

## Install

Add the package:

```
npm install --save-dev snapshotter
```

Create a snapshots folder (e.g. `mkdir test/snapshots`) and add it to `package.json`. If you do not specify a folder, Snapshotter will default to `test/snapshots`.

```
"snapshotter": {
  "snapshotPath": "./test/snapshots"
}
```

## Usage

```
import compareToSnapshot from 'snapshotter'
import React from 'react'
import { shallow } from 'enzyme'
import test from 'tape'

const TestClass = () => (
  <div>
    <p>Hello World</p>
  </div>
)

test('TestClass renders', (assert) => {
  const shallowWrapper = shallow(<TestClass />)
  compareToSnapshot(test, shallowWrapper, 'TestClass')
})
```

## Update snapshots

To update snapshots, set the `UPDATE_SNAPSHOTS` to a non-falsy value.

```
UPDATE_SNAPSHOTS=1 npm run test
```
