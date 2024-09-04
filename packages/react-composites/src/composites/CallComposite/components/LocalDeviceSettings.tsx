// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { Dropdown, IDropdownOption, Label, mergeStyles, Stack } from '@fluentui/react';

import { DefaultButton } from '@fluentui/react';
import { useEffect } from 'react';
import { useTheme, VideoStreamOptions, _DevicePermissionDropdown } from '@internal/react-components';
import React from 'react';
import { CallCompositeIcon } from '../../common/icons';
import { useLocale } from '../../localization';
import {
  deviceSelectionContainerStyles,
  dropDownStyles,
  dropDownTitleIconStyles,
  mainStackTokens,
  optionIconStyles,
  soundStackTokens
} from '../styles/LocalDeviceSettings.styles';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { ConfigurationPageCameraDropdown } from './ConfigurationPageCameraDropdown';
import { ConfigurationPageMicDropdown } from './ConfigurationPageMicDropdown';
/* @conditional-compile-remove(call-readiness) */
import { useHandlers } from '../hooks/useHandlers';
import { cameraAndVideoEffectsContainerStyleDesktop } from '../styles/CallConfiguration.styles';

import { effectsButtonStyles } from '../styles/CallConfiguration.styles';

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
    return <CallCompositeIcon iconName="LocalDeviceSettingsCamera" className={optionIconStyles} />;
  } else if (type === 'Microphone') {
    return <CallCompositeIcon iconName="LocalDeviceSettingsMic" className={optionIconStyles} />;
  } else if (type === 'Speaker') {
    return <CallCompositeIcon iconName="LocalDeviceSettingsSpeaker" className={optionIconStyles} />;
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
  /* @conditional-compile-remove(call-readiness) */
  onClickEnableDevicePermission?: () => void;

  onClickVideoEffects?: () => void;
}

/**
 * @private
 */
