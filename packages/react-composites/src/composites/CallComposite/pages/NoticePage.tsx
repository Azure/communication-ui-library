// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mergeStyles, Stack } from '@fluentui/react';
import { moreDetailsStyles, stackItemGap, titleStyles } from '../styles/NoticePage.styles';

/**
 * @private
 */
export interface NoticePagePageProps {
  title: string;
  moreDetails?: string;
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function NoticePage(props: NoticePagePageProps): JSX.Element {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center">
      <Stack tokens={stackItemGap}>
        <Stack.Item className={mergeStyles(titleStyles)}>{props.title}</Stack.Item>
        <Stack.Item className={mergeStyles(moreDetailsStyles)}>{props.moreDetails}</Stack.Item>
      </Stack>
    </Stack>
  );
}
