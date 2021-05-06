// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipant, RemoteVideoStream } from '@azure/communication-calling';

export type ParticipantStream = {
  user: RemoteParticipant;
  stream: RemoteVideoStream | undefined;
};
