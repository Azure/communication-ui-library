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
    display: 'flex'
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
    display: 'flex'
  }
};

export const loadingStyle = mergeStyles({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});
