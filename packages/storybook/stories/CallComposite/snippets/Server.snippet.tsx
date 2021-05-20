// Contoso server to create a new user and group.

import { CommunicationIdentityClient } from '@azure/communication-identity';
import { v1 as createGUID } from 'uuid';

export const createUserAndGroup = async (resourceConnectionString: string): Promise<any> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const user = await tokenClient.createUserAndToken(['voip']);
  return {
    token: user.token,
    endpointUrl: new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString(),
    userId: user.user.communicationUserId,
    groupId: createGUID()
  };
};
