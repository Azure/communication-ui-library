// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDropdownStyles, IStackTokens, Theme, mergeStyles } from '@fluentui/react';

export const mainStackTokens: IStackTokens = {
  childrenGap: '1em'
};

export const micStackTokens: IStackTokens = {
  childrenGap: '1em'
};

export const dropDownStyles = (theme: Theme): Partial<IDropdownStyles> => ({
  caretDownWrapper: {
    height: '2.5em',
    lineHeight: '2.5em'
  },
  dropdownItem: {
    fontSize: '0.875em',
    height: '2.5em',
    background: theme.palette.neutralQuaternaryAlt
  },
  dropdown: {
    height: '2.5em',
    width: '100%',
    svg: {
      verticalAlign: 'top'
    }
  },
  title: {
    fontSize: '0.875em',
    height: '2.5em',
    lineHeight: '2.3125em'
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875em'
  },
  errorMessage: {
    fontSize: '0.875em'
  }
});

export const localSettingsContainer = mergeStyles({
  width: '18.75em',
  minWidth: '12.5em',
  maxHeight: '19.125em',
  marginTop: '.313em'
});

export const dropDownTitleIconStyles = mergeStyles({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: '0',
  maxWidth: '100%',
  overflowWrap: 'break-word',
  margin: '.063em'
});

export const optionIconStyles = mergeStyles({
  marginRight: '8px',
  verticalAlign: 'text-top'
});
