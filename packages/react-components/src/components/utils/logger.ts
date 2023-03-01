// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createClientLogger } from '@azure/logger';
import { TelemetryEvent, _logEvent } from '@internal/acs-ui-common';

/** @private */
export const reactComponentsLogger = createClientLogger('communication-react:react-components');

/** @private */
export const logEvent = (event: TelemetryEvent): void => {
  _logEvent(reactComponentsLogger, event);
};

/** @private */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function generateDeepDiff(obj1: any, obj2: any): any {
  if (isFunction(obj1) || isFunction(obj2)) {
    throw new Error('Invalid argument. Function given, object expected.');
  }

  if (isValue(obj1) || isValue(obj2)) {
    return areValuesEqual(obj1, obj2) ? obj2 : undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let diff: any = undefined;

  // Compare keys in obj1 to obj2.
  for (const key in obj1) {
    if (isFunction(obj1[key])) {
      continue;
    }

    const change = generateDeepDiff(obj1[key], obj2[key]);
    if (change !== undefined) {
      if (!diff) {
        diff = {};
      }
      diff[key] = change;
    }
  }

  // Any key in obj2 that is not in obj1 is a change.
  for (const key in obj2) {
    if (obj1[key] !== undefined || obj2[key] === undefined || isFunction(obj2[key])) {
      continue;
    }
    if (!diff) {
      diff = {};
    }
    diff[key] = obj2[key];
  }

  return diff;
}

const areValuesEqual = (value1: unknown, value2: unknown): boolean => {
  if (value1 === value2 || (isDate(value1) && isDate(value2) && value1.getTime() === value2.getTime())) {
    return false;
  }
  return true;
};
const isFunction = (x: unknown): x is typeof Function => {
  return Object.prototype.toString.call(x) === '[object Function]';
};
const isArray = (x: unknown): x is Array<unknown> => {
  return Object.prototype.toString.call(x) === '[object Array]';
};
const isDate = (x: unknown): x is Date => {
  return Object.prototype.toString.call(x) === '[object Date]';
};
const isObject = (x: unknown): x is Record<string, unknown> => {
  return Object.prototype.toString.call(x) === '[object Object]';
};
const isValue = (x: unknown): boolean => {
  return !isObject(x) && !isArray(x);
};
