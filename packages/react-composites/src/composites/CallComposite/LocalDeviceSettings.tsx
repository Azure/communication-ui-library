// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IDropdownOption, Dropdown, Stack } from '@fluentui/react';
import {
  dropDownStyles,
  dropDownTitleIconStyles,
  localSettingsContainer,
  mainStackTokens,
  optionIconStyles
} from './styles/LocalDeviceSettings.styles';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling';
import { Video20Filled, MicOn20Filled, Speaker220Filled } from '@fluentui/react-icons';
import { VideoStreamOptions, useTheme } from '@internal/react-components';

const cameraPermissionDeniedText = 'Your browser is blocking access to your camera.';
const microphonePermissionDeniedText = 'Your browser is blocking access to your microphone.';
type iconType = 'Camera' | 'Microphone' | 'Speaker';

const getDropDownList = (list: Array<VideoDeviceInfo | AudioDeviceInfo>): IDropdownOption[] => {
  // Remove duplicates
  const noDuplicates = new Map<string, VideoDeviceInfo | AudioDeviceInfo>();
  for (const item of list) {
    noDuplicates.set(item.id, item);
  }
  const dropdownList: IDropdownOption[] = [];
  for (const item of noDuplicates.values()) {
    dropdownList.push({
      key: item.id,
      text: item.name === '' ? item.deviceType : item.name
    });
  }
  return dropdownList;
};

const getOptionIcon = (type: iconType): JSX.Element | undefined => {
  if (type === 'Camera') {
    return <Video20Filled primaryFill="currentColor" className={optionIconStyles} key={'videoIconKey'} />;
  } else if (type === 'Microphone') {
    return <MicOn20Filled primaryFill="currentColor" className={optionIconStyles} key={'microphoneIconKey'} />;
  } else if (type === 'Speaker') {
    return <Speaker220Filled primaryFill="currentColor" className={optionIconStyles} key={'speakerIconKey'} />;
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
  microphonePermissionGranted: boolean | undefined;
  cameraPermissionGranted: boolean | undefined;
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
    <Stack data-ui-id="call-composite-device-settings" className={localSettingsContainer} tokens={mainStackTokens}>
      <Dropdown
        data-ui-id="call-composite-local-camera-settings"
        label={cameraLabel}
        placeholder={defaultPlaceHolder}
        options={
          props.cameraPermissionGranted ? getDropDownList(props.cameras) : [{ key: 'deniedOrUnknown', text: '' }]
        }
        styles={dropDownStyles(theme)}
        disabled={!props.cameraPermissionGranted}
        errorMessage={
          props.cameraPermissionGranted === undefined || props.cameraPermissionGranted
            ? undefined
            : cameraPermissionDeniedText
        }
        defaultSelectedKey={
          props.cameraPermissionGranted
            ? props.selectedCamera
              ? props.selectedCamera.id
              : props.cameras
              ? props.cameras[0]?.id
              : ''
            : 'deniedOrUnknown'
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
        errorMessage={
          props.microphonePermissionGranted === undefined || props.microphonePermissionGranted
            ? undefined
            : microphonePermissionDeniedText
        }
        options={
          props.microphonePermissionGranted
            ? getDropDownList(props.microphones)
            : [{ key: 'deniedOrUnknown', text: '' }]
        }
        defaultSelectedKey={
          props.microphonePermissionGranted
            ? props.selectedMicrophone
              ? props.selectedMicrophone.id
              : props.microphones
              ? props.microphones[0]?.id
              : ''
            : 'deniedOrUnknown'
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
