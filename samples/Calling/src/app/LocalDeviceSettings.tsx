// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { IDropdownOption, Dropdown, Stack } from '@fluentui/react';
import { dropDownStyles, localSettingsContainer, mainStackTokens } from './styles/LocalDeviceSettings.styles';
import { VideoDeviceInfo, AudioDeviceInfo, DeviceAccess } from '@azure/communication-calling';
import { useTheme } from '@fluentui/react-theme-provider';

const getDropDownList = (list: Array<VideoDeviceInfo | AudioDeviceInfo>): IDropdownOption[] => {
  return list.map((item) => ({
    val: item,
    key: item.id,
    text: item.name === '' ? item.deviceType : item.name
  }));
};

export interface LocalDeviceSettingsType {
  cameras: VideoDeviceInfo[];
  microphones: AudioDeviceInfo[];
  speakers: AudioDeviceInfo[];
  selectedCamera?: VideoDeviceInfo;
  selectedMicrophone?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
  deviceAccess?: DeviceAccess;
  onSelectCamera: (device: VideoDeviceInfo) => Promise<void>;
  onSelectMicrophone: (device: AudioDeviceInfo) => Promise<void>;
  onSelectSpeaker: (device: AudioDeviceInfo) => Promise<void>;
}

export const LocalDeviceSettings = (props: LocalDeviceSettingsType): JSX.Element => {
  const theme = useTheme();
  const defaultPlaceHolder = 'Select an option';
  const cameraLabel = 'Camera';
  const micLabel = 'Microphone';
  const speakerLabel = 'Speaker';

  const cameraPermissionGranted = useMemo(() => {
    if (!props.deviceAccess || !props.deviceAccess.video) {
      return false;
    }

    return true;
  }, [props.deviceAccess]);

  const microphonePermissionGranted = useMemo(() => {
    if (!props.deviceAccess || !props.deviceAccess.audio) {
      return false;
    }

    return true;
  }, [props.deviceAccess]);

  return (
    <Stack className={localSettingsContainer} tokens={mainStackTokens}>
      <Dropdown
        label={cameraLabel}
        placeholder={defaultPlaceHolder}
        options={getDropDownList(props.cameras)}
        styles={dropDownStyles(theme)}
        disabled={!cameraPermissionGranted}
        defaultSelectedKey={props.selectedCamera ? props.selectedCamera.id : props.cameras ? props.cameras[0]?.id : ''}
        onChange={(event, option, index) => {
          props.onSelectCamera(props.cameras[index ?? 0]);
        }}
      />
      <Dropdown
        label={micLabel}
        placeholder={defaultPlaceHolder}
        styles={dropDownStyles(theme)}
        disabled={!microphonePermissionGranted}
        options={getDropDownList(props.microphones)}
        defaultSelectedKey={
          props.selectedMicrophone ? props.selectedMicrophone.id : props.microphones ? props.microphones[0]?.id : ''
        }
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption | undefined,
          index?: number | undefined
        ) => {
          props.onSelectMicrophone(props.microphones[index ?? 0]);
        }}
      />
      <Dropdown
        label={speakerLabel}
        placeholder={defaultPlaceHolder}
        styles={dropDownStyles(theme)}
        disabled={props.speakers.length === 0}
        options={getDropDownList(props.speakers)}
        defaultSelectedKey={
          props.selectedSpeaker ? props.selectedSpeaker.id : props.speakers ? props.speakers[0]?.id : ''
        }
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption | undefined,
          index?: number | undefined
        ) => {
          props.onSelectSpeaker(props.speakers[index ?? 0]);
        }}
      />
    </Stack>
  );
};
