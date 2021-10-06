// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { calculateGridProps } from './GridLayout';

describe('Tests for helper function calculateGridProps', () => {
  test('really low aspect ratio (really tall and narrow grid) returns 1 column', () => {
    const gridProps = calculateGridProps(10, 10, 1000);
    expect(gridProps).toMatchObject({ horizontalFill: true, rows: 10, columns: 1 });
  });

  test('really high aspect ratio (really flat and wide grid) returns 1 row', () => {
    const gridProps = calculateGridProps(10, 1000, 10);
    expect(gridProps).toMatchObject({ horizontalFill: true, rows: 1, columns: 10 });
  });

  test('One item should be stored in grid with 1 row and 1 column', () => {
    const gridProps = calculateGridProps(1, 1200, 1600);
    expect(gridProps).toMatchObject({ horizontalFill: true, rows: 1, columns: 1 });
  });

  test('Desktop aspect ratio should create equal columns and rows for perfect square number of items', () => {
    const gridProps = calculateGridProps(9, 1600, 900);
    expect(gridProps).toMatchObject({ horizontalFill: true, rows: 3, columns: 3 });
  });

  test('Desktop aspect ratio should create more columns than rows for non-perfect square number of items', () => {
    const gridProps = calculateGridProps(5, 1600, 900);
    expect(gridProps.columns).toBeGreaterThan(gridProps.rows);
    expect(gridProps.horizontalFill).toBe(true);
  });

  test('1:1 aspect ratio should return grid that has more rows than columns AND should fill vertically for 5 items', () => {
    const gridProps = calculateGridProps(5, 1000, 1000);
    expect(gridProps.rows).toBeGreaterThan(gridProps.columns);
    expect(gridProps.horizontalFill).toBe(false);
  });

  test('Rotated IPad aspect ratio returns more rows than columns', () => {
    const gridProps = calculateGridProps(5, 1400, 1600);
    expect(gridProps.rows).toBeGreaterThan(gridProps.columns);
  });
});
