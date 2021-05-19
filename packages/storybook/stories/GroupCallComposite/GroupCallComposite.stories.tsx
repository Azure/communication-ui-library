// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { Title, Description, Heading, Source, Props } from '@storybook/addon-docs/blocks';
import { text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {
  CallComposite as GroupCallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter
} from 'react-composites';
import { v1 as createGUID } from 'uuid';

import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';

const groupCallCompositeExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;

const importStatement = `
  import { GroupCall } from 'react-composites';
  import { v1 as createGUID } from 'uuid';
  import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>GroupCall</Title>
      <Description>GroupCall is an one-stop component that you can make ACS Group Call running.</Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example Code</Heading>
      <Source code={groupCallCompositeExampleText} />

      <Heading>Props</Heading>
      <Props of={GroupCallComposite} />
    </>
  );
};

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/Group Call`,
  component: GroupCallComposite,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

const emptyConfigTips = COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'Group Call');

const createUserToken = async (connectionString: string): Promise<CommunicationUserToken> => {
  if (!connectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(connectionString);
  const userToken = await tokenClient.createUserAndToken(['voip']);

  return userToken;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const GroupCall: () => JSX.Element = () => {
  const [userId, setUserId] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const connectionString = text(COMPOSITE_STRING_CONNECTIONSTRING, '');

  useEffect(() => {
    (async () => {
      if (connectionString) {
        try {
          const tokenResponse = await createUserToken(connectionString);
          setToken(tokenResponse.token);
          setUserId(tokenResponse.user.communicationUserId);
          const groupId = createGUID();
          console.log(`groupId: ${groupId}`);
          setGroupId(groupId);
        } catch (e) {
          console.error(e);
          console.log('Ensure your connection string is valid.');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionString]);

  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    if (token && userId && groupId) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(await createAzureCommunicationCallAdapter(token, groupId, 'test name'));
      };
      createAdapter();
    }
  }, [token, userId, groupId]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {adapter && <GroupCallComposite adapter={adapter} />}
      {!connectionString && CompositeConnectionParamsErrMessage([emptyConfigTips])}
    </div>
  );
};
