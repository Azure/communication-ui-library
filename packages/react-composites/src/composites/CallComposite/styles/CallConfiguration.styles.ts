// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStackTokens, IStyle, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const configurationStackTokensDesktop: IStackTokens = {
  childrenGap: '2rem'
};

/**
 * @private
 */
export const configurationStackTokensMobile: IStackTokens = {
  childrenGap: '1rem'
};

/**
 * @private
 */
export const configurationContainer = mergeStyles({
  height: '100%',
  width: '100% ',
  padding: '1rem', //half childrenGap from Stack
  minWidth: '14.5rem', // max of min-width from stack items + padding * 2 = 12.5 + 1 * 2
  minHeight: 'auto'
});

/**
 * @private
 */
export const selectionContainerStyle = mergeStyles({
  minWidth: '12.5rem',
  padding: '0.5rem'
});

const titleContainerStyle: IStyle = {
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  fontWeight: 600
};

/**
 * @private
 */
export const titleContainerStyleDesktop = mergeStyles({
  ...titleContainerStyle,
  width: '12.5rem',
  marginBottom: '1.563rem'
});

/**
 * @private
 */
export const titleContainerStyleMobile = mergeStyles({
  ...titleContainerStyle,
  textAlign: 'center'
});

/**
 * @private
 */
export const startCallButtonContainerStyleDesktop: IStackStyles = {
  root: {
    paddingTop: '1.125rem'
  }
};

/**
 * @private
 */
export const startCallButtonContainerStyleMobile: IStackStyles = {
  root: {
    textAlign: 'center'
  }
};

/**
 * @private
 */
export const startCallButtonStyleMobile = mergeStyles({
  width: '100%',
  maxWidth: 'unset'
});
