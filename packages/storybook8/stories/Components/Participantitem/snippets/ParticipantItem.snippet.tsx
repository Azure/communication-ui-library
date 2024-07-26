import { ParticipantItem } from '@azure/communication-react';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';
import React from 'react';

export const ParticipantItemExample: () => JSX.Element = () => {
  const menuItems: IContextualMenuItem[] = [
    {
      key: 'Mute',
      text: 'Mute',
      onClick: () => alert('Mute')
    },
    {
      key: 'Remove',
      text: 'Remove',
      onClick: () => alert('Remove')
    }
  ];

  return <ParticipantItem displayName="Johnny Bravo" menuItems={menuItems} presence={PersonaPresence.online} />;
};
