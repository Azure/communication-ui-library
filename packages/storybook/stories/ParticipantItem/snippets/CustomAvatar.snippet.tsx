import React from 'react';
import { ParticipantItem } from '@azure/react-components';
import { PersonaPresence } from '@fluentui/react';

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
  const containerStyle = { width: '12rem' };

  return (
    <div style={containerStyle}>
      <ParticipantItem name="Annie Lindqvist" presence={PersonaPresence.online} onRenderAvatar={onRenderAvatar} />
    </div>
  );
};
