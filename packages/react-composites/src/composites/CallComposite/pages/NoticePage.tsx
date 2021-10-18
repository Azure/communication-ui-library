// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mergeStyles, Stack, Text } from '@fluentui/react';
import { moreDetailsStyles, stackItemGap, titleStyles } from '../styles/NoticePage.styles';

/**
 * @private
 */
export interface NoticePageProps {
  title: string;
  moreDetails?: string;
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function NoticePage(props: NoticePageProps): JSX.Element {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center">
      <Stack tokens={stackItemGap}>
        <Text className={mergeStyles(titleStyles)}>{props.title}</Text>
        <Text className={mergeStyles(moreDetailsStyles)}>{props.moreDetails}</Text>
      </Stack>
    </Stack>
  );
}
