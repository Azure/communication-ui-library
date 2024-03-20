// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getEndpoint } from '../lib/envHelper';

const router = express.Router();

/**
 * route: /getEndpointUrl/
 *
 * purpose: Get the endpoint url of Azure Communication Services resource.
 *
 * @returns The endpoint url as string
 *
 */

router.get('/', async function (req, res, next) {
  res.send(getEndpoint());
});

export default router;
