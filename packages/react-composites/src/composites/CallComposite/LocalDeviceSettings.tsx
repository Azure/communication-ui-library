// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IDropdownOption, Dropdown, Stack, useTheme } from '@fluentui/react';
import {
  dropDownStyles,
  dropDownTitleIconStyles,
  localSettingsContainer,
  mainStackTokens
} from './styles/LocalDeviceSettings.styles';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling';
import { VideoStreamOptions } from 'react-components';
import { CallVideoIcon, MicIcon, VolumeUpIcon } from '@fluentui/react-icons-northstar';

const cameraPermissionDeniedText = 'Your browser is blocking access to your camera.';
const microphonePermissionDeniedText = 'Your browser is blocking access to your microphone.';
type iconType = 'Camera' | 'Microphone' | 'Speaker';

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

const getOptionIcon = (type: iconType): JSX.Element | undefined => {
  const iconStyles = { marginRight: '8px' };

  if (type === 'Camera') {
    return <CallVideoIcon style={iconStyles} key={'videoIconKey'} />;
  } else if (type === 'Microphone') {
    return <MicIcon style={iconStyles} key={'microphoneIconKey'} />;
  } else if (type === 'Speaker') {
    return <VolumeUpIcon style={iconStyles} key={'speakerIconKey'} />;
  } else {
    return undefined;
  }
};

const onRenderTitle = (iconType: iconType, props?: IDropdownOption[]): JSX.Element => {
  const icon = props && getOptionIcon(iconType);
  return props ? (
    <div className={dropDownTitleIconStyles}>
      {icon}
      <span>{props[0].text}</span>
    </div>
  ) : (
    <></>
  );
};

const localVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

export interface LocalDeviceSettingsType {
  cameras: VideoDeviceInfo[];
  microphones: AudioDeviceInfo[];
  speakers: AudioDeviceInfo[];
  selectedCamera?: VideoDeviceInfo;
  selectedMicrophone?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
  microphonePermissionGranted: boolean;
  cameraPermissionGranted: boolean;
  onSelectCamera: (device: VideoDeviceInfo, options?: VideoStreamOptions) => Promise<void>;
  onSelectMicrophone: (device: AudioDeviceInfo) => Promise<void>;
  onSelectSpeaker: (device: AudioDeviceInfo) => Promise<void>;
}

export const LocalDeviceSettings = (props: LocalDeviceSettingsType): JSX.Element => {
  const theme = useTheme();
  const defaultPlaceHolder = 'Select an option';
  const cameraLabel = 'Camera';
  const soundLabel = 'Sound';

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
          props.onSelectCamera(props.cameras[index ?? 0], localVideoViewOption);
        }}
        onRenderTitle={(props?: IDropdownOption[]) => onRenderTitle('Camera', props)}
      />
      <Dropdown
        label={soundLabel}
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
        onRenderTitle={(props?: IDropdownOption[]) => onRenderTitle('Microphone', props)}
      />
      <Dropdown
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
        onRenderTitle={(props?: IDropdownOption[]) => onRenderTitle('Speaker', props)}
      />
    </Stack>
  );
};
