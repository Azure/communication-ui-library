// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { LocalDeviceSettingsComponent as LocalDeviceSettings } from '../components';
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { object } from '@storybook/addon-knobs';
import { getDocs } from './docs/LocalSettingsDocs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/LocalDeviceSettings`,
  component: LocalDeviceSettings,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

export const LocalDeviceSettingsComponent: () => JSX.Element = () => {
  const defaultVideoDeviceList: VideoDeviceInfo[] = [
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
  const videoDeviceList = object('Camera options', defaultVideoDeviceList);

  const defaultAudioDeviceList: AudioDeviceInfo[] = [
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
  const audioDeviceList = object('Microphone options', defaultAudioDeviceList);

  return (
    <LocalDeviceSettings
      videoDeviceList={videoDeviceList}
      audioDeviceList={audioDeviceList}
      videoDeviceInfo={videoDeviceList[0]}
      audioDeviceInfo={audioDeviceList[0]}
      updateLocalVideoStream={() => console.log('updateLocalVideoStream')}
      updateAudioDeviceInfo={() => console.log('updateAudioDeviceInfo')}
    />
  );
};
