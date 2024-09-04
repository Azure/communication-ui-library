import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';
import React from 'react';
import { GetAvatarUrlByUserId, GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithCustomAvatarExample: () => JSX.Element = () => {
  // Customize the Avatar of other participants to be a Persona component from Fluent and show the presence status on the avatar.
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryChatMessages()}
        onRenderAvatar={(userId?: string) => {
          return (
            <Persona
              size={PersonaSize.size32}
              hidePersonaDetails
              presence={PersonaPresence.online}
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
