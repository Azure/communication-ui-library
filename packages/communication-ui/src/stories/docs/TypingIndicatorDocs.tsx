// © Microsoft Corporation. All rights reserved.
import { mergeThemes, Provider, teamsTheme } from '@fluentui/react-northstar';
import { Title, Description, Props, Heading, Source, Canvas, Subheading } from '@storybook/addon-docs/blocks';
import React from 'react';
import { TypingIndicatorComponent } from '../../components';

// @ts-ignore silence the typescript error, we can only use commonjsto make storybook use this icon correctly
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
// @ts-ignore
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
// @ts-ignore
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

const importStatement = `import { TypingIndicatorComponent } from '@azure/communication-ui';`;
const usageCode = `
const oneTypingUsers = [{ displayName: 'User1', prefixImageUrl: '' }];
const twoTypingUsers = [
  { displayName: 'User1', prefixImageUrl: '' },
  { displayName: 'User2', prefixImageUrl: '' }
];

return (
  <>
    <TypingIndicatorComponent typingUsers={oneTypingUsers} typingString={' is typing...'} />
    <TypingIndicatorComponent typingUsers={twoTypingUsers} typingString={' are typing...'} />
    <TypingIndicatorComponent typingUsers={twoTypingUsers} typingString={' and 5 others are typing...'} />
    <TypingIndicatorComponent typingUsers={[]} typingString={'10 participants are typing...'} />
  </>
);
`;

const importStatementwithACS = `import { ChatProvider, 
          ChatThreadProvider, 
          useUserId, 
          useThreadMembers, 
          useTypingUsers, 
          TypingIndicatorComponent } 
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
    <TypingIndicatorComponent typingUsers={typingUsers} typingString={typingString}/>
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

const ExampleTypingIndicators: () => JSX.Element = () => {
  const oneTypingUsers = [{ displayName: 'User1', prefixImageUrl: '' }];
  const twoTypingUsers = [
    { displayName: 'User1', prefixImageUrl: '' },
    { displayName: 'User2', prefixImageUrl: '' }
  ];

  return (
    <>
      <TypingIndicatorComponent typingUsers={oneTypingUsers} typingString={' is typing...'} />
      <TypingIndicatorComponent typingUsers={twoTypingUsers} typingString={' are typing...'} />
      <TypingIndicatorComponent typingUsers={twoTypingUsers} typingString={' and 5 others are typing...'} />
      <TypingIndicatorComponent typingUsers={[]} typingString={'10 participants are typing...'} />
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
        <Provider theme={mergeThemes(iconTheme, teamsTheme)}>
          <ExampleTypingIndicators />
        </Provider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Usage with ACS</Heading>
      <Subheading>Importing</Subheading>
      <Source code={importStatementwithACS} />
      <Subheading>Example</Subheading>
      <Source code={usageCodeWithACS} />
      <Heading>Props</Heading>
      <Props of={TypingIndicatorComponent} />
    </>
  );
};
