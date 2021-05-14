// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconProps, IPivotStyles, getTheme, mergeStyles } from '@fluentui/react';

export const chatHeaderContainerStyle = mergeStyles({
  width: '100%',
  height: 'auto',
  paddingLeft: '3.25rem',
  paddingRight: '3.25rem',
  marginTop: '1rem',
  selectors: {
    '@media (max-width: 65rem)': {
      paddingLeft: '5%',
      paddingRight: '5%'
    }
  },
  borderBottom: '0.063rem solid #DDDDDD'
});

export const topicNameContainerStyle = mergeStyles({
  height: '100%',
  maxWidth: '100%',
  display: 'flex',
  alignItems: 'center',
  marginLeft: '0.625rem'
});

export const topicNameLabelStyle = mergeStyles({
  fontSize: '1rem', // 16px
  fontWeight: 600,
  marginRight: '0.125rem',
  textOverflow: 'ellipsis',
  overflowY: 'hidden'
});

export const leaveButtonContainerStyle = mergeStyles({
  height: '100%',
  display: 'flex',
  alignItems: 'center'
});

export const leaveButtonStyle = mergeStyles({
  marginRight: '0.625rem',
  width: '6.688rem',
  borderWidth: '0.125rem',
  fontSize: '0.875rem', // 14px
  fontWeight: 600
});

export const greyIconButtonStyle = mergeStyles({
  color: '#323130',
  marginRight: '0.5rem'
});

export const editIcon: IIconProps = {
  iconName: 'Edit'
};

export const leaveIcon: IIconProps = {
  iconName: 'Leave'
};

export const pivotItemStyle = mergeStyles({
  padding: '0px 13px'
});

const palette = getTheme().palette;
export const pivotItemStyles: Partial<IPivotStyles> = {
  linkIsSelected: {
    padding: 0,
    marginRight: 0,
    height: '100%',
    color: palette.themePrimary,
    selectors: {
      ':hover': { color: palette.themePrimary }
    }
  },
  link: { padding: 0, marginRight: 0, height: 60 },
  root: {
    width: 84,
    height: 60,
    marginRight: '0.5rem',
    display: 'inline-block',
    verticalAlign: 'top'
  }
};

export const iconButtonContainerStyle = mergeStyles({
  whiteSpace: 'nowrap',
  selectors: {
    '@media (min-width: 50rem)': {
      display: 'none'
    }
  }
});

export const largeButtonContainerStyle = mergeStyles({
  whiteSpace: 'nowrap',
  selectors: {
    '@media (max-width: 50rem)': {
      display: 'none'
    }
  }
});
