// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _getApplicationId, _getAppliationIdImpl } from './telemetry';

// WARNING: Do not change this format. Restrictions:
// - The data analytics backend depends on the application ID meeting this format.
// - The total length of the application ID MUST be <= 24 characters, otherwise events will be dropped.
const applicationIdFormat = new RegExp('acr/[0-9][0-9]?.[0-9][0-9]?.[0-9][0-9]?(-(alpha|beta)(.[0-9][0-9]?)?)?');

test('applicationId conforms to restrictions', () => {
  expect(applicationIdFormat.test(_getApplicationId())).toBe(true);
});

test('sanitize works for all versions in use', () => {
  expect(_getAppliationIdImpl('1.0.0')).toEqual('acr/1.0.0');
  expect(_getAppliationIdImpl('1.0.1')).toEqual('acr/1.0.1');
  expect(_getAppliationIdImpl('99.99.99')).toEqual('acr/99.99.99');
  expect(_getAppliationIdImpl('99.99.99-beta.99')).toEqual('acr/99.99.99-beta.99');
  expect(_getAppliationIdImpl('1.0.0-alpha-202108050010.0')).toEqual('acr/1.0.0-alpha');
  expect(applicationIdFormat.test(_getAppliationIdImpl('1.0.0-alpha-202108050010.0'))).toBe(true);
});
