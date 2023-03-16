import {
  usePropsFor,
  VideoGallery,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  ScreenShareButton,
  EndCallButton,
  useCall
} from '@azure/communication-react';
import { PrimaryButton, Stack } from '@fluentui/react';
import { _CaptionsInfo, _CaptionsBanner } from '@internal/react-components';
import React, { useState } from 'react';
import { GenerateMockNewCaption, GenerateMockNewCaptions } from '../CaptionsBanner/mockCaptions';

export const CallingComponents = (): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);

  const [captions, setCaptions] = useState<_CaptionsInfo[]>(GenerateMockNewCaptions());

  const call = useCall();

  if (call?.state === 'Disconnected') {
    return <CallEnded />;
  }

  const addNewCaption = (): void => {
    setCaptions([...captions, GenerateMockNewCaption()]);
  };

  const extendLastCaption = (): void => {
    captions[captions.length - 1].captionText = `${captions[captions.length - 1].captionText} hello`;
    setCaptions([...captions]);
  };

  return (
    <Stack style={{ width: '100%', height: '100%', position: 'relative' }}>
      {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
      <Stack horizontalAlign="center">
        <Stack horizontalAlign="center">
          <Stack.Item style={{ width: '60%' }}>
            <_CaptionsBanner captions={captions} />
          </Stack.Item>
        </Stack>
        <Stack.Item>
          <ControlBar layout={'horizontal'}>
            <Stack horizontal verticalAlign="center">
              {cameraProps && <CameraButton {...cameraProps} />}
              {microphoneProps && <MicrophoneButton {...microphoneProps} />}
              {screenShareProps && <ScreenShareButton {...screenShareProps} />}
              {endCallProps && <EndCallButton {...endCallProps} />}
              <PrimaryButton text="Add new captions" onClick={addNewCaption} style={{ margin: '10px' }} />
              <PrimaryButton text="Extend last caption" onClick={extendLastCaption} style={{ margin: '10px' }} />
            </Stack>
          </ControlBar>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

function CallEnded(): JSX.Element {
  return <h1>You ended the call.</h1>;
}

export default CallingComponents;
