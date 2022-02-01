// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Chat20Filled, Chat20Regular } from '@fluentui/react-icons';
import { NotificationIcon } from './NotificationIcon';
import { Stack } from '@fluentui/react';

/**
 * @private
 */
export interface ChatButtonProps extends ControlBarButtonProps {
  chatButtonChecked: boolean | undefined;
  unreadMessageCount?: number;
}

const onRenderOnIcon = (): JSX.Element => <Chat20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;
const onRenderOffIcon = (): JSX.Element => <Chat20Regular key={'chatOffIconKey'} primaryFill="currentColor" />;
/**
 * @private
 */
export const ChatButton = (props: ChatButtonProps): JSX.Element => {
  const strings = { label: props.label, ...props.strings };
  const { unreadMessageCount } = props;

  return (
    <Stack style={{ position: 'relative' }}>
      <ControlBarButton
        {...props}
        labelKey={'chatButtonLabelKey'}
        strings={strings}
        onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
        onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
        onClick={props.onClick}
      />
      {unreadMessageCount !== undefined && <NotificationIcon chatMessagesCount={unreadMessageCount} />}
    </Stack>
  );
};
