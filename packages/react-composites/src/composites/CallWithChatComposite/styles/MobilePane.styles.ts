// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  IButtonStyles,
  IModalStyleProps,
  IModalStyles,
  IStackStyles,
  IStyleFunctionOrObject
} from '@fluentui/react';

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
  root: { border: 'none', minWidth: '2.5rem', height: '100%', background: 'none', padding: '0 1rem 0 0.5rem' },
  rootChecked: { background: 'none' },
  rootCheckedHovered: { background: 'none' }
};

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
export const modalStyle: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
  main: {
    minWidth: 'min-content',
    minHeight: 'min-content',
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
    // pointer events for root Modal div set to auto to make LocalAndRemotePIP interactive
    pointerEvents: 'auto',
    touchAction: 'none'
  },
  root: {
    width: '100%',
    height: '100%',
    // pointer events for root Modal div set to none to make descendants interactive
    pointerEvents: 'none'
  }
};
