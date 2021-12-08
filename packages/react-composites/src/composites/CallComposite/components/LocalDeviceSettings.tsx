// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { Dropdown, Icon, IDropdownOption, Label, mergeStyles, Stack } from '@fluentui/react';
import { useTheme, VideoStreamOptions } from '@internal/react-components';
import React from 'react';
import { useLocale } from '../../localization';
import {
  dropDownStyles,
  dropDownTitleIconStyles,
  mainStackTokens,
  optionIconStyles
} from '../styles/LocalDeviceSettings.styles';

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
    return <Icon iconName="LocalDeviceSettingsCamera" className={optionIconStyles} />;
  } else if (type === 'Microphone') {
    return <Icon iconName="LocalDeviceSettingsMic" className={optionIconStyles} />;
  } else if (type === 'Speaker') {
    return <Icon iconName="LocalDeviceSettingsSpeaker" className={optionIconStyles} />;
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

const localVideoViewOptions = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

/**
 * @private
 */
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

/**
 * @private
 */
export const LocalDeviceSettings = (props: LocalDeviceSettingsType): JSX.Element => {
  const theme = useTheme();
  const locale = useLocale();
  const defaultPlaceHolder = locale.strings.call.defaultPlaceHolder;
  const cameraLabel = locale.strings.call.cameraLabel;
  const soundLabel = locale.strings.call.soundLabel;

  // TODO: speaker permission is tied to microphone permission (when you request 'audio' permission using the SDK) its
  // actually granting access to query both microphone and speaker. However the browser popup asks you explicity for
  // 'microphone'. This needs investigation on how we want to handle this and maybe needs follow up with SDK team.

  return (
    <Stack data-ui-id="call-composite-device-settings" tokens={mainStackTokens}>
      <Stack>
        <Label
          id={'call-composite-local-camera-settings-label'}
          className={mergeStyles(dropDownStyles(theme).label)}
          disabled={!props.cameraPermissionGranted} // follows dropdown disabled state
        >
          {cameraLabel}
        </Label>
        <Dropdown
          data-ui-id="call-composite-local-camera-settings"
          aria-labelledby={'call-composite-local-camera-settings-label'}
          placeholder={defaultPlaceHolder}
          options={
            props.cameraPermissionGranted ? getDropDownList(props.cameras) : [{ key: 'deniedOrUnknown', text: '' }]
          }
          styles={dropDownStyles(theme)}
          disabled={!props.cameraPermissionGranted}
          errorMessage={
            props.cameraPermissionGranted === undefined || props.cameraPermissionGranted
              ? undefined
              : locale.strings.call.cameraPermissionDenied
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
            props.onSelectCamera(props.cameras[index ?? 0], localVideoViewOptions);
          }}
          onRenderTitle={(props?: IDropdownOption[]) => onRenderTitle('Camera', props)}
        />
      </Stack>
      <Stack>
        <Label
          id={'call-composite-local-sound-settings-label'}
          className={mergeStyles(dropDownStyles(theme).label)}
          disabled={!props.microphonePermissionGranted} // follows Start button disabled state in ConfigurationPage
        >
          {soundLabel}
        </Label>
        <Stack data-ui-id="call-composite-sound-settings" tokens={mainStackTokens}>
          <Dropdown
            aria-labelledby={'call-composite-local-sound-settings-label'}
            placeholder={defaultPlaceHolder}
            styles={dropDownStyles(theme)}
            disabled={!props.microphonePermissionGranted}
            errorMessage={
              props.microphonePermissionGranted === undefined || props.microphonePermissionGranted
                ? undefined
                : locale.strings.call.microphonePermissionDenied
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
                  : defaultDeviceId(props.microphones)
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
            aria-labelledby={'call-composite-local-sound-settings-label'}
            placeholder={defaultPlaceHolder}
            styles={dropDownStyles(theme)}
            disabled={props.speakers.length === 0}
            options={getDropDownList(props.speakers)}
            defaultSelectedKey={props.selectedSpeaker ? props.selectedSpeaker.id : defaultDeviceId(props.speakers)}
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
      </Stack>
    </Stack>
  );
};

const defaultDeviceId = (devices: AudioDeviceInfo[]): string => {
  if (devices.length === 0) {
    return '';
  }
  const defaultDevice = devices.find((device) => device.isSystemDefault);
  if (defaultDevice) {
    return defaultDevice.id;
  }
  return devices[0].id;
};
