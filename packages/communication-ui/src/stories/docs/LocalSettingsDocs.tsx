// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Heading, Props, Source, Canvas } from '@storybook/addon-docs/blocks';
import { LocalDeviceSettingsComponent } from '../../components';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling';

const importStatement = `
import { LocalDeviceSettingsComponent } from '@azure/communication-ui';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling';
`;

const LocalSettingsExample: () => JSX.Element = () => {
  const videoDeviceList: VideoDeviceInfo[] = [
    {
      name: 'Logitech WebCam',
      id: 'Camera1',
      cameraFacing: 'Front',
      deviceType: 'UsbCamera'
    },
    {
      name: 'OBS Virtual Camera',
      id: 'Camera2',
      cameraFacing: 'Back',
      deviceType: 'Virtual'
    },
    {
      name: 'FaceTime HD Camera',
      id: 'Camera3',
      cameraFacing: 'Front',
      deviceType: 'CaptureAdapter'
    }
  ];

  const audioDeviceList: AudioDeviceInfo[] = [
    {
      name: 'Headphones (Buy More Brand)',
      id: 'Audio1',
      isSystemDefault: true,
      deviceType: 'Microphone'
    },
    {
      name: 'Speakers (Stark Industries)',
      id: 'Audio2',
      isSystemDefault: false,
      deviceType: 'Speaker'
    },
    {
      name: 'Internal Microphone (Built-in)',
      id: 'Audio3',
      isSystemDefault: false,
      deviceType: 'Microphone'
    }
  ];

  return (
    <LocalDeviceSettingsComponent
      videoDeviceList={videoDeviceList}
      audioDeviceList={audioDeviceList}
      videoDeviceInfo={videoDeviceList[0]}
      audioDeviceInfo={audioDeviceList[0]}
      updateLocalVideoStream={() => console.log('updateLocalVideoStream')}
      updateAudioDeviceInfo={() => console.log('updateAudioDeviceInfo')}
    />
  );
};

const exampleCode = `
  const videoDeviceList: VideoDeviceInfo[] = [
    {
      name: 'Logitech WebCam',
      id: 'Camera1',
      cameraFacing: 'Front',
      deviceType: 'UsbCamera'
    },
    {
      name: 'OBS Virtual Camera',
      id: 'Camera2',
      cameraFacing: 'Back',
      deviceType: 'Virtual'
    },
    {
      name: 'FaceTime HD Camera',
      id: 'Camera3',
      cameraFacing: 'Front',
      deviceType: 'CaptureAdapter'
    }
  ];

  const audioDeviceList: AudioDeviceInfo[] = [
    {
      name: 'Headphones (Buy More Brand)',
      id: 'Audio1',
      isSystemDefault: true,
      deviceType: 'Microphone'
    },
    {
      name: 'Speakers (Stark Industries)',
      id: 'Audio2',
      isSystemDefault: false,
      deviceType: 'Speaker'
    },
    {
      name: 'Internal Microphone (Built-in)',
      id: 'Audio3',
      isSystemDefault: false,
      deviceType: 'Microphone'
    }
  ];

  return (
    <LocalDeviceSettingsComponent
      videoDeviceList={videoDeviceList}
      audioDeviceList={audioDeviceList}
      videoDeviceInfo={videoDeviceList[0]}
      audioDeviceInfo={audioDeviceList[0]}
      updateLocalVideoStream={() => console.log('updateLocalVideoStream')}
      updateAudioDeviceInfo={() => console.log('updateAudioDeviceInfo')}
    />
  );
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>LocalDeviceSettingsComponent</Title>
      <Description>The LocalDeviceSettingsComponent </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <LocalSettingsExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={LocalDeviceSettingsComponent} />
    </>
  );
};
