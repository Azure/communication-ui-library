// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStackTokens, ITextFieldStyles, mergeStyles } from '@fluentui/react';

export const paneFooterStyles: IStackStyles = {
  root: {
    marginBottom: '1.25em'
  }
};

export const paneFooterTokens: IStackTokens = {
  childrenGap: '0.3125em'
};

export const textFieldStyles: Partial<ITextFieldStyles> = {
  field: {
    padding: 0
  },
  root: {
    marginLeft: '1em',
    marginRight: '1em'
  },
  fieldGroup: {
    border: 'none'
  }
};

export const footerMainTextStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1em',
  marginLeft: '1em',
  marginRight: '1em'
});

export const copyLinkButtonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875em', // 14px
  height: '2.5em',
  marginLeft: '1em',
  marginRight: '1em',
  width: '90%'
});

export const copyIconStyle = mergeStyles({
  marginRight: '0.5em'
});
