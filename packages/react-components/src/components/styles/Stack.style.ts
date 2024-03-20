// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles } from '@fluentui/react-components';

// These are styles that should be used during the migration from FluentUI v8 Stack component to flex.
// https://react.fluentui.dev/?path=/docs/concepts-migration-from-v8-components-flex-stack--page

/**
 * @private
 */
export const useDefaultStackStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: 'auto',
    height: 'auto',
    boxSizing: 'border-box',
    '> *': {
      textOverflow: 'ellipsis'
    }
    // As per CSS props, these two styles are not in the original Stack styles
    // (and they have higher specificity that just classes and will be applied instead of rules in classes).
    // They also break a layout for the first selected item in MentionPopover if applied.
    // Please check that component, if you want to apply these styles
    // '> :not(:first-child)': {
    //   marginTop: '0px'
    // },
    // '> *:not(.ms-StackItem)': {
    //   flexShrink: 1
    // }
  }
});
