// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { text } from '@storybook/addon-knobs';
// import { v1 as createGUID } from 'uuid';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-administration';
import { getDocs } from './docs/GroupCallCompositeDocs';
import { GroupCall } from '../composites';
import { COMPOSITE_FOLDER_PREFIX } from './constants';

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/GroupCall`,
  component: GroupCall,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

const emptyConfigTips = 'Please fill in Connection String to run group call widget.';

const createUserToken = async (connectionString: string): Promise<CommunicationUserToken> => {
  if (!connectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(connectionString);
  const user = await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, ['voip']);

  return token;
};

export const GroupCallComposite: () => JSX.Element = () => {
  const [userId, setUserId] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const connectionString = text('Connection String', '');

  useEffect(() => {
    (async () => {
      try {
        const tokenResponse = await createUserToken(connectionString);
        setToken(tokenResponse.token);
        setUserId(tokenResponse.user.communicationUserId);
        setGroupId('2753ec70-6aad-11eb-ac47-379f0e371aa6');
      } catch (e) {
        console.log('Please provide your connection string');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionString]);

  return (
    <div style={{ width: '100%', height: '100%', maxWidth: '50rem', maxHeight: '35rem', margin: '20px auto' }}>
      {connectionString && (
        <GroupCall
          displayName={`user${Math.ceil(Math.random() * 1000)}`}
          userId={userId}
          groupId={groupId}
          token={token}
        />
      )}
      {!connectionString && emptyConfigTips}
    </div>
  );
};
