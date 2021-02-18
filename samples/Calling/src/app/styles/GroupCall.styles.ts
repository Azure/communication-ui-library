// © Microsoft Corporation. All rights reserved.

import { IStackItemStyles, IStackStyles, getTheme } from '@fluentui/react';

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
    overflow: 'hidden'
  }
};
export const subContainerStyles: IStackStyles = {
  root: {
    overflow: 'hidden',
    width: '100%'
  }
};
export const paneStyles: IStackItemStyles = {
  root: {
    width: '17.875rem'
  }
};
export const overlayStyles: IStackItemStyles = {
  root: {
    background: palette.white,
    marginTop: '4rem'
  }
};
export const activeContainerClassName: IStackItemStyles = {
  root: {
    border: `solid 1px ${palette.neutralLighterAlt}`,
    display: 'flex',
    height: '100%'
  }
};

export const loadingStyle: IStackStyles = {
  root: {
    height: '100%',
    width: '100%'
  }
};
