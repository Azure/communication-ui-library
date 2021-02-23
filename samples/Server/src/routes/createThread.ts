// © Microsoft Corporation. All rights reserved.

import * as express from 'express';
import { createThread } from '../lib/chat/moderator';

const router = express.Router();

router.post('/', async function (req, res, next) {
  res.send(await createThread());
});

export default router;
