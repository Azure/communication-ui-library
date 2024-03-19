// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Stack } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';

/**
 * @internal
 * Props for `_AttachmentCardGroup` component.
 */
export interface _AttachmentCardGroupProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

/**
 * Note: If we use stack tokens.childrenGap, when child elements are wrapped and moved to the next line,
 * an extra margin is added to the left of each line.
 * This is a workaround to avoid this issue.
 */

const attachmentCardGroupClassName = mergeStyles({
  flexFlow: 'row wrap',
  '& > *': {
    margin: _pxToRem(2)
  },
  /**
   * margin for children is overriden by parent stack, so adding left margin for each child
   */
  '& > *:not(:first-child)': {
    marginLeft: _pxToRem(2)
  }
});

/**
 * @internal
 * Used with `_AttachmentCard` component where `_AttachmentCard` components are passed as children.
 * Renders the children equally spaced in multiple rows.
 */
export const _AttachmentCardGroup = (props: _AttachmentCardGroupProps): JSX.Element => {
  const { children, ariaLabel } = props;
  if (!children) {
    return <></>;
  }

  return (
    <Stack horizontal className={attachmentCardGroupClassName} aria-label={ariaLabel}>
      {children}
    </Stack>
  );
};
