// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { makeStyles, shorthands } from '@fluentui/react-components';

/**
 * Styles for the {@link SendBox}.
 *
 * @returns className for ExampleComponent.
 *
 * @private
 */
export const use_SendBoxStyles = makeStyles({
  root: {
    ...shorthands.overflow('visible'),
    ...shorthands.margin('0.25rem'),
    ...shorthands.overflow('hidden'),
    /**
     * margin-top set for all the child components of SendBox except first
     */
    ':not(:first-child)': {
      marginTop: '0.25rem'
    },
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: 'auto',
    height: 'auto',
    boxSizing: 'border-box',
    '> *': {
      textOverflow: 'ellipsis'
    },
    '> :not(:first-child)': {
      marginTop: '0px'
    },
    '> *:not(.ms-StackItem)': {
      flexShrink: 1
    }
  },
  input: {

  }
});
