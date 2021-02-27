// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Provider, teamsTheme } from '@fluentui/react-northstar';

import { ParticipantManagementComponent as ParticipantManagement } from '../../components';

const importStatement = `import { ParticipantManagement } from '@azure/communication-ui';`;
const usageCode = `<ParticipantManagement
    userId={userId}
    threadMembers={threadMembers}
/>`;

const ParticipantManagementExample: () => JSX.Element = () => (
  <>
    <ParticipantManagement
      userId="1"
      threadMembers={[
        {
          userId: '1',
          displayName: 'User1'
        },
        {
          userId: '2',
          displayName: 'User2'
        },
        {
          userId: '3',
          displayName: 'User3'
        }
      ]}
      removeThreadMember={(userId: string) => {
        console.log('remove', userId);
        return Promise.resolve();
      }}
    />
  </>
);

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantManagement</Title>
      <Description>
        ParticipantManagement displays a list of participants. Optionally if removeThreadMember is provided, then an on
        click menu to remove thread member will be available.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <Provider
          theme={teamsTheme}
          style={{ display: 'flex', height: '200px', width: '100%' }}
        >
          <ParticipantManagementExample />
        </Provider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Props</Heading>
      <Props of={ParticipantManagement} />
    </>
  );
};
