// © Microsoft Corporation. All rights reserved.

import { IStackItemStyles, IStackStyles, getTheme, mergeStyles } from '@fluentui/react';

const headerShadow = 'rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px, rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px';

const palette = getTheme().palette;

export const headerStyles: IStackItemStyles = {
  root: {
    width: '100%'
  }
};

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

export const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    display: 'flex'
  }
};

export const subContainerStyles: IStackStyles = {
  root: {
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'column',
    display: 'flex'
  }
};

export const activeContainerClassName: IStackItemStyles = {
  root: {
    border: `solid 1px ${palette.neutralLighterAlt}`,
    display: 'flex',
    height: '100%',
    position: 'relative'
  }
};

export const loadingStyle = mergeStyles({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});
