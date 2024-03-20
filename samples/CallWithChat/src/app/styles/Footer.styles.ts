// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackStyles, IStackTokens, ITextFieldStyles, mergeStyles } from '@fluentui/react';

export const paneFooterStyles: IStackStyles = {
  root: {
    marginBottom: '1.25rem'
  }
};

export const paneFooterTokens: IStackTokens = {
  childrenGap: '0.3125rem'
};

export const textFieldStyles: Partial<ITextFieldStyles> = {
  field: {
    padding: 0
  },
  root: {
    marginLeft: '1rem',
    marginRight: '1rem'
  },
  fieldGroup: {
    border: 'none'
  }
};

export const footerMainTextStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1rem',
  marginLeft: '1rem',
  marginRight: '1rem'
});

export const copyLinkButtonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  height: '2.5rem',
  marginLeft: '1rem',
  marginRight: '1rem',
  width: '90%'
});

export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};

export const copyIconStyle = mergeStyles({
  marginRight: '0.5em'
});
