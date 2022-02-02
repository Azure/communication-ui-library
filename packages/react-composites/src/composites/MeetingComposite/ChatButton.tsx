// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Chat20Filled, Chat20Regular } from '@fluentui/react-icons';
import { NotificationIcon } from './NotificationIcon';
import { IStackStyles, Stack } from '@fluentui/react';
import { ChatButtonContainerStyles } from './styles/MeetingCompositeStyles';

/**
 * @private
 */
export interface ChatButtonProps extends ControlBarButtonProps {
  chatButtonChecked: boolean | undefined;
  unreadMessageCount: number;
}
/**
 * @private
 */
export const ChatButton = (props: ChatButtonProps): JSX.Element => {
  const strings = { label: props.label, ...props.strings };
  const { unreadMessageCount } = props;

  const onRenderOnIcon = (): JSX.Element => <Chat20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;
  const onRenderOffIcon = (): JSX.Element => {
    return (
      <Stack styles={chatNotificationContainerStyles}>
        {unreadMessageCount > 0 && <NotificationIcon chatMessagesCount={unreadMessageCount} />}
        <Chat20Regular key={'chatOffIconKey'} primaryFill="currentColor" />
      </Stack>
    );
  };

  return (
    <ControlBarButton
      {...props}
      labelKey={'chatButtonLabelKey'}
      strings={strings}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
      onClick={props.onClick}
    />
  );
};

const chatNotificationContainerStyles: IStackStyles = {
  root: {
    display: 'inline',
    position: 'relative'
  }
};
