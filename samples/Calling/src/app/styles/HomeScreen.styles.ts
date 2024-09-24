// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackTokens, mergeStyles } from '@fluentui/react';
import { FontWeights, IStackStyles, IStyle } from '@fluentui/react';

export const imgStyle = mergeStyles({
  width: '16.5rem',
  padding: '0.5rem',
  '@media (max-width: 67.1875rem)': {
    display: 'none'
  }
});
export const containerTokens: IStackTokens = {
  childrenGap: '4rem'
};
export const infoContainerStyle = mergeStyles({
  padding: '0.5rem',
  width: '20rem'
});
export const containerStyle = mergeStyles({
  height: '100%',
  width: '100% ',
  padding: '2rem', //half childrenGap from Stack
  minWidth: '24rem', // max of min-width from stack items + padding * 2 = 20 + 2 * 2
  minHeight: 'auto'
});
export const configContainerStyle = mergeStyles({
  minWidth: '10rem',
  width: 'auto',
  height: 'auto'
});
export const configContainerStackTokens: IStackTokens = {
  childrenGap: '1.25rem'
};
export const callContainerStackTokens: IStackTokens = {
  childrenGap: '0.75rem'
};
export const callOptionsGroupStyles = {
  label: { padding: 0 }
};
export const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.25rem', // 20px
  lineHeight: '1.75rem', // 28px
  width: '20rem',
  marginBottom: '1.5rem'
});
export const bodyItemStyle = mergeStyles({
  marginTop: '1.25rem'
});
export const teamsItemStyle = mergeStyles({
  marginTop: '0.75rem'
});
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  width: '100%',
  height: '2.5rem',
  borderRadius: 3,
  padding: '0.625rem'
});
export const outboundTextField = mergeStyles({
  paddingTop: '0.5rem'
});
export const dialpadOptionStyles: IStackStyles = {
  root: {
    margin: 'auto',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem'
  }
};

export const alternateCallerIdCalloutStyles: IStyle = {
  width: '25rem',
  height: '12rem',
  maxWidth: '90%',
  padding: '20px 24px'
};

export const alternateCallerIdCalloutTitleStyles: IStyle = {
  marginBottom: 12,
  fontWeight: FontWeights.semilight
};

export const alternateCallerIdCalloutLinkStyles: IStyle = {
  display: 'block',
  marginTop: 20
};
