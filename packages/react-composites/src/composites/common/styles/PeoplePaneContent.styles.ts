// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackItemStyles, IStackStyles, IStackTokens, Theme } from '@fluentui/react';

/**
 * @private
 */
export const peoplePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const peoplePaneContainerStyle: IStackItemStyles = {
  root: {
    position: 'relative',
    maxHeight: '100%',
    overflow: 'hidden'
  }
};

/**
 * @private
 */
export const participantListContainerStyles: IStackItemStyles = { root: { overflowY: 'scroll' } };

/**
 * @private
 */
export const copyLinkButtonContainerStyles: IStackStyles = { root: { width: '100%', padding: '0.5rem 1rem' } };

/**
 * @private
 */
export const copyLinkButtonStackStyles: IStackStyles = { root: { marginLeft: '0.5rem', marginRight: '0.5rem' } };

/**
 * @private
 */
export const copyLinkButtonStyles: IButtonStyles = {
  root: {
    height: '2.5rem',
    width: '100%'
  },
  textContainer: {
    display: 'contents'
  }
};

/**
 * @private
 */
export const linkIconStyles = {
  marginRight: '0.5rem'
};

/**
 * @private
 */
export const localAndRemotePIPStyles: IStackStyles = { root: { marginRight: '1rem' } };

/**
 * @private
 */
export const themedCopyLinkButtonStyles = (mobileView: boolean | undefined, theme: Theme): Partial<IButtonStyles> => ({
  root: {
    minHeight: mobileView ? '3rem' : '2.5rem',
    borderRadius: mobileView ? theme.effects.roundedCorner6 : theme.effects.roundedCorner4
  }
});
