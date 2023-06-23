// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, IButtonStyles, IStackStyles, IStackTokens } from '@fluentui/react';

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
  root: { border: 'none', minWidth: '2.5rem', height: '100%', background: 'none', padding: '0 1rem' },
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
export const sidePaneStyles = (maxWidth?: string): IStackStyles => ({
  root: {
    height: 'auto',
    width: '100%',
    padding: '0.5rem 0.25rem',
    maxWidth: maxWidth ?? '21.5rem'
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
