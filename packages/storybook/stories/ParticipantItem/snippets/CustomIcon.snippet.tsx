import { ParticipantItem, ParticipantItemProps } from '@azure/communication-react';
import { PersonaPresence, Icon, Stack } from '@fluentui/react';
import React from 'react';

export const CustomIconExample: () => JSX.Element = () => {
  const onRenderIcon = (props?: ParticipantItemProps): JSX.Element | null => {
    if (props?.name === 'Patrick') {
      return <Icon iconName="FavoriteStar" />;
    } else if (props?.me) {
      return null;
    }
    return <Icon iconName="AddFriend" />;
  };

  return (
    <Stack>
      <ParticipantItem name="Spongebob" presence={PersonaPresence.online} me={true} onRenderIcon={onRenderIcon} />
      <ParticipantItem name="Patrick" presence={PersonaPresence.online} onRenderIcon={onRenderIcon} />
      <ParticipantItem name="Sandy" presence={PersonaPresence.online} onRenderIcon={onRenderIcon} />
    </Stack>
  );
};
