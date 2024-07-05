import { CustomAvatarOptions, ParticipantItem } from '@azure/communication-react';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';
import React from 'react';

export const CustomAvatarExample: () => JSX.Element = () => {
  const onRenderAvatar = (userId?: string, options?: CustomAvatarOptions): JSX.Element => {
    return (
      <Persona
        size={PersonaSize.size32}
        text={options?.text}
        imageUrl="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png"
        showOverflowTooltip={false}
      />
    );
  };

  return (
    <ParticipantItem displayName="Annie Lindqvist" presence={PersonaPresence.online} onRenderAvatar={onRenderAvatar} />
  );
};
