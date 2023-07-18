// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const editBoxStyle = (inlineEditButtons: boolean): string => {
  const paddingRight = inlineEditButtons ? {} : { paddingRight: '0.5rem' };

  return mergeStyles({
    marginTop: '0.0875rem',
    marginBottom: '0.0875rem',
    // @TODO future refactor: This is being used to give enough space to the accept/reject edits buttons
    // This space affordance should be handled by the InputBoxComponent not the here (by the parent of the InputBoxComponent)
    ...paddingRight
  });
};

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
