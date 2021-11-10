// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon, mergeStyles, Stack, Text } from '@fluentui/react';
import { containerStyle, moreDetailsStyles, stackItemGap, titleStyles } from '../styles/NoticePage.styles';

/**
 * @private
 */
export interface NoticePageProps {
  iconName: string;
  title: string;
  moreDetails?: string;
  dataUiId: string;
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function NoticePage(props: NoticePageProps): JSX.Element {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" data-ui-id={props.dataUiId}>
      <Stack className={mergeStyles(containerStyle)} tokens={stackItemGap}>
        {props.iconName && <Icon iconName={props.iconName} />}
        <Text className={mergeStyles(titleStyles)}>{props.title}</Text>
        <Text className={mergeStyles(moreDetailsStyles)}>{props.moreDetails}</Text>
      </Stack>
    </Stack>
  );
}
