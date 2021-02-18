// © Microsoft Corporation. All rights reserved.

import { IStackItemStyles, IStackStyles, getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

export const headerStyles: IStackItemStyles = {
  root: {
    width: '100%'
  }
};

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
