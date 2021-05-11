import { main } from './transformImports';

describe('test fn', () => {
  test('t', () => {
    expect(main()).toEqual(false);
  });
});
