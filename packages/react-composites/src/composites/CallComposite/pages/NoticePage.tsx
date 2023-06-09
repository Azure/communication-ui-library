// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import {
  containerStyle,
  moreDetailsStyles,
  containerItemGap,
  titleStyles,
  rejoinCallButtonContainerStyles
} from '../styles/NoticePage.styles';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { StartCallButton } from '../components/StartCallButton';
import { CallCompositeIcon, CallCompositeIcons } from '../../common/icons';

/**
 * @private
 */
export interface NoticePageProps {
  iconName?: keyof CallCompositeIcons;
  title: string;
  moreDetails?: string;
  dataUiId: string;
  disableStartCallButton?: boolean;
  pageStyle?: IStyle;
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function NoticePage(props: NoticePageProps): JSX.Element {
  const adapter = useAdapter();
  return (
    <Stack
      className={mergeStyles(props.pageStyle)}
      verticalFill
      verticalAlign="center"
      horizontalAlign="center"
      data-ui-id={props.dataUiId}
      aria-atomic
    >
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        {props.iconName && <CallCompositeIcon iconName={props.iconName} />}
        <Text className={mergeStyles(titleStyles)} aria-live="assertive">
          {props.title}
        </Text>
        <Text className={mergeStyles(moreDetailsStyles)} aria-live="assertive">
          {props.moreDetails}
        </Text>
        {!props.disableStartCallButton && (
          <Stack styles={rejoinCallButtonContainerStyles}>
            <StartCallButton onClick={() => adapter.joinCall()} disabled={false} rejoinCall={true} autoFocus />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
