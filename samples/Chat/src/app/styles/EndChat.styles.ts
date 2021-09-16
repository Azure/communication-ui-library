// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, mergeStyles } from '@fluentui/react';

export const mainStackTokens: IStackTokens = {
  childrenGap: 44
};

export const buttonsStackTokens: IStackTokens = {
  childrenGap: 12
};

export const upperStackTokens: IStackTokens = {
  childrenGap: 24
};
export const endCallContainerStyle = mergeStyles({
  width: 330
});

export const endCallTitleStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.375em' // 22px
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
  fontSize: '1.375em' // 22px
});

export const bottomStackFooterStyle = mergeStyles({
  fontSize: '0.875em' // 14px
});

export const buttonTextStyle = mergeStyles({
  fontSize: '0.875em' // 14px
});
