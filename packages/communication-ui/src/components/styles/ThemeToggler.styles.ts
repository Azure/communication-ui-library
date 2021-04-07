// © Microsoft Corporation. All rights reserved.

import { IStyle } from '@fluentui/react';

interface ThemeTogglerStyles {
  [key: string]: IStyle;
}

export const themeTogglerStyles: ThemeTogglerStyles = {
  dockedTop: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  },
  dockedBottom: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  dockedLeft: {
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%'
  },
  dockedRight: {
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  }
};
