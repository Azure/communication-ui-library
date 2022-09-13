// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Dropdown, PrimaryButton, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { AudioVisualization } from '../Components/AudioVisualization';

/** private */
export const AudioTestScreen = (props: { onNextClick?: () => void }): JSX.Element => {
  const [stream, setStream] = React.useState<MediaStream>();
  useEffect(() => {
    (async () => {
      const audioMediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      setStream(audioMediaStream);
    })();
  }, []);

  const [audioVolumeLevel, setAudioVolumeLevel] = React.useState<number>();
  useEffect(() => {
    let scriptProcessor: ScriptProcessorNode | undefined;
    if (stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = function () {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;
        setAudioVolumeLevel(average);
      };
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor.onaudioprocess = null;
      }
    };
  }, [stream]);

  const mics = [
    { key: 'mic', text: 'Logitech 4000 Mock Microphone' },
    { key: 'mic2', text: 'Lenovo 6000 Mock Microphone' }
  ];

  const speakers = [
    { key: 'speaker', text: 'Logitech 4000 Mock Speaker' },
    { key: 'speaker2', text: 'Lenovo 6000 Mock Speaker' }
  ];

  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
      <Stack tokens={{ childrenGap: '1rem' }}>
        <Stack.Item>
          <Dropdown label="Speaker" selectedKey={speakers[0]?.key} options={speakers} />
        </Stack.Item>
        <Stack.Item>
          <Dropdown label="Microphone" selectedKey={mics[0]?.key} options={mics} />
        </Stack.Item>
        <Stack.Item>
          <AudioVisualization volumePct={audioVolumeLevel} />
        </Stack.Item>
        <Stack.Item>
          <Stack grow horizontalAlign="stretch" horizontal tokens={{ childrenGap: '1rem' }}>
            <Stack.Item>
              <DefaultButton>Record</DefaultButton>
            </Stack.Item>
            <Stack.Item>
              <DefaultButton disabled>Play Back</DefaultButton>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      <PrimaryButton onClick={props.onNextClick}>Onwards</PrimaryButton>
    </Stack>
  );
};
