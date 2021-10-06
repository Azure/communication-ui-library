// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackItemStyles, IStackStyles, IStackTokens, IStyle, mergeStyles } from '@fluentui/react';

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

const configurationContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  minHeight: 'auto'
};

/**
 * @private
 */
export const configurationContainerStyleDesktop = mergeStyles({
  ...configurationContainerStyle,
  padding: '1rem', //half childrenGap from Stack
  minWidth: '14.5rem' // max of min-width from stack items + padding * 2 = 12.5 + 1 * 2
});

/**
 * @private
 */
export const configurationContainerStyleMobile = mergeStyles({
  ...configurationContainerStyle,
  padding: '0.5rem' // half childrenGap from Stack
});

/**
 * @private
 */
export const selectionContainerStyle = mergeStyles({
  minWidth: '12.5rem',
  padding: '0.5rem'
});

/**
 * @private
 */
export const titleContainerStyleDesktop = mergeStyles({
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  fontWeight: 600,
  width: '12.5rem'
});

/**
 * @private
 */
export const titleContainerStyleMobile = mergeStyles({
  fontSize: '1.0625rem',
  lineHeight: '1.375rem',
  fontWeight: 600,
  textAlign: 'center'
});

/**
 * @private
 */
export const callDetailsContainerStylesDesktop: IStackItemStyles = {
  root: {
    marginBottom: '1.563rem'
  }
};

const callDetailsStyle: IStyle = {
  fontSize: '0.9375',
  lineHeight: '1.25rem',
  marginTop: '0.25rem'
};

/**
 * @private
 */
export const callDetailsStyleDesktop = mergeStyles({
  ...callDetailsStyle,
  maxWidth: '18.75rem'
});

/**
 * @private
 */
export const callDetailsStyleMobile = mergeStyles({
  ...callDetailsStyle,
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
