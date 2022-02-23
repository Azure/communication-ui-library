// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Theme } from '@fluentui/react';

/**
 * @private
 */
export const editBoxStyle = (inlineEditButtons: boolean): string =>
  mergeStyles({
    marginTop: '0.0875rem',
    marginBottom: '0.0875rem',
    // @TODO future refactor: This is being used to give enough space to the accept/reject edits buttons
    // This space affordance should be handled by the InputBoxComponent not the here (by the parent of the InputBoxComponent)
    paddingRight: inlineEditButtons ? '3.25rem' : '0.5rem'
  });

/**
 * @private
 */
export const editingButtonStyle = mergeStyles({
  margin: 'auto .3rem'
});

/**
 * @private
 */
export const inputBoxIcon = mergeStyles({
  margin: 'auto',
  '&:hover svg': {
    stroke: 'currentColor'
  }
});

/**
 * @private
 */
export const editBoxStyleSet = {
  root: {
    width: '100%'
  }
};

/**
 * @private
 */
export const borderAndBoxShadowStyle = (theme: Theme): IStyle => {
  const borderColor = theme.palette.blue;
  return {
    borderRadius: theme.effects.roundedCorner4,
    border: `0.125rem solid ${borderColor}`,
    width: '100%'
  };
};