export const LocalDeviceSettings = (props: LocalDeviceSettingsType): JSX.Element => {
  const theme = useTheme();
  const locale = useLocale();
  const adapter = useAdapter();

  const onResolveVideoEffectDependency = adapter.getState().onResolveVideoEffectDependency;
  const defaultPlaceHolder = locale.strings.call.defaultPlaceHolder;
  const cameraLabel = locale.strings.call.cameraLabel;
  const soundLabel = locale.strings.call.soundLabel;
  const noSpeakersLabel = locale.strings.call.noSpeakersLabel;
  const noCameraLabel = locale.strings.call.noCamerasLabel;
  const noMicLabel = locale.strings.call.noMicrophonesLabel;
  const role = adapter.getState().call?.role;

  const cameraPermissionGranted = props.cameraPermissionGranted;
  const micPermissionGranted = props.microphonePermissionGranted;

  const roleCanUseCamera = role !== 'Consumer';
  const roleCanUseMic = role !== 'Consumer';

  // TODO: speaker permission is tied to microphone permission (when you request 'audio' permission using the SDK) its
  // actually granting access to query both microphone and speaker. However the browser popup asks you explicity for
  // 'microphone'. This needs investigation on how we want to handle this and maybe needs follow up with SDK team.
  useEffect(() => {
    if (cameraPermissionGranted) {
      adapter.queryCameras();
    }
    if (micPermissionGranted) {
      adapter.queryMicrophones();
    }
    adapter.querySpeakers();
  }, [adapter, cameraPermissionGranted, micPermissionGranted]);

  /* @conditional-compile-remove(call-readiness) */
  const dropdownProps = useHandlers(_DevicePermissionDropdown);

  const hasCameras = props.cameras.length > 0;
  const hasMicrophones = props.microphones.length > 0;
  const hasSpeakers = props.speakers.length > 0;
  /* @conditional-compile-remove(unsupported-browser) */
  const isSafariWithNoSpeakers =
    adapter.getState().environmentInfo?.environment.browser.toLowerCase() === 'safari' && !hasSpeakers;

  const cameraGrantedDropdown = (
    <Dropdown
      data-ui-id="call-composite-local-camera-settings"
      aria-labelledby={'call-composite-local-camera-settings-label'}
      placeholder={hasCameras ? defaultPlaceHolder : noCameraLabel}
      options={cameraPermissionGranted ? getDropDownList(props.cameras) : [{ key: 'deniedOrUnknown', text: '' }]}
      styles={dropDownStyles(theme)}
      disabled={!cameraPermissionGranted || !hasCameras}
      errorMessage={
        props.cameraPermissionGranted === undefined || props.cameraPermissionGranted
          ? undefined
          : locale.strings.call.cameraPermissionDenied
      }
      defaultSelectedKey={
        micPermissionGranted
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
  );

  const micGrantedDropdown = (
    <>
      {roleCanUseMic && (
        <Dropdown
          aria-labelledby={'call-composite-local-sound-settings-label'}
          placeholder={hasMicrophones ? defaultPlaceHolder : noMicLabel}
          styles={dropDownStyles(theme)}
          disabled={!micPermissionGranted || !hasMicrophones}
          errorMessage={
            props.microphonePermissionGranted === undefined || props.microphonePermissionGranted
              ? undefined
              : locale.strings.call.microphonePermissionDenied
          }
          options={micPermissionGranted ? getDropDownList(props.microphones) : [{ key: 'deniedOrUnknown', text: '' }]}
          defaultSelectedKey={
            micPermissionGranted
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
      )}
    </>
  );

  const speakerDropdown = (
    <Dropdown
      aria-labelledby={'call-composite-local-sound-settings-label'}
      placeholder={hasSpeakers ? defaultPlaceHolder : noSpeakersLabel}
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
  );

  const safariBrowserSpeakerDropdownTrampoline = (): JSX.Element => {
    /* @conditional-compile-remove(unsupported-browser) */
    if (isSafariWithNoSpeakers) {
      return <></>;
    }
    return speakerDropdown;
  };

  return (
    <Stack data-ui-id="call-composite-device-settings" tokens={mainStackTokens} styles={deviceSelectionContainerStyles}>
      {roleCanUseCamera && (
        <Stack>
          <Stack horizontal horizontalAlign="space-between" styles={cameraAndVideoEffectsContainerStyleDesktop}>
            <Label
              id={'call-composite-local-camera-settings-label'}
              className={mergeStyles(dropDownStyles(theme).label)}
              disabled={!cameraPermissionGranted} // follows dropdown disabled state
            >
              {cameraLabel}
            </Label>
            {onResolveVideoEffectDependency && (
              <DefaultButton
                iconProps={{ iconName: 'ConfigurationScreenVideoEffectsButton' }}
                styles={effectsButtonStyles(theme, !cameraPermissionGranted)}
                onClick={props.onClickVideoEffects}
                disabled={!cameraPermissionGranted}
                data-ui-id={'call-config-video-effects-button'}
              >
                {locale.strings.call.configurationPageVideoEffectsButtonLabel}
              </DefaultButton>
            )}
          </Stack>
          <ConfigurationPageCameraDropdown
            cameraGrantedDropdown={cameraGrantedDropdown}
            cameraPermissionGranted={cameraPermissionGranted ?? false}
            /* @conditional-compile-remove(call-readiness) */
            dropdownProps={dropdownProps}
            /* @conditional-compile-remove(call-readiness) */
            onClickEnableDevicePermission={props.onClickEnableDevicePermission}
          />
        </Stack>
      )}
      <Stack>
        <Label
          id={'call-composite-local-sound-settings-label'}
          className={mergeStyles(dropDownStyles(theme).label)}
          disabled={!micPermissionGranted} // follows Start button disabled state in ConfigurationPage
        >
          {soundLabel}
        </Label>
        <Stack data-ui-id="call-composite-sound-settings" tokens={soundStackTokens}>
          <ConfigurationPageMicDropdown
            micGrantedDropdown={micGrantedDropdown}
            micPermissionGranted={micPermissionGranted ?? false}
            /* @conditional-compile-remove(call-readiness) */
            dropdownProps={dropdownProps}
            /* @conditional-compile-remove(call-readiness) */
            onClickEnableDevicePermission={props.onClickEnableDevicePermission}
          />
          {safariBrowserSpeakerDropdownTrampoline()}
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
