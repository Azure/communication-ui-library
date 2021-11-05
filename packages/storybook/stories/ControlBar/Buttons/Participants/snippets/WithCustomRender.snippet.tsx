import { CallParticipantListParticipant, FluentThemeProvider, ParticipantsButton } from '@azure/communication-react';
import { Icon, Label, Persona, PersonaSize } from '@fluentui/react';
import React from 'react';

const mockParticipants: CallParticipantListParticipant[] = [
  {
    userId: 'user1',
    displayName: 'You',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: false,
    isRemovable: true
  },
  {
    userId: 'user2',
    displayName: 'Hal Jordan',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: true,
    isRemovable: true
  },
  {
    userId: 'user3',
    displayName: 'Barry Allen',
    state: 'Idle',
    isMuted: false,
    isScreenSharing: false,
    isRemovable: true
  },
  {
    userId: 'user4',
    displayName: 'Bruce Wayne',
    state: 'Connecting',
    isMuted: false,
    isScreenSharing: false,
    isRemovable: false
  }
];

const customOnRenderAvatar = (userId?: string, options?): JSX.Element => {
  if (userId === 'user2') {
    return (
      <img
        key={`avatar${userId}`}
        src="https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"
        style={{
          borderRadius: '32px',
          width: '32px',
          position: 'relative',
          margin: 'auto',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }}
      />
    );
  }

  return <Persona text={options.displayName} hidePersonaDetails={true} size={PersonaSize.size32} />;
};

const mockCallLink = 'URL to invite new participants to the current call (https://...)';

const onMuteAll = (): void => {
  // your implementation to mute all participants
};

export const ParticipantsButtonWithCustomRenderExample: () => JSX.Element = () => {
  const customOnRenderIcon = (): JSX.Element => {
    return <Icon key={'participantsCustomIconKey'} iconName={'Group'} style={{ color: 'orange', fontSize: '20px' }} />;
  };

  const customOnRenderText = (): JSX.Element => {
    return (
      <Label key={'participantsCustomLabelKey'} style={{ color: 'darkviolet', fontStyle: 'italic' }}>
        who is on this call
      </Label>
    );
  };
  return (
    <FluentThemeProvider>
      <ParticipantsButton
        showLabel={true}
        participants={mockParticipants}
        myUserId={'user1'}
        callInvitationURL={mockCallLink}
        onMuteAll={onMuteAll}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
        onRenderAvatar={(userId?, options?) => customOnRenderAvatar(userId, options)}
      />
    </FluentThemeProvider>
  );
};
