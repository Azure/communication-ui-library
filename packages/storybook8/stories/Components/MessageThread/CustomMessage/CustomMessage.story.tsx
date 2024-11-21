// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageProps, MessageThread, MessageRenderer, FluentThemeProvider } from '@azure/communication-react';
import { Divider } from '@fluentui/react-components';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryWithCustomMessages } from '../snippets/placeholdermessages';

const storyControls = {
  customMessageContent: { control: 'text', label: 'Custom Message Content' }
};

const CustomMessageStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    if (messageProps.message.messageType === 'custom') {
      return <Divider appearance="brand">{args.customMessageContent}</Divider>;
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithCustomMessages()} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithCustomMessage = CustomMessageStory.bind({});
