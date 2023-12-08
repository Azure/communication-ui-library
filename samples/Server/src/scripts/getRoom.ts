// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RoomsClient } from '@azure/communication-rooms';
import { getResourceConnectionString } from '../lib/envHelper';

const roomsClient: RoomsClient = new RoomsClient(getResourceConnectionString());
roomsClient.getRoom('99471938974980225').then((res) => console.log(res));
