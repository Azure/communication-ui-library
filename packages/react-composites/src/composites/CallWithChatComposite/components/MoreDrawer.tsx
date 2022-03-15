// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  OptionsDevice,
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps
} from '@internal/react-components';
import { AudioDeviceInfo } from '@azure/communication-calling';

/** @private */
export interface MoreDrawerStrings {
  peopleButtonLabel: string;
  microphoneMenuTitle: string;
  speakerMenuTitle: string;
}

/** @private */
export interface MoreDrawerDevicesMenuProps {
  /**
   * Available microphones for selection
   */
  microphones?: OptionsDevice[];
  /**
   * Available speakers for selection
   */
  speakers?: OptionsDevice[];
  /**
   * Microphone that is shown as currently selected
   */
  selectedMicrophone?: OptionsDevice;
  /**
   * Speaker that is shown as currently selected
   */
  selectedSpeaker?: OptionsDevice;
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker: (device: AudioDeviceInfo) => Promise<void>;
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone: (device: AudioDeviceInfo) => Promise<void>;
}

/** @private */
export interface MoreDrawerProps extends MoreDrawerDevicesMenuProps {
  onLightDismiss: () => void;
  onPeopleButtonClicked: () => void;
  strings: MoreDrawerStrings;
}

/** @private */
export const MoreDrawer = (props: MoreDrawerProps): JSX.Element => {
  const drawerMenuItems: DrawerMenuItemProps[] = [];

  const { speakers, onSelectSpeaker } = props;
  const onSpeakerItemClick = useCallback(
    (_ev, itemKey) => {
      const selected = speakers?.find((speaker) => speaker.id === itemKey);
      if (selected) {
        // This is unsafe - we're only passing in part of the argument to the handler.
        // But this is a known issue in our state.
        onSelectSpeaker(selected as AudioDeviceInfo);
      }
    },
    [speakers, onSelectSpeaker]
  );

  if (props.speakers && props.speakers.length > 0) {
    drawerMenuItems.push({
      itemKey: 'speakers',
      text: props.strings.speakerMenuTitle,
      iconProps: { iconName: 'MoreDrawerSpeakers' },
      subMenuProps: props.speakers.map((speaker) => ({
        itemKey: speaker.id,
        iconProps: {
          iconName: isDeviceSelected(speaker, props.selectedSpeaker)
            ? 'MoreDrawerSelectedSpeaker'
            : 'MoreDrawerSpeakers'
        },
        text: speaker.name,
        onItemClick: onSpeakerItemClick,
        secondaryIconProps: isDeviceSelected(speaker, props.selectedSpeaker) ? { iconName: 'Accept' } : undefined
      })),
      secondaryText: props.selectedSpeaker?.name
    });
  }

  const { microphones, onSelectMicrophone } = props;
  const onMicrophoneItemClick = useCallback(
    (_ev, itemKey) => {
      const selected = microphones?.find((mic) => mic.id === itemKey);
      if (selected) {
        // This is unsafe - we're only passing in part of the argument to the handler.
        // But this is a known issue in our state.
        onSelectMicrophone(selected as AudioDeviceInfo);
      }
    },
    [microphones, onSelectMicrophone]
  );

  if (props.microphones && props.microphones.length > 0) {
    drawerMenuItems.push({
      itemKey: 'microphones',
      text: props.strings.microphoneMenuTitle,
      iconProps: { iconName: 'MoreDrawerMicrophones' },
      subMenuProps: props.microphones.map((mic) => ({
        itemKey: mic.id,
        iconProps: {
          iconName: isDeviceSelected(mic, props.selectedMicrophone)
            ? 'MoreDrawerSelectedMicrophone'
            : 'MoreDrawerMicrophones'
        },
        text: mic.name,
        onItemClick: onMicrophoneItemClick,
        secondaryIconProps: isDeviceSelected(mic, props.selectedMicrophone) ? { iconName: 'Accept' } : undefined
      })),
      secondaryText: props.selectedMicrophone?.name
    });
  }

  drawerMenuItems.push({
    itemKey: 'people',
    text: props.strings.peopleButtonLabel,
    iconProps: { iconName: 'MoreDrawerPeople' },
    onItemClick: props.onPeopleButtonClicked
  });

  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};

const isDeviceSelected = (speaker: OptionsDevice, selectedSpeaker?: OptionsDevice): boolean =>
  !!selectedSpeaker && speaker.id === selectedSpeaker.id;
