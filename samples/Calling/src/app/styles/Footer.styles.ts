// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackStyles, IStackTokens, ITextFieldStyles, mergeStyles } from '@fluentui/react';
/**
 * Style properties for the pane footer component.
 */
export const paneFooterStyles: IStackStyles = {
  root: {
    marginBottom: '1.25rem'
  }
};
/**
 * Style properties for the footer stack tokens.
 */
export const paneFooterTokens: IStackTokens = {
  childrenGap: '0.3125rem'
};
/**
 * Style properties for the text field.
 */
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
/**
 * Style properties for the footer main text.
 */
export const footerMainTextStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1rem',
  marginLeft: '1rem',
  marginRight: '1rem'
});

/**
 * Style properties for the copy link button.
 */
export const copyLinkButtonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  height: '2.5rem',
  marginLeft: '1rem',
  marginRight: '1rem',
  width: '90%'
});

/**
 * Style properties for the button with icon.
 */
export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};
/**
 * Style properties for the copy icon.
 */
export const copyIconStyle = mergeStyles({
  marginRight: '0.5em'
});
