import React from 'react'
import { shallow } from 'enzyme'
import test from 'tape'
import { expectedJestDiff } from './fixtures'
import compareToSnapshot from '../src/snapshotter'

const TestClass = () => (
  <div>
    <p>Hello World</p>
  </div>
)

test('snapshotter detects changes', (assert) => {
  const mockTape = { fail: () => {} }
  const shallowWrapper = shallow(<TestClass />)
  compareToSnapshot(mockTape, shallowWrapper, 'TestClass', {
    write: (diff) => {
      assert.deepEqual(diff, expectedJestDiff)
      assert.end()
    },
  })
})

test('snapshotter handles multiple files', (assert) => {
  const shallowWrapper = shallow(<TestClass />)
  compareToSnapshot(assert, shallowWrapper, 'TestClass-Fixed')
  assert.end()
})
