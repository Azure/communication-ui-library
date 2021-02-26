// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { IDropdownOption, Dropdown, Stack } from '@fluentui/react';
import { dropDownStyles, localSettingsContainer, mainStackTokens } from './styles/LocalDeviceSettings.styles';
import {
  LocalDeviceSettingsContainerProps,
  MapToLocalDeviceSettingsProps
} from './consumers/MapToLocalDeviceSettingsProps';
import { connectFuncsToContext } from '../../consumers/ConnectContext';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../utils/WithErrorHandling';

const LocalDeviceSettingsComponentBase = (
  props: LocalDeviceSettingsContainerProps & ErrorHandlingProps
): JSX.Element => {
  const defaultPlaceHolder = 'Select an option';
  const cameraLabel = 'Camera';
  const micLabel = 'Microphone';

  const getDropDownList = (list: Array<VideoDeviceInfo | AudioDeviceInfo>): IDropdownOption[] => {
    return list.map((item) => ({
      val: item,
      key: item.id,
      text: item.name === '' ? item.deviceType : item.name
    }));
  };
  return (
    <Stack className={localSettingsContainer} tokens={mainStackTokens}>
      <Dropdown
        placeholder={defaultPlaceHolder}
        label={cameraLabel}
        options={getDropDownList(props.videoDeviceList)}
        styles={dropDownStyles}
        disabled={props.videoDeviceList.length === 0}
        defaultSelectedKey={props.videoDeviceInfo ? props.videoDeviceInfo.id : ''}
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption | undefined,
          index?: number | undefined
        ) => {
          props.updateLocalVideoStream(props.videoDeviceList[index ?? 0]);
        }}
      />
      <Dropdown
        placeholder={defaultPlaceHolder}
        label={micLabel}
        styles={dropDownStyles}
        disabled={props.audioDeviceList.length === 0}
        options={getDropDownList(props.audioDeviceList)}
        defaultSelectedKey={props.audioDeviceInfo ? props.audioDeviceInfo.id : ''}
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption | undefined,
          index?: number | undefined
        ) => {
          props.updateAudioDeviceInfo(props.audioDeviceList[index ?? 0]);
        }}
      />
    </Stack>
  );
};

export const LocalDeviceSettingsComponent = (
  props: LocalDeviceSettingsContainerProps & ErrorHandlingProps
): JSX.Element => WithErrorHandling(LocalDeviceSettingsComponentBase, props);

export const LocalDeviceSettings = connectFuncsToContext(LocalDeviceSettingsComponent, MapToLocalDeviceSettingsProps);
