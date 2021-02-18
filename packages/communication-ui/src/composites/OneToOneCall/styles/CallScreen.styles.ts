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
    minHeight: '9.375rem',
    width: '100%'
  }
};

export const activeContainerClassName: IStackItemStyles = {
  root: {
    border: `solid 1px ${palette.neutralLighterAlt}`,
    height: 'calc(100% - 0.1875rem)',
    display: 'initial'
  }
};

export const loadingStyle = mergeStyles({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});
