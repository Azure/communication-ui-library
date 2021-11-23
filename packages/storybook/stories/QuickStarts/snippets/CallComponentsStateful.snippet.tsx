import {
  usePropsFor,
  VideoGallery,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  ScreenShareButton,
  EndCallButton
} from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

function CallingComponents(): JSX.Element {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);

  return (
    <Stack className={mergeStyles({ height: '100%' })}>
      <div style={{ width: '100vw', height: '100vh' }}>
        {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
      </div>

      <ControlBar layout="floatingBottom">
        {cameraProps && <CameraButton {...cameraProps} />}
        {microphoneProps && <MicrophoneButton {...microphoneProps} />}
        {screenShareProps && <ScreenShareButton {...screenShareProps} />}
        {endCallProps && <EndCallButton {...endCallProps} />}
      </ControlBar>
    </Stack>
  );
}

export default CallingComponents;
