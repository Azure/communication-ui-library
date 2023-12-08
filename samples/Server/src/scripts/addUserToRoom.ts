// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RoomParticipant, RoomsClient } from '@azure/communication-rooms';
import { getResourceConnectionString } from '../lib/envHelper';

const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());

const addParticipantsList: RoomParticipant[] = [
  {
    id: {
      kind: 'communicationUser',
      communicationUserId: '8:acs:dd9753c0-6e62-4f74-ab0f-c94f9723b4eb_0000001c-e865-75c2-e3c7-593a0d003943'
    },
    role: 'Presenter'
  }
];

roomsClient.addOrUpdateParticipants('99487698287751364', addParticipantsList).then((res) => console.log(res));
