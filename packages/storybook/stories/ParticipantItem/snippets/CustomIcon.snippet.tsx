import { ParticipantItem, ParticipantItemProps } from '@azure/communication-react';
import { PersonaPresence, Icon, Stack, mergeStyles } from '@fluentui/react';
import React from 'react';

export const CustomIconExample: () => JSX.Element = () => {
  const onRenderIcon = (props?: ParticipantItemProps): JSX.Element | null => {
    if (props?.displayName === 'Patrick') {
      return <Icon iconName="FavoriteStar" style={{ cursor: 'inherit' }} />;
    } else if (props?.me) {
      return null;
    }
    return <Icon iconName="AddFriend" />;
  };

  const containerStyle = mergeStyles({ width: '15em' });

  return (
    <Stack className={containerStyle}>
      <ParticipantItem
        displayName="Spongebob"
        presence={PersonaPresence.online}
        me={true}
        onRenderIcon={onRenderIcon}
      />
      <ParticipantItem displayName="Patrick" presence={PersonaPresence.online} onRenderIcon={onRenderIcon} />
      <ParticipantItem displayName="Sandy" presence={PersonaPresence.online} onRenderIcon={onRenderIcon} />
    </Stack>
  );
};
