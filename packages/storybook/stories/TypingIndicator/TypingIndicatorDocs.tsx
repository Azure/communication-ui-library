// © Microsoft Corporation. All rights reserved.
import { Provider, teamsTheme } from '@fluentui/react-northstar';
import { Title, Description, Props, Heading, Source, Canvas, Subheading } from '@storybook/addon-docs/blocks';
import React from 'react';
import { TypingIndicator } from '@azure/communication-ui';

const importStatement = `import { TypingIndicator } from '@azure/communication-ui';`;
const usageCode = `
const oneTypingUsers = [{ displayName: 'User1', prefixImageUrl: '' }];
const twoTypingUsers = [
  { displayName: 'User1', prefixImageUrl: '' },
  { displayName: 'User2', prefixImageUrl: '' }
];

return (
  <>
    <TypingIndicator typingUsers={oneTypingUsers} typingString={' is typing...'} />
    <TypingIndicator typingUsers={twoTypingUsers} typingString={' are typing...'} />
    <TypingIndicator typingUsers={twoTypingUsers} typingString={' and 5 others are typing...'} />
    <TypingIndicator typingUsers={[]} typingString={'10 participants are typing...'} />
  </>
);
`;

const importStatementwithACS = `import { ChatProvider, 
          ChatThreadProvider, 
          useUserId, 
          useThreadMembers, 
          useTypingUsers, 
          TypingIndicator } 
from '@azure/communication-ui';`;
const usageCodeWithACS = `
function CustomTypingIndicator() {
  const currentUserId = useUserId();
  const threadMembersList = useThreadMembers();
  const chatThreadMembers = useTypingUsers(threadMembersList);

  const typingUsers = chatThreadMembers
                      .filter((member) => member.user.communicationUserId !== currentUserId)
                      .map((member) => { return { prefixImageUrl: '', 
                                                  displayName: member.displayName ?? member.user.communicationUserId} });
  const typingString = typingUsers.length == 0 ? '' : typingUsers.length > 1 ? ' are typing...' : ' is typing...';

  return (
    <TypingIndicator typingUsers={typingUsers} typingString={typingString}/>
  );
}

<ChatProvider
  token={<TOKEN>}
  displayName={<DISPLAYNAME>}
  threadId={<THREADID>}
  endpointUrl={<URL>}
>
  <ChatThreadProvider>
    <CustomTypingIndicator/>
  </ChatThreadProvider>
</ChatProvider>
`;

const ExampleTypingIndicator: () => JSX.Element = () => {
  const oneTypingUsers = [{ userId: '1', displayName: 'User1' }];
  const twoTypingUsers = [
    { userId: '1', displayName: 'User1' },
    { userId: '2', displayName: 'User2' }
  ];

  return (
    <>
      <TypingIndicator typingUsers={oneTypingUsers} typingString={' is typing...'} />
      <TypingIndicator typingUsers={twoTypingUsers} typingString={' are typing...'} />
      <TypingIndicator typingUsers={twoTypingUsers} typingString={' and 5 others are typing...'} />
      <TypingIndicator typingUsers={[]} typingString={'10 participants are typing...'} />
    </>
  );
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>TypingIndicator</Title>
      <Description>
        Typing Indicator is used to notify users if there are any other users typing in the thread.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <Provider theme={teamsTheme}>
          <ExampleTypingIndicator />
        </Provider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Usage with ACS</Heading>
      <Subheading>Importing</Subheading>
      <Source code={importStatementwithACS} />
      <Subheading>Example</Subheading>
      <Source code={usageCodeWithACS} />
      <Heading>Props</Heading>
      <Props of={TypingIndicator} />
    </>
  );
};
