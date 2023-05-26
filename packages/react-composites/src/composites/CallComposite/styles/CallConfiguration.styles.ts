// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IStackItemStyles,
  IStackStyles,
  IStackTokens,
  IStyle,
  mergeStyles,
  IButtonStyles,
  Theme,
  IPanelStyles,
  IFocusTrapZoneProps
} from '@fluentui/react';

/**
 * @private
 */
export const configurationStackTokensDesktop: IStackTokens = {
  childrenGap: '2rem'
};

/**
 * @private
 */
export const configurationStackTokensMobile: IStackTokens = {
  childrenGap: '1rem'
};

const configurationContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  padding: '0.5rem'
};

/**
 * @private
 */
export const configurationContainerStyleDesktop = mergeStyles({
  ...configurationContainerStyle,
  minWidth: '25rem', // sum of min-width from children + ChildrenGap * (nb of children - 1) + padding * 2 = (11 + 11) + (2 * 1) + 0.5 * 2
  minHeight: '22rem' // max height of SelectionContainer + padding * 2 = 21 + 0.5 * 2
});

/**
 * @private
 */
export const configurationContainerStyleMobile = mergeStyles({
  ...configurationContainerStyle,
  minWidth: '16rem', // from LocalPreview: ControlBar width + 0.5 * 2 for spacing + padding * 2 = 14 + 0.5 * 2 + 0.5 * 2
  minHeight: '13rem'
});

/**
 * @private
 */
export const selectionContainerStyle = mergeStyles({
  width: '50%',
  minWidth: '11rem',
  maxWidth: '18.75rem',
  padding: '0.5rem'
});

/**
 * @private
 */
export const titleContainerStyleDesktop = mergeStyles({
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  fontWeight: 600
});

/**
 * @private
 */
export const titleContainerStyleMobile = mergeStyles({
  fontSize: '1.0625rem',
  lineHeight: '1.375rem',
  fontWeight: 600,
  textAlign: 'center'
});

/**
 * @private
 */
export const callDetailsContainerStylesDesktop: IStackItemStyles = {
  root: {
    marginBottom: '1.563rem'
  }
};

const callDetailsStyle: IStyle = {
  fontSize: '0.9375',
  lineHeight: '1.25rem',
  marginTop: '0.25rem'
};

/**
 * @private
 */
export const callDetailsStyleDesktop = mergeStyles({
  ...callDetailsStyle
});

/**
 * @private
 */
export const callDetailsStyleMobile = mergeStyles({
  ...callDetailsStyle,
  textAlign: 'center'
});

/**
 * @private
 */
export const startCallButtonContainerStyleDesktop: IStackStyles = {
  root: {
    paddingTop: '1.125rem'
  }
};

/**
 * @private
 */
export const startCallButtonContainerStyleMobile: IStackStyles = {
  root: {
    textAlign: 'center'
  }
};

/**
 * @private
 */
export const startCallButtonStyleMobile = mergeStyles({
  width: '100%',
  maxWidth: 'unset'
});

/** @private */
export const cameraAndVideoEffectsContainerStyleDesktop: IStackItemStyles = {
  root: {
    alignItems: 'center'
  }
};

/**
 * @private
 */
export const effectsButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      background: 'transparent',
      border: 'none',
      color: theme.palette.themePrimary,
      // Top and bottom padding needs to be 5px to match the label padding
      padding: '5px 0.25rem',
      ':hover, :focus': {
        color: theme.palette.themePrimary
      },
      svg: {
        height: '1rem',
        width: '1rem'
      }
    },
    rootChecked: {
      color: theme.palette.themePrimary
    },
    rootHovered: {
      color: theme.palette.themePrimary
    },
    rootPressed: {
      color: theme.palette.themePrimary
    },
    rootFocused: {
      color: theme.palette.themePrimary
    }
  };
};

/** @private */
export const fillWidth = mergeStyles({
  width: '100%'
});

/** @private */
export const panelStyles: Partial<IPanelStyles> = {
  content: {
    display: 'flex',
    flexBasis: '100%'
  },
  scrollableContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
};

/** @private */
export const panelFocusProps: IFocusTrapZoneProps = {
  forceFocusInsideTrap: false
};
