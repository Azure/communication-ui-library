// © Microsoft Corporation. All rights reserved.
import { Title, Description, Props, Heading, Source } from '@storybook/addon-docs/blocks';
import React from 'react';
import { GroupChat } from 'react-composites';

const importStatement = `import { GroupChat } from 'react-composites';`;
const usageCode = `import { GroupChat } from 'react-composites';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from "@azure/communication-administration";
import { ChatClient } from '@azure/communication-chat';
import ReactDOM from 'react-dom';

// Initialize an Azure Comunnication Services chat user and create a thread
// This code is for demo purpose. In production this should happen in server side
// Check [Server folder] for a complete nodejs demo server
// Please don't show your CONNECTION STRING in any public place
const connectionString = '[CONNECTION STRING]';

const uri = new URL(connectionString.replace("endpoint=", ""));
const endpointUrl = \`\${uri.protocol}//\${uri.host}\`;

(async () => {
  let tokenClient = new CommunicationIdentityClient(connectionString);
  const user = await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, ["chat"]);

  const userAccessTokenCredential =
    new AzureCommunicationUserCredential(token.token);
  const chatClient = new ChatClient(endpointUrl, userAccessTokenCredential);

  const threadId = (await chatClient.createChatThread({
    members:
      [{ user: token.user }],
    topic: 'DemoThread'
  })).threadId;

  ReactDOM.render(
    <GroupChat
      token={token.token}
      endpointUrl={endpointUrl}
      displayName={'User1'}
      threadId={threadId}
    />, document.getElementById('root'));
})();
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>GroupChat</Title>
      <Description>GroupChat is an one-stop component that you can make ACS Group Chat running.</Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example Code</Heading>
      <Source code={usageCode} />
      <Heading>Props</Heading>
      <Props of={GroupChat} />
    </>
  );
};
