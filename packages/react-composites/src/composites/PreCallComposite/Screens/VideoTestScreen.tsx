// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Dropdown, PrimaryButton, Stack } from '@fluentui/react';
import React, { useEffect, useRef } from 'react';

/** private */
export const VideoTestScreen = (props: { onNextClick?: () => void }): JSX.Element => {
  const [stream, setStream] = React.useState<MediaStream>();
  useEffect(() => {
    (async () => {
      const videoMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(videoMediaStream);
    })();
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef, stream]);

  useEffect(() => {
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
      <Stack>
        <Stack tokens={{ childrenGap: '1rem' }}>
          <Stack.Item align="center">
            <video autoPlay ref={videoRef} width="600" height="200" />
          </Stack.Item>
          <Stack.Item>
            <Dropdown
              label="Camera"
              selectedKey={'camera'}
              options={[
                { key: 'camera', text: 'Logitech 4000 Mock WebCam' },
                { key: 'camera2', text: 'Lenovo 6000 Mock WebCam' }
              ]}
            />
          </Stack.Item>
        </Stack>
      </Stack>
      <PrimaryButton onClick={props.onNextClick}>Onwards</PrimaryButton>
    </Stack>
  );
};
