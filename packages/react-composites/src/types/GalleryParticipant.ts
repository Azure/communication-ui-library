// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, RemoteVideoStream } from '@azure/communication-calling';

export type GalleryParticipant = {
  displayName: string;
  userId: string;
  videoStream?: RemoteVideoStream;
};

export type LocalGalleryParticipant = {
  displayName: string;
  userId: string;
  videoStream?: LocalVideoStream;
};
