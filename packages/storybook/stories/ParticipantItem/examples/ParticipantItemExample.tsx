import React from 'react';
import { ParticipantItem } from '@azure/communication-ui';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';

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

  return <ParticipantItem name="Johnny Bravo" menuItems={menuItems} presence={PersonaPresence.online} />;
};
