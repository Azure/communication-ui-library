// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';

const mainScreenContainerStyle: IStyle = {
  height: '100%',
  width: '100%'
};

/**
 * @private
 */
export const mainScreenContainerStyleDesktop = mergeStyles({
  ...mainScreenContainerStyle,
  minWidth: '30rem', // max of min-width of composite pages (Call page)
  minHeight: '22rem' // max height of min-height of composite pages (Configuration page)
});

/**
 * @private
 */
export const mainScreenContainerStyleMobile = mergeStyles({
  ...mainScreenContainerStyle,
  minWidth: '17.5rem', // max of min-width of composite pages (Call page)
  minHeight: '13rem' // max height of min-height of composite pages (Configuration page & Call page)
});
