// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconProps, mergeStyles } from '@fluentui/react';

export const chatHeaderContainerStyle = mergeStyles({
  width: '100%',
  height: 'auto',
  paddingLeft: '3.25rem',
  paddingRight: '3.25rem',
  '@media (max-width: 65rem)': {
    paddingLeft: '5%',
    paddingRight: '5%'
  }
});

export const leaveButtonStyle = mergeStyles({
  marginRight: '0.625rem',
  width: '6.688rem',
  borderWidth: '0.125rem',
  fontSize: '0.875rem', // 14px
  fontWeight: 600
});

export const greyIconButtonStyle = mergeStyles({
  marginRight: '0.5rem'
});

export const leaveIcon: IIconProps = {
  iconName: 'Leave'
};

export const panelButtonStyle = mergeStyles({
  padding: '0px 13px'
});

export const iconButtonContainerStyle = mergeStyles({
  whiteSpace: 'nowrap',
  '@media (min-width: 50rem)': {
    display: 'none'
  }
});

export const largeButtonContainerStyle = mergeStyles({
  whiteSpace: 'nowrap',
  '@media (max-width: 50rem)': {
    display: 'none'
  }
});

export const leaveIconStyle = mergeStyles({
  marginRight: '0.5em',
  fontSize: '0.875rem' // 14px
});
