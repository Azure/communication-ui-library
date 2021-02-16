// © Microsoft Corporation. All rights reserved.
import { RemoteVideoStream } from '@azure/communication-calling';

export type GalleryParticipant = {
  displayName: string;
  videoStream?: RemoteVideoStream;
};
