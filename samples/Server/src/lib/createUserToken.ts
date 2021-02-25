// © Microsoft Corporation. All rights reserved.

import { CommunicationIdentityClient, CommunicationUserToken, TokenScope } from '@azure/communication-administration';
import { getResourceConnectionString } from './envHelper';

export interface UserToken {
  identity: string;
  token: string;
  expiresOn: Date;
}

const getTokenClient = (): CommunicationIdentityClient =>
  new CommunicationIdentityClient(getResourceConnectionString());

export const createUserTokenWithScope = async (
  tokenScopes: TokenScope[],
  userId?: string
): Promise<CommunicationUserToken> => {
  const tokenClient = getTokenClient();

  const user = userId ? { communicationUserId: userId } : await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, tokenScopes);

  return token;
};

export const createUserToken = (): Promise<CommunicationUserToken> => createUserTokenWithScope(['chat', 'voip']);

export const refreshUserToken = (userId: string): Promise<CommunicationUserToken> =>
  createUserTokenWithScope(['chat', 'voip'], userId);
