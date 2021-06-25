import { TypingIndicator, CommunicationParticipant } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import React from 'react';

export const CustomUserRenderSnippet: () => JSX.Element = () => {
  const avatarStyle = {
    borderRadius: 20,
    display: 'block'
  };
  const imageMap = {
    ['1']: 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png',
    ['2']: 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-male.png'
  };

  const verticallyCenterStyle = mergeStyles({ display: 'flex', alignItems: 'center' });
  const spanStyle = mergeStyles({ whiteSpace: 'nowrap', paddingRight: '3px' });

  const onRenderUser = (user: CommunicationParticipant): JSX.Element => {
    return (
      <div key={`${user.displayName}UserKey`} className={verticallyCenterStyle}>
        <img src={imageMap[user.userId]} width="32px" height="32px" style={avatarStyle} />
        <span className={spanStyle}>{user.displayName}</span>
      </div>
    );
  };

  const twoTypingUsers = [
    { userId: '1', displayName: 'Annie Lindqvist' },
    { userId: '2', displayName: 'Ted Randall' }
  ];

  return <TypingIndicator typingUsers={twoTypingUsers} onRenderUser={onRenderUser} />;
};
