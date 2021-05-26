// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IDropdownOption, Dropdown, Stack } from '@fluentui/react';
import { dropDownStyles, localSettingsContainer, mainStackTokens } from './styles/LocalDeviceSettings.styles';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling';
import { useTheme } from '@fluentui/react-theme-provider';

const cameraPermissionDeniedText = 'Your browser is blocking access to your camera.';
const microphonePermissionDeniedText = 'Your browser is blocking access to your microphone.';

const getDropDownList = (list: Array<VideoDeviceInfo | AudioDeviceInfo>): IDropdownOption[] => {
  // Remove duplicates
  const noDuplicates = new Map();
  for (const item of list) {
    noDuplicates.set(item.id, item);
  }
  const dropdownList: any[] = [];
  for (const item of noDuplicates.values()) {
    dropdownList.push({
      val: item,
      key: item.id,
      text: item.name === '' ? item.deviceType : item.name
    });
  }
  return dropdownList;
};

export interface LocalDeviceSettingsType {
  cameras: VideoDeviceInfo[];
  microphones: AudioDeviceInfo[];
  speakers: AudioDeviceInfo[];
  selectedCamera?: VideoDeviceInfo;
  selectedMicrophone?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
  microphonePermissionGranted: boolean;
  cameraPermissionGranted: boolean;
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

  // TODO: speaker permission is tied to microphone permission (when you request 'audio' permission using the SDK) its
  // actually granting access to query both microphone and speaker. However the browser popup asks you explicity for
  // 'microphone'. This needs investigation on how we want to handle this and maybe needs follow up with SDK team.

  return (
    <Stack className={localSettingsContainer} tokens={mainStackTokens}>
      <Dropdown
        label={cameraLabel}
        placeholder={defaultPlaceHolder}
        options={props.cameraPermissionGranted ? getDropDownList(props.cameras) : [{ key: 'denied', text: '' }]}
        styles={dropDownStyles(theme)}
        disabled={!props.cameraPermissionGranted}
        errorMessage={props.cameraPermissionGranted ? undefined : cameraPermissionDeniedText}
        defaultSelectedKey={
          props.cameraPermissionGranted
            ? props.selectedCamera
              ? props.selectedCamera.id
              : props.cameras
              ? props.cameras[0]?.id
              : ''
            : 'denied'
        }
        onChange={(event, option, index) => {
          props.onSelectCamera(props.cameras[index ?? 0]);
        }}
      />
      <Dropdown
        label={micLabel}
        placeholder={defaultPlaceHolder}
        styles={dropDownStyles(theme)}
        disabled={!props.microphonePermissionGranted}
        errorMessage={props.microphonePermissionGranted ? undefined : microphonePermissionDeniedText}
        options={props.microphonePermissionGranted ? getDropDownList(props.microphones) : [{ key: 'denied', text: '' }]}
        defaultSelectedKey={
          props.microphonePermissionGranted
            ? props.selectedMicrophone
              ? props.selectedMicrophone.id
              : props.microphones
              ? props.microphones[0]?.id
              : ''
            : 'denied'
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
