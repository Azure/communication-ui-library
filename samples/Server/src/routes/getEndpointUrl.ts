// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getEndpointUrl } from '../lib/envHelper';

const router = express.Router();

router.get('/', async function (req, res, next) {
  res.send(getEndpointUrl());
});

export default router;
