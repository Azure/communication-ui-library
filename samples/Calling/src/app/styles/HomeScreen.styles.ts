// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackTokens, mergeStyles } from '@fluentui/react';
import { FontWeights, IStackStyles, IStyle } from '@fluentui/react';

/**
 * Style properties for the home screen image.
 */
export const imgStyle = mergeStyles({
  width: '16.5rem',
  padding: '0.5rem',
  '@media (max-width: 67.1875rem)': {
    display: 'none'
  }
});
/**
 * Style properties for the container of the home screen.
 * These styles ensure that the children are spaced correctly.
 */
export const containerTokens: IStackTokens = {
  childrenGap: '4rem'
};
/**
 * Style properties for the home screen information container.
 */
export const infoContainerStyle = mergeStyles({
  padding: '0.5rem',
  width: '20rem'
});
/**
 * Style properties for the home screen container.
 */
export const containerStyle = mergeStyles({
  height: '100%',
  width: '100% ',
  padding: '2rem', //half childrenGap from Stack
  minWidth: '24rem', // max of min-width from stack items + padding * 2 = 20 + 2 * 2
  minHeight: 'auto'
});
/**
 * Style properties for the home screen configuration container.
 */
export const configContainerStyle = mergeStyles({
  minWidth: '10rem',
  width: 'auto',
  height: 'auto'
});
/**
 * Style properties for the configuration container stack.
 * These styles ensure that the children are spaced correctly.
 */
export const configContainerStackTokens: IStackTokens = {
  childrenGap: '1.25rem'
};
/**
 * Style properties for the call container stack.
 * These styles ensure that the children are spaced correctly.
 */
export const callContainerStackTokens: IStackTokens = {
  childrenGap: '0.75rem'
};
/**
 * Style properties for the call options group.
 */
export const callOptionsGroupStyles = {
  label: { padding: 0 }
};
/**
 * Style properties for the header of the home screen.
 */
export const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.25rem', // 20px
  lineHeight: '1.75rem', // 28px
  width: '20rem',
  marginBottom: '1.5rem'
});
/**
 * Style properties for the body of the home screen.
 */
export const bodyItemStyle = mergeStyles({
  marginTop: '1.25rem'
});
/**
 * Style properties for the Teams item in the home screen.
 */
export const teamsItemStyle = mergeStyles({
  marginTop: '0.75rem'
});
/**
 * Style properties for the buttons in the home screen.
 */
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  width: '100%',
  height: '2.5rem',
  borderRadius: 3,
  padding: '0.625rem'
});
/**
 * Style properties for the text field in the home screen.
 */
export const outboundTextField = mergeStyles({
  paddingTop: '0.5rem'
});
/**
 * Style properties for the dialpad option in the home screen.
 */
export const dialpadOptionStyles: IStackStyles = {
  root: {
    margin: 'auto',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem'
  }
};
/**
 * Style properties for the alternate caller ID callout.
 */
export const alternateCallerIdCalloutStyles: IStyle = {
  width: '25rem',
  height: '12rem',
  maxWidth: '90%',
  padding: '20px 24px'
};
/**
 * Style properties for the title of the alternate caller ID callout.
 */
export const alternateCallerIdCalloutTitleStyles: IStyle = {
  marginBottom: 12,
  fontWeight: FontWeights.semilight
};
/**
 * Style properties for the link in the alternate caller ID callout.
 */
export const alternateCallerIdCalloutLinkStyles: IStyle = {
  display: 'block',
  marginTop: 20
};
