// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
export const getToken = (
  user: CommunicationUserIdentifier,
  scopes: TokenScope[],
  options?: OperationOptions
): Promise<CommunicationAccessToken> => getIdentityClient().getToken(user, scopes);
export const createUserAndToken = (scopes: TokenScope[]): Promise<CommunicationUserToken> =>
  getIdentityClient().createUserAndToken(scopes);
