import React from 'react';
import { TypingIndicator, WebUiChatParticipant } from '@azure/communication-ui';

export const TypingIndicatorSnippet: () => JSX.Element = () => {
  const oneTypingUsers = [{ userId: '1', displayName: 'User1' }];
  const twoTypingUsers = [
    { userId: '1', displayName: 'User1' },
    { userId: '2', displayName: 'User2' }
  ];
  const twentyUsers: WebUiChatParticipant[] = Array(20)
    .fill(1, 20)
    .map((x, i) => ({ userId: `${i}`, displayName: `User${i}` }));

  return (
    <>
      <TypingIndicator typingUsers={oneTypingUsers} />
      <TypingIndicator typingUsers={twoTypingUsers} />
      <TypingIndicator typingUsers={twentyUsers} />
      <TypingIndicator typingUsers={oneTypingUsers} typingString={' is composing a message...'} />
    </>
  );
};
