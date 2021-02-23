// © Microsoft Corporation. All rights reserved.

import { CommunicationUserToken, TokenScope } from '@azure/communication-administration';
import * as express from 'express';
import { createUserToken, createUserTokenWithScope } from '../lib/createUserToken';

const router = express.Router();

/**
 * handleUserTokenRequest will return a default scoped token if no scopes are provided.
 * @param requestedScope [optional] string from the request, this should be a comma seperated list of scopes.
 */
const handleUserTokenRequest = async (requestedScope?: string): Promise<CommunicationUserToken> =>
  requestedScope ? await createUserTokenWithScope(requestedScope.split(',') as TokenScope[]) : await createUserToken();

/**
 * By default the get and post routes will return a token with scopes ['chat', 'voip'].
 * Optionally ?scope can be passed in containing scopes seperated by comma
 * e.g. ?scope=chat,voip
 */
router.get('/', async (req, res, next) => res.send(await handleUserTokenRequest((req.query.scope as string) ?? '')));
router.post('/', async (req, res, next) => res.send(await handleUserTokenRequest((req.body.scope as string) ?? '')));

export default router;
