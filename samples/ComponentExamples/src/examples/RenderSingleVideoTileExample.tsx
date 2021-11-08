// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  CallClientState,
  CameraButton,
  LocalVideoStreamState,
  useCallClient,
  usePropsFor
} from '@azure/communication-react';
import { LocalVideoStream } from '@azure/communication-calling';
import { useSelector } from '@azure/communication-react';
import { StreamMedia } from '@azure/communication-react';
import { VideoTile } from '@azure/communication-react';
import { useCall } from '@azure/communication-react';
import React, { useCallback, useEffect } from 'react';

const videoTileContainerStyle = {
  height: '8rem',
  width: '12rem',
  border: 'solid 2px'
};

const localStreamSelector = (
  state: CallClientState,
  { callId }: { callId: string }
): LocalVideoStreamState | undefined => {
  // LocalStreamState is different from stream instance in onStartLocalVideo -
  // the former comes from CallClientState - which is designed for rendering
  // the latter directly comes from call instance - which is for sending request
  const localStreamState = state.calls[callId].localVideoStreams.find((item) => item.mediaStreamType === 'Video');
  return localStreamState;
};

// It is recommended that use usePropsFor(VideoGallery) + VideoGallery to render videos all together
// This example shows how to render one video stream in VideoTile
export const RenderVideoTileExample = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);

  const callClient = useCallClient();
  const call = useCall();

  // This function will start the local camera
  const onStartLocalVideo = useCallback(async () => {
    const deviceManager = await callClient.getDeviceManager();
    const cameras = await deviceManager?.getCameras();
    const videoDeviceInfo = cameras && cameras.length > 0 ? cameras[0] : undefined;

    if (!videoDeviceInfo) return;

    const stream = new LocalVideoStream(videoDeviceInfo);

    call && (await call.startVideo(stream));
  }, [call, callClient]);

  const localStreamState = useSelector(localStreamSelector, { callId: call?.id ?? '' });

  useEffect(() => {
    // Start rendering video into a html element contained in localStreamState.
    // This will trigger an update of localStreamState when element gets created
    localStreamState && callClient.createView(call?.id, undefined /*undefined for local video*/, localStreamState);
  });

  // localStreamState.view.target is the stream <video /> element to render in your component
  const mediaStreamComponent = localStreamState?.view && localStreamState.view?.target && (
    <StreamMedia videoStreamElement={localStreamState.view.target} />
  );

  return (
    <>
      <h3> Render single video stream in your own component </h3>
      <span>Click camera button to see what happens:</span>
      <CameraButton {...cameraButtonProps} />
      <div style={videoTileContainerStyle}>
        <VideoTile renderElement={mediaStreamComponent} />
      </div>
      <span>Or you can try custom logic to start local video: </span>
      <button onClick={onStartLocalVideo}> start local video </button>
    </>
  );
};
