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
export const CONFIGURATION_PAGE_SECTION_MIN_WIDTH_REM = 11;
/** @private */
export const CONFIGURATION_PAGE_SECTION_MAX_WIDTH_REM = 20.625;
/** @private */
export const CONFIGURATION_PAGE_SECTION_HEIGHT_REM = 13.625;

const LOGO_HEIGHT_REM = 3;

/**
 * @private
 */
export const configurationStackTokensDesktop: IStackTokens = {
  childrenGap: '1.5rem'
};

/**
 * @private
 */
export const configurationStackTokensMobile: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const deviceConfigurationStackTokens: IStackTokens = {
  childrenGap: '1.5rem'
};

/** @private */
export const configurationContainerStyle = (desktop: boolean, backgroundImageUrl?: string): IStackStyles => ({
  root: {
    height: '100%',
    width: '100%',
    padding: desktop ? '2rem 1rem 2rem 1rem' : '1rem 1rem 2rem 1rem',
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
    minWidth: `${CONFIGURATION_PAGE_SECTION_MIN_WIDTH_REM}rem`,
    maxWidth: `${CONFIGURATION_PAGE_SECTION_MAX_WIDTH_REM}rem`
  }
};

/**
 * @private
 */
export const selectionContainerStyle = (theme: ITheme, noSpeakerDropdownShown?: boolean): string =>
  mergeStyles({
    width: '100%',
    minHeight: noSpeakerDropdownShown ? 'auto' : `${CONFIGURATION_PAGE_SECTION_HEIGHT_REM}rem`,
    padding: '1rem',
    borderRadius: theme.effects.roundedCorner6,
    border: `0.0625rem solid ${theme.palette.neutralLight}`,
    overflow: 'hidden', // do not let child background overflow the curved corners
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
      opacity: 0.9
    }
  });

/**
 * @private
 */
export const titleContainerStyleDesktop = (theme: ITheme): string =>
  mergeStyles(
    {
      fontSize: '1.2rem',
      lineHeight: '1rem',
      fontWeight: 600
    },
    configurationPageTextDecoration(theme)
  );

/**
 * @private
 */
export const titleContainerStyleMobile = (theme: ITheme): string =>
  mergeStyles(
    {
      fontSize: '1.0625rem',
      lineHeight: '1.375rem',
      fontWeight: 600,
      textAlign: 'center'
    },
    configurationPageTextDecoration(theme)
  );

/**
 * Ensure configuration page text is legible on top of a background image.
 * @private
 */
const configurationPageTextDecoration = (theme: ITheme): IStyle => {
  return {
    textShadow: `0px 0px 8px ${theme.palette.whiteTranslucent40}`,
    fill: theme.semanticColors.bodyText,
    stroke: theme.palette.whiteTranslucent40,
    paintOrder: 'stroke fill',
    strokeWidth: _pxToRem(1.5),
    text: {
      letterSpacing: '-0.02rem' // cope with extra width due to stroke width
    },
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'auto',
      fill: theme.palette.neutralQuaternaryAlt,
      textShadow: 'none',
      stroke: 'none'
    }
  };
};

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

const callDetailsStyle = (theme: ITheme): IStyle => ({
  fontSize: '0.9375',
  lineHeight: '1.25rem',
  textShadow: `0px 0px 8px ${theme.palette.whiteTranslucent40}`,
  marginTop: '-0.33rem' // compensate for extra padding around the CallTitle that avoids the SVG shadowing being cut off
});

/**
 * @private
 */
export const callDetailsStyleDesktop = (theme: ITheme): string => mergeStyles(callDetailsStyle(theme));

/**
 * @private
 */
export const callDetailsStyleMobile = (theme: ITheme): string =>
  mergeStyles(callDetailsStyle(theme), {
    marginBottom: '0.5rem',
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
  borderRadius: '0.25rem',
  height: '3.25rem'
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
export const effectsButtonStyles = (theme: Theme, disabled?: boolean): IButtonStyles => {
  return {
    root: {
      background: 'transparent',
      border: 'none',
      color: theme.palette.themePrimary,
      // Top and bottom padding needs to be 5px to match the label padding
      padding: '5px 0.25rem',
      ':hover, :focus': disabled
        ? {}
        : {
            color: theme.palette.themePrimary
          },
      svg: {
        height: '1rem',
        width: '1rem'
      }
    },
    labelHovered: disabled
      ? {}
      : {
          color: theme.palette.themePrimary
        },
    rootChecked: disabled
      ? {}
      : {
          color: theme.palette.themePrimary
        },
    rootHovered: disabled
      ? {}
      : {
          color: theme.palette.themePrimary
        },
    rootPressed: disabled
      ? {}
      : {
          color: theme.palette.themePrimary
        },
    rootFocused: disabled
      ? {}
      : {
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
export const configurationCenteredContent = (fillsHeight: boolean, hasLogo?: boolean): string =>
  mergeStyles({
    width: '100%',
    position: 'relative',

    // If the content does not fill the height, center it vertically.
    // We do not include the logo in the centering per design. This allows it to fade
    // in and not shift the content. To exclude the logo, we subtract the logo height
    // and margin from the actual height. This allows the flex box's natural centering
    // to appropriately center the content.
    height: `calc(100% - ${!fillsHeight && hasLogo ? `${LOGO_HEIGHT_REM}rem` : '0rem'})`
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
export const logoStyles = (shape: undefined | 'unset' | 'circle'): IImageStyles => ({
  root: {
    overflow: 'initial', // prevent the image being clipped
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    height: `${LOGO_HEIGHT_REM}rem`,
    borderRadius: shape === 'circle' ? '100%' : undefined,
    aspectRatio: shape === 'circle' ? '1 / 1' : undefined,
    objectFit: shape === 'circle' ? 'cover' : undefined
  }
});
