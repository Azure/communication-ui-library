// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RoomsClient } from '@azure/communication-rooms';
import { getResourceConnectionString } from '../lib/envHelper';

const listParticipants = async (): Promise<void> => {
  const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());
  const participantsList = await roomsClient.listParticipants('99471938974980225');
  console.log('\nRetrieved participants for room:');
  for await (const participant of participantsList) {
    // access participant data here
    console.log(participant);
  }
};

listParticipants();
