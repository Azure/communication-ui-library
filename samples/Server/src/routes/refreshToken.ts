import * as express from 'express';
import { refreshUserToken } from '../lib/createUserToken';

const router = express.Router();

router.post('/:id', async function (req, res, next) {
  if (!req.params['id']) {
    res.sendStatus(404);
  }

  const userToken = await refreshUserToken(req.params['id'] as string);

  res.send(userToken);
});

export default router;
