// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackTokens, mergeStyles } from '@fluentui/react';

export const mainStackTokens: IStackTokens = {
  childrenGap: '1rem'
};
export const buttonsStackTokens: IStackTokens = {
  childrenGap: '0.75rem'
};
export const upperStackTokens: IStackTokens = {
  childrenGap: '1.5rem'
};
export const bottomStackTokens: IStackTokens = {
  childrenGap: '1.4375rem'
};
export const endCallContainerStyle = mergeStyles({
  height: '100%',
  width: '100% ',
  padding: '0.5rem', //half childrenGap from Stack
  minWidth: '21.625rem', // max of min-width from stack items + padding * 2 = 20.625 + 0.5 * 2
  minHeight: 'auto'
});
export const endCallTitleStyle = mergeStyles({
  fontSize: '1.375rem',
  fontWeight: 600,
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
export const videoCameraIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem'
});
export const bottomStackFooterStyle = mergeStyles({
  fontSize: '0.875 rem'
});
