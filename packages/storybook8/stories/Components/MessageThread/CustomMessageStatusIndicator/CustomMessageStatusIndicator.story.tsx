// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import { Text } from '@fluentui/react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryChatMessages } from '../snippets/placeholdermessages';

const storyControls = {
  fontStyle: { control: 'text', name: 'Font Style' },
  fontWeight: { control: 'text', name: 'Font Weight' },
  fontColor: { control: 'text', name: 'Font Color' },
  statusContent: { control: 'text', name: 'Status Content' }
};

const CustomMessageStatusIndicatorStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryChatMessages()}
        showMessageStatus={true}
        onRenderMessageStatus={(messageStatusIndicatorProps) => {
          return messageStatusIndicatorProps.status === 'seen' ? (
            <Text style={{ fontStyle: args.fontStyle, fontWeight: args.fontWeight, color: args.fontColor }}>
              {args.statusContent}
            </Text>
          ) : null;
        }}
      />
    </FluentThemeProvider>
  );
};

export const CustomMessageStatusIndicator = CustomMessageStatusIndicatorStory.bind({});
