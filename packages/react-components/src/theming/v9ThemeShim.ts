// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IEffects, IPalette, Theme as ThemeV8 } from '@fluentui/react';
import {
  BorderRadiusTokens,
  ColorTokens,
  ShadowTokens,
  Theme as ThemeV9,
  webLightTheme
} from '@fluentui/react-components';
import { blackAlpha, whiteAlpha, grey, grey10Alpha, grey12Alpha } from './themeDuplicates';

// These mappings are required for createV9Theme
// For more info, check https://react.fluentui.dev/iframe.html?viewMode=docs&id=concepts-migration-from-v8-components-theme-migration--page#compatible-themes

/**
 * Creates v9 color tokens from a v8 palette.
 */
const mapAliasColors = (palette: IPalette, inverted: boolean): ColorTokens => {
  return {
    colorNeutralForeground1: palette.neutralPrimary,
    colorNeutralForeground1Hover: palette.neutralPrimary,
    colorNeutralForeground1Pressed: palette.neutralPrimary,
    colorNeutralForeground1Selected: palette.neutralPrimary,
    colorNeutralForeground2: palette.neutralSecondary,
    colorNeutralForeground2Hover: palette.neutralPrimary,
    colorNeutralForeground2Pressed: palette.neutralPrimary,
    colorNeutralForeground2Selected: palette.neutralPrimary,
    colorNeutralForeground2BrandHover: palette.themePrimary,
    colorNeutralForeground2BrandPressed: palette.themeDarkAlt,
    colorNeutralForeground2BrandSelected: palette.themePrimary,
    colorNeutralForeground3: palette.neutralTertiary,
    colorNeutralForeground3Hover: palette.neutralSecondary,
    colorNeutralForeground3Pressed: palette.neutralSecondary,
    colorNeutralForeground3Selected: palette.neutralSecondary,
    colorNeutralForeground3BrandHover: palette.themePrimary,
    colorNeutralForeground3BrandPressed: palette.themeDarkAlt,
    colorNeutralForeground3BrandSelected: palette.themePrimary,
    colorNeutralForeground4: palette.neutralQuaternary,
    colorNeutralForegroundDisabled: palette.neutralTertiaryAlt,
    colorNeutralForegroundInvertedDisabled: whiteAlpha[40],
    colorBrandForegroundLink: palette.themeDarkAlt,
    colorBrandForegroundLinkHover: palette.themeDark,
    colorBrandForegroundLinkPressed: palette.themeDarker,
    colorBrandForegroundLinkSelected: palette.themeDarkAlt,
    colorNeutralForeground2Link: palette.neutralSecondary,
    colorNeutralForeground2LinkHover: palette.neutralPrimary,
    colorNeutralForeground2LinkPressed: palette.neutralPrimary,
    colorNeutralForeground2LinkSelected: palette.neutralPrimary,
    colorCompoundBrandForeground1: palette.themePrimary,
    colorCompoundBrandForeground1Hover: palette.themeDarkAlt,
    colorCompoundBrandForeground1Pressed: palette.themeDark,
    colorBrandForeground1: palette.themePrimary,
    colorBrandForeground2: palette.themeDarkAlt,
    colorBrandForeground2Hover: palette.themeDarkAlt,
    colorBrandForeground2Pressed: palette.themeDarkAlt,
    colorNeutralForeground1Static: palette.neutralPrimary,
    colorNeutralForegroundInverted: palette.white,
    colorNeutralForegroundInvertedHover: palette.white,
    colorNeutralForegroundInvertedPressed: palette.white,
    colorNeutralForegroundInvertedSelected: palette.white,
    colorNeutralForegroundOnBrand: palette.white,
    colorNeutralForegroundStaticInverted: palette.white,
    colorNeutralForegroundInvertedLink: palette.white,
    colorNeutralForegroundInvertedLinkHover: palette.white,
    colorNeutralForegroundInvertedLinkPressed: palette.white,
    colorNeutralForegroundInvertedLinkSelected: palette.white,
    colorNeutralForegroundInverted2: palette.white,
    colorBrandForegroundInverted: palette.themeSecondary,
    colorBrandForegroundInvertedHover: palette.themeTertiary,
    colorBrandForegroundInvertedPressed: palette.themeSecondary,
    colorBrandForegroundOnLight: palette.themePrimary,
    colorBrandForegroundOnLightHover: palette.themeDarkAlt,
    colorBrandForegroundOnLightPressed: palette.themeDark,
    colorBrandForegroundOnLightSelected: palette.themeDark,
    colorNeutralBackground1: palette.white,
    colorNeutralBackground1Hover: palette.neutralLighter,
    colorNeutralBackground1Pressed: palette.neutralQuaternaryAlt,
    colorNeutralBackground1Selected: palette.neutralLight,
    colorNeutralBackground2: palette.neutralLighterAlt,
    colorNeutralBackground2Hover: palette.neutralLighter,
    colorNeutralBackground2Pressed: palette.neutralQuaternaryAlt,
    colorNeutralBackground2Selected: palette.neutralLight,
    colorNeutralBackground3: palette.neutralLighter,
    colorNeutralBackground3Hover: palette.neutralLight,
    colorNeutralBackground3Pressed: palette.neutralQuaternary,
    colorNeutralBackground3Selected: palette.neutralQuaternaryAlt,
    colorNeutralBackground4: palette.neutralLighter,
    colorNeutralBackground4Hover: palette.neutralLighterAlt,
    colorNeutralBackground4Pressed: palette.neutralLighter,
    colorNeutralBackground4Selected: palette.white,
    colorNeutralBackground5: palette.neutralLight,
    colorNeutralBackground5Hover: palette.neutralLighter,
    colorNeutralBackground5Pressed: palette.neutralLighter,
    colorNeutralBackground5Selected: palette.neutralLighterAlt,
    colorNeutralBackground6: palette.neutralLight,
    colorNeutralBackgroundStatic: grey[20],
    colorNeutralBackgroundInverted: palette.neutralSecondary,
    colorNeutralBackgroundAlpha: inverted ? grey10Alpha[50] : whiteAlpha[50],
    colorNeutralBackgroundAlpha2: inverted ? grey12Alpha[70] : whiteAlpha[80],
    colorSubtleBackground: 'transparent',
    colorSubtleBackgroundHover: palette.neutralLighter,
    colorSubtleBackgroundPressed: palette.neutralQuaternaryAlt,
    colorSubtleBackgroundSelected: palette.neutralLight,
    colorSubtleBackgroundLightAlphaHover: inverted ? whiteAlpha[10] : whiteAlpha[80],
    colorSubtleBackgroundLightAlphaPressed: inverted ? whiteAlpha[5] : whiteAlpha[50],
    colorSubtleBackgroundLightAlphaSelected: 'transparent',
    colorSubtleBackgroundInverted: 'transparent',
    colorSubtleBackgroundInvertedHover: blackAlpha[10],
    colorSubtleBackgroundInvertedPressed: blackAlpha[30],
    colorSubtleBackgroundInvertedSelected: blackAlpha[20],
    colorTransparentBackground: 'transparent',
    colorTransparentBackgroundHover: 'transparent',
    colorTransparentBackgroundPressed: 'transparent',
    colorTransparentBackgroundSelected: 'transparent',
    colorNeutralBackgroundDisabled: palette.neutralLighter,
    colorNeutralBackgroundInvertedDisabled: whiteAlpha[10],
    colorNeutralStencil1: palette.neutralLight,
    colorNeutralStencil2: palette.neutralLighterAlt,
    colorNeutralStencil1Alpha: inverted ? whiteAlpha[10] : blackAlpha[10],
    colorNeutralStencil2Alpha: inverted ? whiteAlpha[5] : blackAlpha[5],
    colorBackgroundOverlay: blackAlpha[40],
    colorScrollbarOverlay: blackAlpha[50],
    colorBrandBackground: palette.themePrimary,
    colorBrandBackgroundHover: palette.themeDarkAlt,
    colorBrandBackgroundPressed: palette.themeDarker,
    colorBrandBackgroundSelected: palette.themeDark,
    colorCompoundBrandBackground: palette.themePrimary,
    colorCompoundBrandBackgroundHover: palette.themeDarkAlt,
    colorCompoundBrandBackgroundPressed: palette.themeDark,
    colorBrandBackgroundStatic: palette.themePrimary,
    colorBrandBackground2: palette.themeLighterAlt,
    colorBrandBackground2Hover: palette.themeLighterAlt,
    colorBrandBackground2Pressed: palette.themeLighterAlt,
    colorBrandBackground3Static: palette.themeDark,
    colorBrandBackground4Static: palette.themeDarker,
    colorBrandBackgroundInverted: palette.white,
    colorBrandBackgroundInvertedHover: palette.themeLighterAlt,
    colorBrandBackgroundInvertedPressed: palette.themeLight,
    colorBrandBackgroundInvertedSelected: palette.themeLighter,
    colorNeutralCardBackground: inverted ? grey[20] : grey[98],
    colorNeutralCardBackgroundHover: inverted ? grey[24] : palette.white,
    colorNeutralCardBackgroundPressed: inverted ? grey[18] : grey[96],
    colorNeutralCardBackgroundSelected: inverted ? grey[22] : grey[92],
    colorNeutralCardBackgroundDisabled: inverted ? grey[8] : grey[94],
    colorNeutralStrokeAccessible: palette.neutralSecondary,
    colorNeutralStrokeAccessibleHover: palette.neutralSecondary,
    colorNeutralStrokeAccessiblePressed: palette.neutralSecondary,
    colorNeutralStrokeAccessibleSelected: palette.themePrimary,
    colorNeutralStroke1: palette.neutralQuaternary,
    colorNeutralStroke1Hover: palette.neutralTertiaryAlt,
    colorNeutralStroke1Pressed: palette.neutralTertiaryAlt,
    colorNeutralStroke1Selected: palette.neutralTertiaryAlt,
    colorNeutralStroke2: palette.neutralQuaternaryAlt,
    colorNeutralStroke3: palette.neutralLighter,
    colorNeutralStrokeSubtle: palette.neutralQuaternaryAlt,
    colorNeutralStrokeOnBrand: palette.white,
    colorNeutralStrokeOnBrand2: palette.white,
    colorNeutralStrokeOnBrand2Hover: palette.white,
    colorNeutralStrokeOnBrand2Pressed: palette.white,
    colorNeutralStrokeOnBrand2Selected: palette.white,
    colorBrandStroke1: palette.themePrimary,
    colorBrandStroke2: palette.themeLight,
    colorBrandStroke2Hover: palette.themeLight,
    colorBrandStroke2Pressed: palette.themeLight,
    colorBrandStroke2Contrast: palette.themeLight,
    colorCompoundBrandStroke: palette.themePrimary,
    colorCompoundBrandStrokeHover: palette.themeDarkAlt,
    colorCompoundBrandStrokePressed: palette.themeDark,
    colorNeutralStrokeDisabled: palette.neutralQuaternaryAlt,
    colorNeutralStrokeInvertedDisabled: whiteAlpha[40],
    colorTransparentStroke: 'transparent',
    colorTransparentStrokeInteractive: 'transparent',
    colorTransparentStrokeDisabled: 'transparent',
    colorNeutralStrokeAlpha: inverted ? whiteAlpha[10] : blackAlpha[5],
    colorNeutralStrokeAlpha2: whiteAlpha[20],
    colorStrokeFocus1: palette.white,
    colorStrokeFocus2: palette.black,
    colorNeutralShadowAmbient: 'rgba(0,0,0,0.12)',
    colorNeutralShadowKey: 'rgba(0,0,0,0.14)',
    colorNeutralShadowAmbientLighter: 'rgba(0,0,0,0.06)',
    colorNeutralShadowKeyLighter: 'rgba(0,0,0,0.07)',
    colorNeutralShadowAmbientDarker: 'rgba(0,0,0,0.20)',
    colorNeutralShadowKeyDarker: 'rgba(0,0,0,0.24)',
    colorBrandShadowAmbient: 'rgba(0,0,0,0.30)',
    colorBrandShadowKey: 'rgba(0,0,0,0.25)'
  };
};

