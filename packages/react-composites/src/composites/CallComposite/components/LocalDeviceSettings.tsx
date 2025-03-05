// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { Dropdown, IButton, IDropdownOption, Label, mergeStyles, Stack } from '@fluentui/react';

import { DefaultButton } from '@fluentui/react';
import { useEffect, useRef } from 'react';
import { useTheme, VideoStreamOptions, _DevicePermissionDropdown, useAccessibility } from '@internal/react-components';
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
import { useSelector } from '../hooks/useSelector';
import { getRole, getVideoEffectsDependency } from '../selectors/baseSelectors';
import { getEnvironmentInfo } from '../selectors/baseSelectors';
import { _isSafari } from '../utils';
import { useId } from '@fluentui/react-hooks';

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
  return props ? (
    <div className={dropDownTitleIconStyles}>
      {getOptionIcon(iconType)}
      <span>{props[0]?.text}</span>
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
  const accessibility = useAccessibility();
  const videoEffectsButtonRef = useRef<IButton | null>(null);

  const onResolveVideoEffectDependency = useSelector(getVideoEffectsDependency);
  const defaultPlaceHolder = locale.strings.call.defaultPlaceHolder;
  const cameraLabel = locale.strings.call.cameraLabel;
  const soundLabel = locale.strings.call.soundLabel;
  const noSpeakersLabel = locale.strings.call.noSpeakersLabel;
  const noCameraLabel = locale.strings.call.noCamerasLabel;
  const noMicLabel = locale.strings.call.noMicrophonesLabel;
  const role = useSelector(getRole);

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
  const environmentInfo = useSelector(getEnvironmentInfo);
  const isSafariWithNoSpeakers = _isSafari(environmentInfo) && !hasSpeakers;

  const cameraLabelId = useId('camera-label');
  const soundLabelId = useId('sound-label');

  const cameraGrantedDropdown = (
    <Dropdown
      data-ui-id="call-composite-local-camera-settings"
      aria-labelledby={cameraLabelId}
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
      onChange={async (event, option, index) => {
        const camera = props.cameras[index ?? 0];
        if (camera) {
          await props.onSelectCamera(camera, localVideoViewOptions);
        } else {
          console.error('No cameras available');
        }
      }}
      onRenderTitle={(props?: IDropdownOption[]) => onRenderTitle('Camera', props)}
    />
  );

  const micGrantedDropdown = (
    <>
      {roleCanUseMic && (
        <Dropdown
          aria-labelledby={soundLabelId}
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
            const microphone = props.microphones[index ?? 0];
            if (microphone) {
              props.onSelectMicrophone(microphone);
            } else {
              console.error('No microphones available');
            }
          }}
          onRenderTitle={(props?: IDropdownOption[]) => onRenderTitle('Microphone', props)}
        />
      )}
    </>
  );

  const speakerDropdown = (
    <Dropdown
      aria-labelledby={soundLabelId}
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
        const speaker = props.speakers[index ?? 0];
        if (speaker) {
          props.onSelectSpeaker(speaker);
        } else {
          console.error('No speakers available');
        }
      }}
      onRenderTitle={(props?: IDropdownOption[]) => onRenderTitle('Speaker', props)}
    />
  );

  return (
    <Stack data-ui-id="call-composite-device-settings" tokens={mainStackTokens} styles={deviceSelectionContainerStyles}>
      {roleCanUseCamera && (
        <Stack>
          <Stack horizontal horizontalAlign="space-between" styles={cameraAndVideoEffectsContainerStyleDesktop}>
            <Label id={cameraLabelId} className={mergeStyles(dropDownStyles(theme).label)}>
              {cameraLabel}
            </Label>
            {onResolveVideoEffectDependency && (
              <DefaultButton
                iconProps={{ iconName: 'ConfigurationScreenVideoEffectsButton' }}
                styles={effectsButtonStyles(theme, !cameraPermissionGranted)}
                onClick={() => {
                  if (props.onClickVideoEffects) {
                    accessibility.setComponentRef(videoEffectsButtonRef.current);
                    props.onClickVideoEffects();
                  }
                }}
                disabled={!cameraPermissionGranted}
                componentRef={videoEffectsButtonRef}
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
            ariaLabelledby={cameraLabelId}
          />
        </Stack>
      )}
      <Stack>
        <Label id={soundLabelId} className={mergeStyles(dropDownStyles(theme).label)}>
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
            ariaLabelledby={soundLabelId}
          />
          {isSafariWithNoSpeakers ? <></> : speakerDropdown}
        </Stack>
      </Stack>
    </Stack>
  );
};

const defaultDeviceId = (devices: AudioDeviceInfo[]): string | undefined => {
  if (devices.length === 0) {
    return undefined;
  }
  const defaultDevice = devices.find((device) => device.isSystemDefault);
  if (defaultDevice) {
    return defaultDevice.id;
  }
  return devices[0]?.id;
};
