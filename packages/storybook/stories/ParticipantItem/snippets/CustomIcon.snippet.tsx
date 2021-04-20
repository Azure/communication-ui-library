import React from 'react';
import { ParticipantItem, ParticipantItemProps } from '@azure/communication-ui';
import { PersonaPresence, Icon } from '@fluentui/react';

export const CustomIconExample: () => JSX.Element = () => {
  const onRenderIcon = (props?: ParticipantItemProps): JSX.Element | null => {
    if (props?.name === 'Patrick') {
      return <Icon iconName="FavoriteStar" />;
    } else if (props?.isYou) {
      return null;
    }
    return <Icon iconName="AddFriend" />;
  };
  const containerStyle = { width: '12rem' };

  return (
    <div style={containerStyle}>
      <ParticipantItem name="Spongebob" presence={PersonaPresence.online} isYou={true} onRenderIcon={onRenderIcon} />
      <ParticipantItem name="Patrick" presence={PersonaPresence.online} onRenderIcon={onRenderIcon} />
      <ParticipantItem name="Sandy" presence={PersonaPresence.online} onRenderIcon={onRenderIcon} />
    </div>
  );
};
