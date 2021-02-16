// © Microsoft Corporation. All rights reserved.

import { RemoteParticipant, RemoteVideoStream } from '@azure/communication-calling';

export type ParticipantStream = {
  user: RemoteParticipant;
  stream: RemoteVideoStream | undefined;
};
