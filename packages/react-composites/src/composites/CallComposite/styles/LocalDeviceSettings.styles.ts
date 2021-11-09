// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDropdownStyles, IStackTokens, Theme, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const mainStackTokens: IStackTokens = {
  childrenGap: '1rem'
};

/**
 * @private
 */
export const micStackTokens: IStackTokens = {
  childrenGap: '1rem'
};

/**
 * @private
 */
export const dropDownStyles = (theme: Theme): Partial<IDropdownStyles> => ({
  caretDownWrapper: {
    height: '2.5rem',
    lineHeight: '2.5rem'
  },
  dropdownItem: {
    fontSize: '0.875rem',
    height: '2.5rem',
    background: theme.palette.neutralQuaternaryAlt
  },
  dropdown: {
    height: '2.5rem',
    width: '100%',
    svg: {
      verticalAlign: 'top'
    }
  },
  title: {
    fontSize: '0.875rem',
    height: '2.5rem',
    lineHeight: '2.3125rem'
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875rem'
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
