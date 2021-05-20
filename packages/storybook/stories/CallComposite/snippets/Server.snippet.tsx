// Contoso server to create a new user and group.

import { CommunicationIdentityClient } from '@azure/communication-identity';
import { v1 as createGUID } from 'uuid';

export type Prerequisites = {
  endpointUrl: string;
  token: string;
  userId: string;
  groupId: string;
  displayName: string;
};

export const createUserAndGroup = async (
  resourceConnectionString: string,
  displayName: string
): Promise<Prerequisites> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const user = await tokenClient.createUserAndToken(['voip']);
  return {
    token: user.token,
    endpointUrl: new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString(),
    userId: user.user.communicationUserId,
    groupId: createGUID(),
    // Contoso would map the userID to the display name from their own data model.
    displayName: displayName
  };
};
