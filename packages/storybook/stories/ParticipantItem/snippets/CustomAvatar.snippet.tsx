import { ParticipantItem } from '@azure/communication-react';
import { PersonaPresence } from '@fluentui/react';
import React from 'react';

export const CustomAvatarExample: () => JSX.Element = () => {
  const avatarStyle = {
    borderRadius: 20,
    display: 'block'
  };
  const onRenderAvatar = (): JSX.Element => {
    return (
      <img
        src="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png"
        width="32px"
        height="32px"
        style={avatarStyle}
      />
    );
  };

  return (
    <ParticipantItem displayName="Annie Lindqvist" presence={PersonaPresence.online} onRenderAvatar={onRenderAvatar} />
  );
};
