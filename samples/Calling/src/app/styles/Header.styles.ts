// © Microsoft Corporation. All rights reserved.

import { getTheme, mergeStyles, IButtonStyles } from '@fluentui/react';

const headerShadow = 'rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px, rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px';

const palette = getTheme().palette;

export const headerContainer = mergeStyles({
  width: '100%',
  height: '3.875rem',
  padding: '0.0625rem 0',
  boxShadow: headerShadow,
  overflow: 'hidden',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 2
});

export const headerCenteredContainer = mergeStyles(headerContainer, {
  justifyContent: 'center'
});

export const separatorContainerStyle = mergeStyles({
  display: 'inline-block',
  padding: '0 1rem',
  height: '1.875rem'
});

export const itemSelectedStyle = mergeStyles({
  color: palette.themePrimary
});

export const separatorStyles = {
  root: {
    color: palette.neutralLight,
    width: '0.0625rem' // 1px
  }
};

export const controlButtonStyles: IButtonStyles = {
  root: {
    background: 'none',
    border: 'none',
    borderRadius: 0,
    minHeight: '3.5rem',
    minWidth: '3.5rem'
  },
  flexContainer: {
    flexFlow: 'column'
  }
};
