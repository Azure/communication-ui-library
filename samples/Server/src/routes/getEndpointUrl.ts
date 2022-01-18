// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getEndpoint } from '../lib/envHelper';

const router = express.Router();

router.get('/', async function (req, res, next) {
  res.send(getEndpoint());
});

export default router;
