// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Title, Description, Heading, Source, Props } from '@storybook/addon-docs/blocks';
import React from 'react';
import { GroupCall } from 'react-composites';

const importStatement = `
import { GroupCall } from 'react-composites';
import { v1 as createGUID } from 'uuid';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
`;

const exampleCode = `
const [userId, setUserId] = useState<string>('');
const [groupId, setGroupId] = useState<string>('');
const [token, setToken] = useState<string>('');

// Initialize an Azure Comunnication Services credential and userId
// This code is for demo purpose. In production this should happen in server side
// Check [Server folder] for a complete nodejs demo server
// Please don't show your CONNECTION STRING in any public place
const connectionString = 'CONNECTION_STRING';

// Create your display name here
const displayName = 'DISPLAY_NAME'

useEffect(() => {
  (async () => {
    try {
      const tokenResponse = await createUserToken(connectionString);
      setToken(tokenResponse.token);
      setUserId(tokenResponse.user.communicationUserId);
      setGroupId(createGUID());
    } catch (e) {
      console.log('Please provide your connection string');
    }
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [connectionString]);

return (
  <GroupCall
    displayName={displayName}
    userId={userId}
    groupId={groupId}
    token={token}
  />
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>GroupCall</Title>
      <Description>GroupCall is an one-stop component that you can make ACS Group Call running.</Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example Code</Heading>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={GroupCall} />
    </>
  );
};
