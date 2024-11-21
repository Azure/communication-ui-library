// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetAvatarUrlByUserId } from '../placeholdermessages';
import { GetHistoryChatMessages } from '../snippets/placeholdermessages';

const small = PersonaSize.size32;
const medium = PersonaSize.size48;
const large = PersonaSize.size72;
const extralarge = PersonaSize.size100;
const sizes = { small, medium, large, extralarge };

const storyControls = {
  avatarSize: {
    options: Object.keys(sizes),
    mapping: sizes,
    control: 'select',
    labels: {
      small: 'small',
      medium: 'medium',
      large: 'large',
      extralarge: 'extralarge'
    }
  },
  avatarState: { control: 'boolean', name: 'Avatar Online' }
};

const CustomAvatarStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryChatMessages()}
        onRenderAvatar={(userId?: string) => {
          return (
            <Persona
              size={args.avatarSize}
              hidePersonaDetails
              presence={args.avatarState ? PersonaPresence.online : PersonaPresence.offline}
              text={userId}
              imageUrl={GetAvatarUrlByUserId(userId ?? '')}
              showOverflowTooltip={false}
            />
          );
        }}
      />
    </FluentThemeProvider>
  );
};

export const MessageThreadCustomAvatar = CustomAvatarStory.bind({});
