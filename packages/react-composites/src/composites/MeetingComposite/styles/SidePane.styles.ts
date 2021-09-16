// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItemStyles, IStackStyles, IStackItemStyles, IStackTokens, getTheme } from '@fluentui/react';

const theme = getTheme();
const palette = theme.palette;

export const sidePaneContainerStyles: IStackItemStyles = {
  root: {
    height: '100%',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    width: '21.5em'
  }
};

export const sidePaneContainerHiddenStyles: IStackItemStyles = {
  root: {
    ...sidePaneContainerStyles,
    display: 'none'
  }
};

export const sidePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5em'
};

export const sidePaneHeaderStyles: IStackItemStyles = {
  root: {
    fontSize: '0.825em',
    lineHeight: '1.25em',
    padding: '0.25em',
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
    fontSize: '0.75em',
    color: palette.neutralSecondary
  }
};

export const peoplePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5em'
};
