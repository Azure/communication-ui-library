// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getResourceConnectionString } from '../lib/envHelper';
import { RoomsClient, CreateRoomOptions } from '@azure/communication-rooms';

const router = express.Router();

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
/**
 * route: /createRoom/
 *
 * purpose: Create a new room.
 *
 * @returns The new roomId as string
 */
router.post('/', async function (req, res, next) {
  const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());

  const validFrom = new Date();
  // We are choosing to keep a room valid for 24 hours but this may change
  const validUntil = new Date(validFrom.getTime() + TWENTY_FOUR_HOURS);

  // Options payload to create a room
  const createRoomOptions: CreateRoomOptions = {
    validFrom: validFrom,
    validUntil: validUntil
  };

  // create a room with the request payload
  const room = await roomsClient.createRoom(createRoomOptions);
  res.send(room);
});

export default router;
