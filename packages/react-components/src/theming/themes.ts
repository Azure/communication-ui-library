// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme as V8Theme, PartialTheme as PartialV8Theme } from '@fluentui/react';
import { Theme as V9Theme, PartialTheme as PartialV9Theme } from '@fluentui/react-components';

/**
 * Custom Fluent theme pallette used by calling related components in this library.
 *
 * @public
 */
export interface CallingTheme {
  callingPalette: {
    callRed: string;
    callRedDark: string;
    callRedDarker: string;
    iconWhite: string;
    /* @conditional-compile-remove(raise-hand) */
    raiseHandGold: string;
  };
}

/**
 * Theme wrapper for components used by this library.
 *
 * @public
 */
export type Theme = V8Theme & { fluent9Theme: V9Theme };

/**
 * Theme override wrapper for components used by this library.
 *
 * @public
 */
export type PartialTheme = PartialV8Theme & { fluent9Theme: PartialV9Theme };

/**
 * Preset light theme for components exported from this library.
 *
 * @public
 */
export const lightTheme: PartialTheme & CallingTheme = {
  fluent9Theme: {
    colorBrandBackground2: '#C7E0F4',
    colorStatusDangerForeground1: '#a80000',
    colorNeutralStrokeAccessible: '#605e5c',
    colorCompoundBrandStroke: '#0078d4'
  },
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#59b0f7',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff'
  },
  callingPalette: {
    callRed: '#a42e43',
    callRedDark: '#8b2c3d',
    callRedDarker: '#772a38',
    iconWhite: '#ffffff',
    /* @conditional-compile-remove(raise-hand) */
    raiseHandGold: '#eaa300'
  },
  semanticColors: {
    errorText: '#a80000'
  }
};

/**
 * Preset dark theme for components exported from this library.
 *
 * @public
 */
export const darkTheme: PartialTheme & CallingTheme = {
  fluent9Theme: {
    colorBrandBackground2: '#0C2E49',
    colorStatusDangerForeground1: '#f1707b',
    colorNeutralStrokeAccessible: '#d0d0d0',
    colorCompoundBrandStroke: '#2899f5'
  },
  palette: {
    themePrimary: '#2899f5',
    themeLighterAlt: '#02060a',
    themeLighter: '#061827',
    themeLight: '#0c2e49',
    themeTertiary: '#185b93',
    themeSecondary: '#2286d7',
    themeDarkAlt: '#3ca2f6',
    themeDark: '#59b0f7',
    themeDarker: '#84c5f9',
    neutralLighterAlt: '#302e2d',
    neutralLighter: '#383735',
    neutralLight: '#464443',
    neutralQuaternaryAlt: '#4e4d4b',
    neutralQuaternary: '#4d4b49',
    neutralTertiaryAlt: '#72706e',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#252423'
  },
  callingPalette: {
    callRed: '#c4314b',
    callRedDark: '#a42e43',
    callRedDarker: '#8b2c3d',
    iconWhite: '#ffffff',
    /* @conditional-compile-remove(raise-hand) */
    raiseHandGold: '#eaa300'
  },
  semanticColors: {
    errorText: '#f1707b'
  }
};
