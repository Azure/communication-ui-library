// © Microsoft Corporation. All rights reserved.

import {
  CommunicationAccessToken,
  CommunicationIdentityClient,
  CommunicationUserToken,
  TokenScope
} from '@azure/communication-identity';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { OperationOptions } from '@azure/core-http';
import { getResourceConnectionString } from './envHelper';

// lazy init to allow mocks in test
let identityClient: CommunicationIdentityClient | undefined = undefined;
const getIdentityClient = (): CommunicationIdentityClient =>
  identityClient ?? (identityClient = new CommunicationIdentityClient(getResourceConnectionString()));

// replicate here to allow for mocks in tests
export const createUser = (): Promise<CommunicationUserIdentifier> => getIdentityClient().createUser();
// TODO: Rename to getToken
export const issueToken = (
  user: CommunicationUserIdentifier,
  scopes: TokenScope[],
  options?: OperationOptions
): Promise<CommunicationAccessToken> => getIdentityClient().getToken(user, scopes);
// TODO: Rename to getToken
export const createUserWithToken = (scopes: TokenScope[]): Promise<CommunicationUserToken> =>
  getIdentityClient().createUserAndToken(scopes);
