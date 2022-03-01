// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStackStyles, IStackTokens } from '@fluentui/react';

/**
 * @private
 */
export const peoplePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const localAndRemotePIPStyles: IStackStyles = { root: { marginRight: '1rem' } };

/**
 * @private
 */
export const copyLinkButtonContainerStyles: IStackStyles = { root: { width: '100%', padding: '0.5rem 1rem' } };

/**
 * @private
 */
export const copyLinkButtonStyles: IButtonStyles = {
  root: {
    height: '3rem',
    width: '100%',
    borderRadius: '0.5rem'
  },
  textContainer: {
    display: 'contents'
  }
};

/**
 * @private
 */
export const linkIconStyles = { marginRight: '0.5rem' };
