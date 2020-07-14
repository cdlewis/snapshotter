[![Build Status](https://travis-ci.org/cdlewis/snapshotter.svg?branch=master)](https://travis-ci.org/cdlewis/snapshotter)

# Snapshotter

Snapshot testing is a compelling feature but sometimes it isn't possible to port
large projects to tools like Jest. Snapshotter is designed to be a drop-in replacement
for Jest's `toMatchSnapshot` function. For backwards compatibility purposes, it
includes built-in support for serialising Enzyme components.

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
  compareToSnapshot(assert, shallowWrapper, 'TestClass')
  assert.end()
})
```

## Update snapshots

To update snapshots, set the `UPDATE_SNAPSHOTS` to a non-falsy value.

```
UPDATE_SNAPSHOTS=1 npm run test
```
