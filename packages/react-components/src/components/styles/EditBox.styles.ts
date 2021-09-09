// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const editBoxStyle = mergeStyles({
  marginTop: '0.0875rem',
  marginBottom: '0.0875rem',
  paddingRight: '3.25rem'
});

export const editingButtonStyle = mergeStyles({
  margin: 'auto .3rem'
});

export const inputBoxIcon = mergeStyles({
  margin: 'auto',
  '&:hover svg': {
    stroke: 'currentColor'
  }
});

export const editBoxStyleSet = {
  root: {
    width: '100%',
    marginLeft: '6.25rem'
  }
};
