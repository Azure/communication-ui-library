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
  const containerStyle = { width: '12rem' };

  return (
    <div style={containerStyle}>
      <ParticipantItem name="Johnny Bravo" menuItems={menuItems} presence={PersonaPresence.online} />
    </div>
  );
};
