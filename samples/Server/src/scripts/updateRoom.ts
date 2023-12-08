// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifier } from '@azure/communication-common';
import { RoomsClient } from '@azure/communication-rooms';
import { getResourceConnectionString } from '../lib/envHelper';

const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());

const removeParticipantsList: CommunicationIdentifier[] = [
  {
    communicationUserId: '8:acs:dd9753c0-6e62-4f74-ab0f-c94f9723b4eb_0000001c-e865-75c2-e3c7-593a0d003943'
  }
];

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
roomsClient
  .updateRoom('99471938974980225', {
    validFrom: new Date(),
    validUntil: new Date(new Date().getTime() + TWENTY_FOUR_HOURS)
  })
  .then((res) => console.log(res));
