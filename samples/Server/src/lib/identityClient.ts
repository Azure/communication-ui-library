// © Microsoft Corporation. All rights reserved.

import {
  CommunicationAccessToken,
  CommunicationIdentityClient,
  CommunicationUserToken,
  TokenScope
} from '@azure/communication-identity';
import { CommunicationUser } from '@azure/communication-common';
import { getResourceConnectionString } from './envHelper';

const identityClient = new CommunicationIdentityClient(getResourceConnectionString());

// replicate here to allow for mocks in tests
export const createUser = (): Promise<CommunicationUser> => identityClient.createUser();
export const issueToken = (user: CommunicationUser, scopes: TokenScope[]): Promise<CommunicationAccessToken> =>
  identityClient.issueToken(user, scopes);
export const createUserWithToken = (scopes: TokenScope[]): Promise<CommunicationUserToken> =>
  identityClient.createUserWithToken(scopes);
