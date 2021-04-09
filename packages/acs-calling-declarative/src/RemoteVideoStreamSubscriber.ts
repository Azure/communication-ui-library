// © Microsoft Corporation. All rights reserved.

import { RemoteVideoStream } from '@azure/communication-calling';

/**
 * Subscribes to the isAvailableChanged event of the RemoteVideoStream. Because we dont' have a good way to distinguish
 * different remote video streams in context, we call the parent participant's videoStreamsUpdated function which will
 * recreate the remote video streams state from scratch. TODO: do we want to be more selective on adding/removing
 * streams?
 */
export class RemoteVideoStreamSubscriber {
  private _remoteVideoStream: RemoteVideoStream;
  private _videoStreamsUpdated: () => void;

  constructor(remoteVideoStream: RemoteVideoStream, videoStreamsUpdated: () => void) {
    this._remoteVideoStream = remoteVideoStream;
    this._videoStreamsUpdated = videoStreamsUpdated;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._remoteVideoStream.on('isAvailableChanged', this._videoStreamsUpdated);
  };

  public unsubscribe = (): void => {
    this._remoteVideoStream.off('isAvailableChanged', this._videoStreamsUpdated);
  };
}
