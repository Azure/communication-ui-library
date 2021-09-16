// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, mergeStyles } from '@fluentui/react';

export const mainStackTokens: IStackTokens = {
  childrenGap: '0.25em'
};
export const buttonsStackTokens: IStackTokens = {
  childrenGap: '0.75em'
};
export const upperStackTokens: IStackTokens = {
  childrenGap: '1.5em'
};
export const bottomStackTokens: IStackTokens = {
  childrenGap: '1.4375em'
};
export const endCallContainerStyle = mergeStyles({
  width: '20.625em'
});
export const endCallTitleStyle = mergeStyles({
  fontSize: '1.375em',
  fontWeight: 600
});
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  height: '2.5em',
  width: '9.875em',
  fontSize: '0.875em', // 14px
  padding: 0
});
export const videoCameraIconStyle = mergeStyles({
  marginRight: '0.375em',
  fontSize: '1.375em'
});
export const bottomStackFooterStyle = mergeStyles({
  fontSize: '0.875 em'
});
