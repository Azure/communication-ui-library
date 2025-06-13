// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackItemStyles, IStackStyles } from '@fluentui/react';

/**
 * Styles for the CallScreen component.
 * These styles are used to layout the call screen components.
 */
export const headerStyles: IStackItemStyles = {
  root: {
    width: '100%'
  }
};

/**
 * Styles for the container of the call screen.
 * These styles ensure that the containers take up the full height and width of the screen.
 */
export const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  }
};
/**
 * Styles for the sub-container of the call screen.
 * These styles ensure that the sub-containers take up the full height and width of the screen.
 */
export const subContainerStyles: IStackStyles = {
  root: {
    overflow: 'hidden',
    width: '100%',
    flexBasis: '0'
  }
};
/**
 * Styles for the pane of the call screen.
 * These styles ensure that the pane has a fixed width.
 */
export const paneStyles: IStackItemStyles = {
  root: {
    width: '17.875rem'
  }
};
/**
 * Styles for the active container of the call screen.
 * These styles ensure that the active container takes up the full height of the screen.
 */
export const activeContainerClassName: IStackItemStyles = {
  root: {
    display: 'flex',
    height: '100%'
  }
};
/**
 * Styles for the loading spinner in the call screen.
 */
export const loadingStyle: IStackStyles = {
  root: {
    height: '100%',
    width: '100%'
  }
};
