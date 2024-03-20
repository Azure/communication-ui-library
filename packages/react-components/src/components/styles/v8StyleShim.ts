// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IRawStyle } from '@fluentui/react';
import { ComponentSlotStyle } from '../../types';

/**
 * Function to create a React.CSSProperties object from a v8 style object.
 * This function is still not ideal
 * as v8Style can use pseudo-class selectors that style objects can't process correctly.
 *
 * @private
 */
export function createStyleFromV8Style(
  v8Style: IRawStyle | ComponentSlotStyle | undefined
): React.CSSProperties | undefined {
  const result: { [key: string]: React.CSSProperties | undefined } = {};
  if (v8Style === undefined || v8Style === null || typeof v8Style === 'boolean' || typeof v8Style === 'string') {
    return undefined;
  } else if (typeof v8Style === 'object') {
    // v8Style is a style object
    for (const record in v8Style) {
      if (typeof v8Style[record] === 'string') {
        // v8Style[record] is just a simple style
        const msSuffix = 'MS';
        if (record.startsWith(msSuffix)) {
          // React.CSSProperties uses camelCase for MS properties but v8Style uses PascalCase
          const newRecord = record.substring(0, msSuffix.length).toLowerCase + record.substring(msSuffix.length);
          result[newRecord] = v8Style[record];
        } else {
          result[record] = v8Style[record];
        }
      } else {
        result[record] = createStyleFromV8Style(v8Style[record]);
      }
    }
  }

  return result;
}
