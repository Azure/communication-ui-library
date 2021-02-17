import * as express from 'express';
import { threadIdToModeratorTokenMap } from '../lib/chat/threadIdToModeratorTokenMap';

const router = express.Router();

router.get('/:threadId', async function (req, res, next) {
  console.log(threadIdToModeratorTokenMap);
  if (threadIdToModeratorTokenMap.has(req.params['threadId'])) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;
