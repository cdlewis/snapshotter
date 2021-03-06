import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Enzyme from 'enzyme';
import test from 'tape';
import compareToSnapshot from '../src/snapshotter';

Enzyme.configure({ adapter: new Adapter() });

const TestClass = () => (
  <div>
    <p>Hello World</p>
  </div>
);

test('snapshotter detects changes', assert => {
  const mockTape = { fail: () => {} };
  const shallowWrapper = Enzyme.shallow(<TestClass />);
  compareToSnapshot(mockTape, shallowWrapper, 'TestClass', {
    write: diff => {
      // We expect a particular diff output from Jest. Use Snapshotter to validate this.
      compareToSnapshot(assert, diff, 'Class-ExpectedJestDiff');
      assert.end();
    }
  });
});

test('snapshotter handles multiple files', assert => {
  const shallowWrapper = Enzyme.shallow(<TestClass />);
  compareToSnapshot(assert, shallowWrapper, 'TestClass-Fixed');
  assert.end();
});

test('snapshotter handles arbitrary json files', assert => {
  const arbitraryJson = {
    reducers: {
      tasks: [{ name: 'taskA' }]
    }
  };
  compareToSnapshot(assert, arbitraryJson, 'ArbitraryJson');
  assert.end();
});
