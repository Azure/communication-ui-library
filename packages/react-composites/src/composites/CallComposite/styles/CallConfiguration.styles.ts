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
  padding: '0.5rem'
};

/**
 * @private
 */
export const configurationContainerStyleDesktop = mergeStyles({
  ...configurationContainerStyle,
  minWidth: '25rem', // sum of min-width from children + ChildrenGap * (nb of children - 1) + padding * 2 = (11 + 11) + (2 * 1) + 0.5 * 2
  minHeight: '22rem' // max height of SelectionContainer + padding * 2 = 21 + 0.5 * 2
});

/**
 * @private
 */
export const configurationContainerStyleMobile = mergeStyles({
  ...configurationContainerStyle,
  minWidth: '16rem', // from LocalPreview: ControlBar width + 0.5 * 2 for spacing + padding * 2 = 14 + 0.5 * 2 + 0.5 * 2
  minHeight: '13rem'
});

/**
 * @private
 */
export const selectionContainerStyle = mergeStyles({
  width: '50%',
  minWidth: '11rem',
  maxWidth: '18.75rem',
  padding: '0.5rem'
});

/**
 * @private
 */
export const titleContainerStyleDesktop = mergeStyles({
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  fontWeight: 600
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
  ...callDetailsStyle
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

/**
 * Styles for layer host to bound the modal wrapping Call Readiness screens
 * @private
 */
export const callReadinessModalLayerHostStyle: IStyle = {
  display: 'flex',
  position: 'absolute',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  top: '0',
  left: '0',
  zIndex: '10000',
  // pointer events for layerHost set to none to make descendants interactive
  pointerEvents: 'none'
};
