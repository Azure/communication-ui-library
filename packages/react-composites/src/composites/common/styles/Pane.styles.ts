// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, IButtonStyles, IStackStyles, IStackTokens, ITheme, mergeStyles } from '@fluentui/react';
import { CHAT_CONTAINER_MIN_WIDTH_REM } from '../constants';

const SIDE_PANE_PADDING_LR_REM = 0.25;

/**
 * @private
 */
export const mobilePaneStyle = { root: { width: '100%', height: '100%' } };

/**
 * @private
 */
export const hiddenMobilePaneStyle: IStackStyles = concatStyleSets(mobilePaneStyle, { root: { display: 'none' } });

/**
 * @private
 */
export const mobilePaneControlBarStyle: IStackStyles = { root: { height: '3rem' } };

/**
 * @private
 */
export const mobilePaneBackButtonStyles: IButtonStyles = {
  root: {
    border: 'none',
    minWidth: '2.5rem',
    maxWidth: '2.875rem',
    height: '100%',
    background: 'none',
    padding: '0 1rem'
  },
  rootChecked: { background: 'none' },
  rootCheckedHovered: { background: 'none' }
};

/**
 * @private
 */
export const mobilePaneHiddenIconStyles: IButtonStyles = concatStyleSets(mobilePaneBackButtonStyles, {
  root: { visibility: 'hidden' }
});

/**
 * @private
 */
export const mobilePaneButtonStyles: IButtonStyles = {
  root: {
    border: 'none',
    borderBottom: '0.125rem solid transparent',
    width: '8rem',
    height: '100%',
    background: 'none',
    padding: '0'
  },
  rootChecked: { background: 'none' },
  rootCheckedHovered: { background: 'none' },
  flexContainer: { flexFlow: 'column', display: 'contents' },
  label: {
    fontSize: '1rem',
    fontWeight: 100,
    lineHeight: '2rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  labelChecked: { fontWeight: 600 }
};

/**
 * @private
 */
export const hiddenStyles: IStackStyles = {
  root: {
    display: 'none'
  }
};

/**
 * @private
 */
export const sidePaneStyles = (maxWidth?: string, minWidth?: string): IStackStyles => ({
  root: {
    height: 'auto',
    width: '100%',
    padding: `0.5rem ${SIDE_PANE_PADDING_LR_REM}rem`,
    maxWidth: maxWidth ?? '21.5rem',
    minWidth: minWidth ?? `${CHAT_CONTAINER_MIN_WIDTH_REM + SIDE_PANE_PADDING_LR_REM * 2}rem`
  }
});

/**
 * @private
 */
export const availableSpaceStyles: IStackStyles = { root: { width: '100%', height: '100%' } };

/**
 * @private
 */
export const sidePaneTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/** @private */
export const paneHighContrastStyles = (theme: ITheme): string =>
  mergeStyles({
    '@media (forced-colors: active)': {
      border: `0.125rem solid ${theme.palette.black}`,
      borderRadius: theme.effects.roundedCorner4,
      margin: '0.5rem 0.25rem 0.5rem 0rem'
    }
  });