/**
 * Creates v9 shadow tokens from v8 effects.
 */
const mapShadowTokens = (effects: IEffects): Partial<ShadowTokens> => {
  return {
    shadow4: effects.elevation4,
    shadow8: effects.elevation8,
    shadow16: effects.elevation16,
    shadow64: effects.elevation64
  };
};

/**
 * Creates v9 border radius tokens from v8 effects
 */
const mapBorderRadiusTokens = (effects: IEffects): Partial<BorderRadiusTokens> => {
  return {
    borderRadiusSmall: effects.roundedCorner2,
    borderRadiusMedium: effects.roundedCorner4,
    borderRadiusLarge: effects.roundedCorner6
  };
};

/**
 * Creates a v9 theme from a v8 theme and base v9 theme.
 * FluentUI webLightTheme is used in case if no baseThemeV9 is provided.
 *
 * @private
 */
export const createV9Theme = (themeV8: ThemeV8, baseThemeV9?: ThemeV9): ThemeV9 & { errorText: string } => {
  const baseTheme = baseThemeV9 ?? webLightTheme;
  return {
    ...baseTheme,
    ...mapAliasColors(themeV8.palette, themeV8.isInverted),
    ...mapShadowTokens(themeV8.effects),
    ...mapBorderRadiusTokens(themeV8.effects),
    colorBrandBackground2: themeV8.palette.themeLight, // updated from palette.themeLighterAlt
    colorBrandBackground2Hover: themeV8.palette.themeLight, // updated from palette.themeLighterAlt
    colorBrandBackground2Pressed: themeV8.palette.themeLight, // updated from palette.themeLighterAlt
    colorStatusWarningBackground3: '#D83B01',
    errorText: themeV8.semanticColors.errorText,
    colorNeutralStroke1Selected: themeV8.palette.neutralQuaternary,
    colorNeutralForeground2: themeV8.palette.neutralSecondary,
    colorBrandForegroundLinkHover: themeV8.palette.themeDarker,
    colorNeutralBackground1Selected: themeV8.palette.neutralQuaternaryAlt
  };
};
