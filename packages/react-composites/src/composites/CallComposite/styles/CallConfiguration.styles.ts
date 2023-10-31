// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IStackItemStyles,
  IStackStyles,
  IStackTokens,
  IStyle,
  mergeStyles,
  IButtonStyles,
  Theme,
  IPanelStyles,
  IFocusTrapZoneProps,
  IImageStyles,
  AnimationStyles,
  ITheme
} from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/** @private */
export const CONFIGURATION_PAGE_MIN_SECTION_WIDTH_REM = 11;
/** @private */
export const CONFIGURATION_PAGE_MAX_SECTION_WIDTH_REM = 20.625;

/**
 * @private
 */
export const configurationStackTokensDesktop: IStackTokens = {
  childrenGap: '1rem'
};

/**
 * @private
 */
export const configurationStackTokensMobile: IStackTokens = {
  childrenGap: '1.5rem'
};

/** @private */
export const configurationContainerStyle = (desktop: boolean, backgroundImageUrl?: string): IStackStyles => ({
  root: {
    height: '100%',
    width: '100%',
    padding: '2rem 1rem 2rem 1rem',
    minWidth: desktop
      ? '25rem' // sum of min-width from children + ChildrenGap * (nb of children - 1) + padding * 2 = (11 + 11) + (2 * 1) + 0.5 * 2
      : '16rem', // from LocalPreview: ControlBar width + 0.5 * 2 for spacing + padding * 2 = 14 + 0.5 * 2 + 0.5 * 2
    minHeight: desktop
      ? '22rem' // max height of SelectionContainer + padding * 2 = 21 + 0.5 * 2
      : '13rem',
    '::before': !backgroundImageUrl
      ? undefined
      : {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...AnimationStyles.fadeIn500
        }
  }
});

/**
 * @private
 */
export const configurationSectionStyle: IStackStyles = {
  root: {
    width: '100%',
    minWidth: `${CONFIGURATION_PAGE_MIN_SECTION_WIDTH_REM}rem`,
    maxWidth: `${CONFIGURATION_PAGE_MAX_SECTION_WIDTH_REM}rem`
  }
};

/**
 * @private
 */
export const selectionContainerStyle = (theme: ITheme): string =>
  mergeStyles({
    width: '100%',
    padding: '1rem',
    borderRadius: theme.effects.roundedCorner6,
    border: `0.0625rem solid ${theme.palette.neutralLight}`,
    boxShadow: theme.effects.elevation4,
    // Style the background of the container to have partial transparency.
    // Using `before:` pseudo-element to avoid having to wrap the content in an extra div.
    // Ideally rgba would be used but we cannot garauntee the format of theme.palette.white
    // to parse it correctly.
    position: 'relative',
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 0,
      background: theme.palette.white,
      opacity: 0.9,
      borderRadius: theme.effects.roundedCorner4
    }
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
export const callDetailsContainerStyles: IStackStyles = {
  root: {
    textAlign: 'center',
    maxWidth: _pxToRem(700),
    alignSelf: 'center'
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
  maxWidth: 'unset',
  borderRadius: '0.25rem'
});

/**
 * @private
 */
export const startCallButtonStyleDesktop = mergeStyles({
  borderRadius: '0.25rem',
  width: 'auto',
  height: '2.25rem'
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
  width: '100%',
  position: 'relative'
});

/** @private */
export const panelStyles: Partial<IPanelStyles> = {
  content: {
    display: 'flex',
    flexBasis: '100%',
    paddingLeft: '0rem', // remove default padding
    paddingRight: '0rem' // remove default padding
  },
  commands: {
    paddingTop: '0rem' // remove default padding
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

/**
 * @private
 */
export const logoStyles = (shape: 'circle' | 'square'): IImageStyles => ({
  root: {
    overflow: 'initial', // prevent the image being clipped
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  image: { borderRadius: shape === 'circle' ? '100%' : undefined, height: '3rem', width: '3rem' }
});
