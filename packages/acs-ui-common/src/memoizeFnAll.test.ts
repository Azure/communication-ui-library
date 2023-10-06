// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { memoizeFnAll } from './memoizeFnAll';

function* genArray(n: number): Generator<
  {
    value: number;
  },
  void,
  unknown
> {
  for (let i = 0; i < n; i++) {
    yield { value: i };
  }
}

describe('memoizeFunctionAll', () => {
  test('memoizeFunctionAll', () => {
    const arr = Array.from(genArray(100));
    let i = 0;

    const memo = memoizeFnAll((x: { value: number }) => {
      i++;
      return {
        ...x,
        label: `number ${x.value}`
      };
    });
    const result1 = memo((memoizedMap) => arr.map(memoizedMap));
    arr.push({ value: 100 });
    const result2 = memo((memoizedMap) => arr.map(memoizedMap));
    expect(result1[43]).toStrictEqual(result2[43]);
    expect(i).toStrictEqual(101);
  });
});
