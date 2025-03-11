// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ISpinnerStyles, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const loadingStyle = mergeStyles({
  height: '100%',
  width: '100%'
});

/**
 * @private
 */
export const loadingLabelStyles: ISpinnerStyles = {
  label: { maxWidth: '10rem', overflow: 'hidden', textOverflow: 'ellipsis' }
};
