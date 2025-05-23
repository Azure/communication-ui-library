// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread, MessageProps, MessageRenderer } from '@azure/communication-react';
import { Action } from 'adaptivecards';
import { AdaptiveCard } from 'adaptivecards-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryWithAdaptiveCardMessages } from '../snippets/placeholdermessages';

const storyControls = {
  border: { control: 'text', name: 'Border' },
  adaptiveCardTitle: { control: 'text', name: 'Adaptive Card Title' }
};

const CustomizedAdaptiveCardMessageStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const adaptiveCardMessageStyles = {
    border: args.border,
    borderRadius: '5px',
    marginRight: '20px',
    marginLeft: '40px'
  };
  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    if (messageProps.message.messageType !== 'custom') {
      return defaultOnRender ? defaultOnRender(messageProps) : <></>;
    }
    try {
      // host config setup
      const hostConfig = {
        fontFamily: 'Times New Roman'
      };

      // parse the adaptive card from the message content
      const adaptiveCard = JSON.parse(messageProps.message.content);

      return (
        <AdaptiveCard
          payload={adaptiveCard}
          hostConfig={hostConfig}
          onExecuteAction={(action: Action) => console.log('onExecuteAction ' + action)}
          onActionOpenUrl={(action: Action) => {
            console.log('onActionOpenUrl' + action);
          }}
          onActionShowCard={(action: Action) => console.log('onActionShowCard' + action)}
          onError={(error: any) => console.log('onError', error)}
          style={adaptiveCardMessageStyles}
        />
      );
    } catch (error) {
      console.log('adaptive card error', messageProps.message, error);
      // use default render in case if adaptive cards can't be parsed
      return defaultOnRender ? defaultOnRender(messageProps) : <></>;
    }
  };

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryWithAdaptiveCardMessages(args.adaptiveCardTitle)}
        onRenderMessage={onRenderMessage}
      />
    </FluentThemeProvider>
  );
};

export const CustomizedAdaptiveCardMessage = CustomizedAdaptiveCardMessageStory.bind({});
