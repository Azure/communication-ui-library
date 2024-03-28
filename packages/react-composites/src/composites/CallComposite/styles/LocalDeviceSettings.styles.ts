// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IDropdownStyles, IStackStyles, IStackTokens, Theme, mergeStyles } from '@fluentui/react';

const DROPDOWN_HEIGHT_REM = 2.25;

/**
 * @private
 */
export const mainStackTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const soundStackTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const dropDownStyles = (theme: Theme): Partial<IDropdownStyles> => ({
  caretDownWrapper: {
    height: `${DROPDOWN_HEIGHT_REM}rem`,
    lineHeight: `${DROPDOWN_HEIGHT_REM}rem`
  },
  dropdownItem: {
    fontSize: '0.875rem',
    height: `${DROPDOWN_HEIGHT_REM}rem`,
    background: theme.palette.white
  },
  dropdown: {
    height: `${DROPDOWN_HEIGHT_REM}rem`,
    width: '100%',
    svg: {
      verticalAlign: 'top'
    }
  },
  title: {
    fontSize: '0.875rem',
    height: `${DROPDOWN_HEIGHT_REM}rem`,
    lineHeight: '2rem',
    borderRadius: '0.25rem',
    border: `1px solid ${theme.palette.neutralQuaternaryAlt}`
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875rem',

    // Add z-index to ensure labels are rendered above the configuration section background
    zIndex: 1
  },
  errorMessage: {
    fontSize: '0.875rem'
  }
});

/**
 * @private
 */
export const dropDownTitleIconStyles = mergeStyles({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: '0',
  maxWidth: '100%',
  overflowWrap: 'break-word',
  margin: '.063rem'
});

/**
 * @private
 */
export const optionIconStyles = mergeStyles({
  marginRight: '8px',
  verticalAlign: 'text-top'
});

/**
 * @private
 */
export const deviceSelectionContainerStyles: IStackStyles = {
  root: {
    /**
     * this is to move the device selection container above the larger border
     * container that is occluding messages
     */
    zIndex: 1
  }
};
