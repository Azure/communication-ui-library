// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStackTokens, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const mainStackTokens: IStackTokens = {
  childrenGap: '0.25rem'
};

/**
 * @private
 */
export const buttonsStackTokens: IStackTokens = {
  childrenGap: '0.75rem'
};

/**
 * @private
 */
export const upperStackTokens: IStackTokens = {
  childrenGap: '1.5rem'
};

/**
 * @private
 */
export const bottomStackTokens: IStackTokens = {
  childrenGap: '1.4375rem'
};

/**
 * @private
 */
export const endCallContainerStyle = mergeStyles({
  width: '20.625rem',
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  margin: 'auto'
});

/**
 * @private
 */
export const endCallTitleStyle = mergeStyles({
  fontSize: '1.375rem',
  fontWeight: 600
});

/**
 * @private
 */
export const buttonStyles: IButtonStyles = {
  root: {
    fontWeight: 600,
    height: '2.5rem',
    width: '9.875rem',
    fontSize: '0.875rem', // 14px
    padding: 0
  },
  textContainer: {
    display: 'contents'
  }
};

/**
 * @private
 */
export const videoCameraIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem'
});

/**
 * @private
 */
export const bottomStackFooterStyle = mergeStyles({
  fontSize: '0.875 rem'
});
