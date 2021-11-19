import { TypingIndicator, CommunicationParticipant } from '@azure/communication-react';
import React from 'react';

export const CustomUserRenderSnippet: () => JSX.Element = () => {
  const avatarStyle = {
    borderRadius: 20,
    display: 'inline-block',
    width: '32px',
    height: '32px'
  };
  const imageMap = {
    ['1']: 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png',
    ['2']: 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-male.png'
  };

  const onRenderUser = (user: CommunicationParticipant): JSX.Element => {
    return (
      <>
        <img src={imageMap[user.userId]} style={avatarStyle} /> {user.displayName}
      </>
    );
  };

  const twoTypingUsers = [
    { userId: '1', displayName: 'Annie Lindqvist' },
    { userId: '2', displayName: 'Ted Randall' }
  ];

  return <TypingIndicator typingUsers={twoTypingUsers} onRenderUser={onRenderUser} />;
};
