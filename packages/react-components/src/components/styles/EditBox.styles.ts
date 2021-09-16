// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const editBoxStyle = mergeStyles({
  marginTop: '0.0875em',
  marginBottom: '0.0875em',
  paddingRight: '3.25em'
});

export const editingButtonStyle = mergeStyles({
  margin: 'auto .3em'
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
    marginLeft: '6.25em'
  }
};
