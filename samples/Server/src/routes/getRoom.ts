// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RoomsClient } from '@azure/communication-rooms';
import * as express from 'express';
import { getResourceConnectionString } from '../lib/envHelper';

const router = express.Router();
interface GetRoomParam {
  roomId: string;
}

/**
 * route: /getRoom
 *
 * purpose: Get info of room
 *
 * @param roomId: roomId of room to get info
 */

router.post('/', async function (req, res, next) {
  // create RoomsClient
  const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());

  const getRoomParam: GetRoomParam = req.body;

  res.send(await roomsClient.getRoom(getRoomParam.roomId));
});

export default router;
