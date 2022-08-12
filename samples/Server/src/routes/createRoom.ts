// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getResourceConnectionString } from '../lib/envHelper';
import { RoomsClient, CreateRoomOptions } from '@azure/communication-rooms';
import { createUser } from '../lib/identityClient';

const router = express.Router();

/**
 * route: /createRoom/
 *
 * purpose: Create a new room.
 *
 * @returns The new roomId as string
 */

router.post('/', async function (req, res, next) {
  // create RoomsClient
  const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());

  const validFrom = new Date();
  const validUntil = new Date(validFrom.getTime() + 5 * 60 * 1000);

  const user = await createUser();

  // Options payload to create a room
  const createRoomOptions: CreateRoomOptions = {
    validFrom: validFrom,
    validUntil: validUntil,
    participants: [
      {
        id: user,
        role: 'Attendee'
      }
    ]
  };

  // create a room with the request payload
  const createRoom = await roomsClient.createRoom(createRoomOptions);
  res.send(createRoom);
});

export default router;
