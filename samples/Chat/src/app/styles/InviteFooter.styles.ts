//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStackTokens, ITextFieldStyles, mergeStyles } from '@fluentui/react';

export const paneFooterTokens: IStackTokens = {
  childrenGap: 5
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
  fontSize: '1rem', // 16px
  fontWeight: 600,
  marginLeft: '1rem',
  marginRight: '1rem',
  marginTop: '1rem'
});

export const copyLinkButtonStyle = mergeStyles({
  fontWeight: 600,
  height: '2.5rem',
  marginLeft: '1rem',
  marginRight: '1rem',
  width: '90%'
});

export const copyIconStyle = mergeStyles({
  marginRight: '0.5em',
  fontSize: '0.875rem' // 14px
});

export const copyLinkTextStyle = mergeStyles({
  fontSize: '1rem'
});

export const inviteFooterStackContainerStyles = mergeStyles({
  minHeight: '7.25rem',
  borderTop: '0.063rem solid #DDDDDD'
});

export const inviteFooterStackStyles: IStackStyles = {
  root: {
    marginBottom: '1.25rem'
  }
};

export const saveButtonTextStyle = mergeStyles({
  fontSize: '0.875rem' // 14px
});
