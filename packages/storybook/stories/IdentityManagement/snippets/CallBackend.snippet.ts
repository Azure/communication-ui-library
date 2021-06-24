// Logic to create an Azure Communication Services Calling user and group.
// Resides in a secure backend server. The connection string is never exposed to the client application.

import { CommunicationIdentityClient } from '@azure/communication-identity';
import { v1 as createGUID } from 'uuid';

export const createUserAndGroup = async (resourceConnectionString: string): Promise<any> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const user = await tokenClient.createUserAndToken(['voip']);
  return {
    userId: user.user.communicationUserId,
    token: user.token,
    endpointUrl: new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString(),

    // Backend server creates a group call and provides the group ID to the client application.
    // Alternatively, the client application could join an existing teams meeting.
    //
    // In this trivial example, a random ID is generated each time.
    locator: createGUID()
  };
};
