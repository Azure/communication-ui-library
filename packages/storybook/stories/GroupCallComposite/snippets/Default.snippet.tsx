import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import React from 'react';
import { GroupCall } from 'react-composites';
import { v1 as createGUID } from 'uuid';

const createUserToken = async (connectionString: string): Promise<CommunicationUserToken> => {
  if (!connectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(connectionString);
  const userToken = await tokenClient.createUserAndToken(['voip']);

  return userToken;
};

export const GroupCallCompositeExample: () => JSX.Element = () => {
  const [userId, setUserId] = React.useState<string>('');
  const [groupId, setGroupId] = React.useState<string>('');
  const [token, setToken] = React.useState<string>('');

  // Initialize an Azure Comunnication Services credential and userId
  // This code is for demo purpose. In production this should happen in server side
  // Check [Server folder] for a complete nodejs demo server
  // Please don't show your CONNECTION STRING in any public place
  const connectionString = 'CONNECTION_STRING';

  // Create your display name here
  const displayName = 'DISPLAY_NAME';

  React.useEffect(() => {
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

  return <GroupCall displayName={displayName} userId={userId} groupId={groupId} token={token} />;
};
