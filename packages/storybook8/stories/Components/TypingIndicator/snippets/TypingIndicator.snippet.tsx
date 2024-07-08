import { TypingIndicator, CommunicationParticipant } from '@azure/communication-react';
import React from 'react';

export const TypingIndicatorExample: () => JSX.Element = () => {
  const oneTypingUsers = [{ userId: '1', displayName: 'User1' }];
  const twoTypingUsers = [
    { userId: '1', displayName: 'User1' },
    { userId: '2', displayName: 'User2' }
  ];

  const twentyUsers: CommunicationParticipant[] = [];
  for (let idx = 0; idx < 20; idx++) {
    twentyUsers.push({ userId: `${idx}`, displayName: `User${idx}` });
  }

  return (
    <>
      <TypingIndicator typingUsers={oneTypingUsers} />
      <TypingIndicator typingUsers={twoTypingUsers} />
      <TypingIndicator typingUsers={twentyUsers} />
      <TypingIndicator typingUsers={oneTypingUsers} />
    </>
  );
};
