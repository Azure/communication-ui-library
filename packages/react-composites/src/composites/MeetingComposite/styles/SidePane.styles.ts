// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItemStyles, IStackStyles, IStackItemStyles, IStackTokens, getTheme } from '@fluentui/react';

const theme = getTheme();
const palette = theme.palette;

export const sidePaneContainerStyles: IStackItemStyles = {
  root: {
    height: '100%',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    width: '21.5rem'
  }
};

export const sidePaneContainerHiddenStyles: IStackItemStyles = {
  root: {
    ...sidePaneContainerStyles,
    display: 'none'
  }
};

export const sidePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

export const sidePaneHeaderStyles: IStackItemStyles = {
  root: {
    fontSize: '0.825rem',
    lineHeight: '1.25rem',
    padding: '0.25rem',
    fontWeight: '600'
  }
};

export const sidePaneCloseButtonStyles: Partial<IContextualMenuItemStyles> = {
  icon: { color: palette.neutralSecondary },
  iconHovered: { color: palette.neutralSecondary },
  iconPressed: { color: palette.neutralSecondary }
};

export const paneBodyContainer: IStackStyles = { root: { flexDirection: 'column', display: 'flex' } };
export const scrollableContainer: IStackStyles = { root: { flexBasis: '0', flexGrow: '1', overflowY: 'auto' } };
export const scrollableContainerContents: IStackItemStyles = { root: { flexGrow: '1', flexBasis: '0' } };

export const peopleSubheadingStyle: IStackItemStyles = {
  root: {
    fontSize: '0.75rem',
    color: palette.neutralSecondary
  }
};

export const peoplePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5rem'
};
