// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStackTokens, mergeStyles } from '@fluentui/react';

export const mainStackTokens: IStackTokens = {
  childrenGap: '2.75rem'
};

export const buttonsStackTokens: IStackTokens = {
  childrenGap: '0.75rem'
};

export const upperStackTokens: IStackTokens = {
  childrenGap: '1.5rem'
};
export const endChatContainerStyle = mergeStyles({
  height: '100%',
  width: '100% ',
  padding: '1.375rem', // half childrenGap from Stack
  minWidth: '22.75rem', // max of min-width from stack items + padding * 2 = 20.625 + 1.375 * 2
  minHeight: 'auto'
});

export const endChatTitleStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.375rem', // 22px
  width: '20rem'
});

export const buttonStyle = mergeStyles({
  fontWeight: 600,
  height: '2.5rem',
  width: '9.875rem',
  fontSize: '0.875rem', // 14px
  padding: 0
});

export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};

export const chatIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem' // 22px
});

export const bottomStackFooterStyle = mergeStyles({
  fontSize: '0.875rem' // 14px
});

export const buttonTextStyle = mergeStyles({
  fontSize: '0.875rem' // 14px
});
