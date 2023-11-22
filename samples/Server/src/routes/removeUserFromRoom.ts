// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifier } from '@azure/communication-common';
import { RoomsClient } from '@azure/communication-rooms';
import * as express from 'express';
import { getResourceConnectionString } from '../lib/envHelper';

const router = express.Router();
interface RemoveUserFromRoomParam {
  userId: string;
  roomId: string;
}

/**
 * route: /removeUserFromRoom
 *
 * purpose: Remove the user from room with given roomId and role.
 *
 * @param userId: id of the user to remove
 * @param roomId: roomId of room from which to remove user
 */

router.post('/', async function (req, res, next) {
  // create RoomsClient
  const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());

  const removeUserFromRoomParam: RemoveUserFromRoomParam = req.body;

  // request payload to add participants
  const addParticipantsList: CommunicationIdentifier[] = [{ communicationUserId: removeUserFromRoomParam.userId }];

  res.send(await roomsClient.removeParticipants(removeUserFromRoomParam.roomId, addParticipantsList));
});

export default router;
