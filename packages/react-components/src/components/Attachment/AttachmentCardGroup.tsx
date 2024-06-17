// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Stack } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
import { _ATTACHMENT_CARD_MARGIN_IN_PX, _ATTACHMENT_CARD_WIDTH_IN_REM } from '../styles/AttachmentCard.styles';
import {
  attachmentCardBaseStyles,
  attachmentCardFlexLayout,
  attachmentCardGirdLayout,
  attachmentGroupDisabled
} from '../styles/AttachmentCardGroup.styles';

/**
 * @internal
 * Props for `_AttachmentCardGroup` component.
 */
export enum _AttachmentCardGroupLayout {
  /**
   * Children are rendered in a grid layout with self resizing.
   */
  Grid = 'grid',
  /**
   * Children are rendered in a flex layout with no resizing.
   */
  Flex = 'flex'
}

/**
 * @internal
 * Props for `_AttachmentCardGroup` component.
 */
export interface _AttachmentCardGroupProps {
  children: React.ReactNode;
  ariaLabel?: string;
  attachmentGroupLayout?: _AttachmentCardGroupLayout;
  disabled?: boolean;
}

/**
 * @internal
 * Used with `_AttachmentCard` component where `_AttachmentCard` components are passed as children.
 * Renders the children equally spaced in multiple rows.
 */
export const _AttachmentCardGroup = (props: _AttachmentCardGroupProps): JSX.Element => {
  const { children, ariaLabel, attachmentGroupLayout, disabled } = props;
  if (!children) {
    return <></>;
  }
  return (
    <Stack
      horizontal
      className={mergeStyles(
        disabled && attachmentGroupDisabled,
        attachmentCardBaseStyles,
        attachmentGroupLayout === _AttachmentCardGroupLayout.Grid ? attachmentCardGirdLayout : attachmentCardFlexLayout
      )}
      aria-label={ariaLabel}
      role="list"
    >
      {children}
    </Stack>
  );
};
