// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { text } from '@storybook/addon-knobs';
import { v1 as createGUID } from 'uuid';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { getDocs } from './GroupCallCompositeDocs';
import { GroupCall as GroupCallComposite } from 'react-composites';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';
import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';

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
  const user = await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, ['voip']);

  return token;
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
      try {
        const tokenResponse = await createUserToken(connectionString);
        setToken(tokenResponse.token);
        setUserId(tokenResponse.user.communicationUserId);
        const groupId = createGUID();
        console.log(`groupId: ${groupId}`);
        setGroupId(groupId);
      } catch (e) {
        console.log('Please provide your connection string');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionString]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {connectionString && (
        <GroupCallComposite
          displayName={`user${Math.ceil(Math.random() * 1000)}`}
          userId={userId}
          groupId={groupId}
          token={token}
        />
      )}
      {!connectionString && CompositeConnectionParamsErrMessage([emptyConfigTips])}
    </div>
  );
};
