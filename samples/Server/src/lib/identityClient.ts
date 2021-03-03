// © Microsoft Corporation. All rights reserved.

import {
  CommunicationAccessToken,
  CommunicationIdentityClient,
  CommunicationUserToken,
  TokenScope
} from '@azure/communication-identity';
import { CommunicationUser } from '@azure/communication-common';
import { getResourceConnectionString } from './envHelper';

// lazy init to allow mocks in test
let identityClient: CommunicationIdentityClient | undefined = undefined;
const getIdentityClient = (): CommunicationIdentityClient =>
  identityClient ?? (identityClient = new CommunicationIdentityClient(getResourceConnectionString()));

// replicate here to allow for mocks in tests
export const createUser = (): Promise<CommunicationUser> => getIdentityClient().createUser();
export const issueToken = (user: CommunicationUser, scopes: TokenScope[]): Promise<CommunicationAccessToken> =>
  getIdentityClient().issueToken(user, scopes);
export const createUserWithToken = (scopes: TokenScope[]): Promise<CommunicationUserToken> =>
  getIdentityClient().createUserWithToken(scopes);
