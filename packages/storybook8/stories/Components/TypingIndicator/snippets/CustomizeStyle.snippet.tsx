import { TypingIndicator } from '@azure/communication-react';
import React from 'react';

export const CustomStylingExample: () => JSX.Element = () => {
  const twoTypingUsers = [
    { userId: '1', displayName: 'User1' },
    { userId: '2', displayName: 'User2' }
  ];

  const styles = {
    root: { border: '1px solid darkblue', width: '400px', padding: '5px' },
    typingUserDisplayName: { font: '15px Tahoma , sans-serif;' },
    typingString: { color: 'slategrey' }
  };

  return <TypingIndicator typingUsers={twoTypingUsers} styles={styles} />;
};
