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

  const onSelectSpeaker = useCallback(
    (_ev, itemKey) => {
      const selected = props.speakers?.find((speaker) => speaker.id === itemKey);
      if (selected) {
        // This is unsafe - we're only passing in part of the argument to the handler.
        // But this is a known issue in our state.
        props.onSelectSpeaker(selected as AudioDeviceInfo);
      }
    },
    [props.speakers, props.onSelectSpeaker]
  );

  if (props.speakers && props.speakers.length > 0) {
    drawerMenuItems.push({
      key: 'speakers',
      text: props.strings.speakerMenuTitle,
      iconProps: { iconName: 'MoreDrawerSpeakers' },
      subMenuProps: props.speakers.map((speaker) => ({
        key: speaker.id,
        itemKey: speaker.id,
        iconProps: {
          iconName: isDeviceSelected(speaker, props.selectedSpeaker)
            ? 'MoreDrawerSelectedSpeaker'
            : 'MoreDrawerSpeakers'
        },
        text: speaker.name,
        onItemClick: onSelectSpeaker
      }))
    });
  }

  const onSelectMicrophone = useCallback(
    (_ev, itemKey) => {
      const selected = props.microphones?.find((mic) => mic.id === itemKey);
      if (selected) {
        // This is unsafe - we're only passing in part of the argument to the handler.
        // But this is a known issue in our state.
        props.onSelectMicrophone(selected as AudioDeviceInfo);
      }
    },
    [props.speakers, props.onSelectSpeaker]
  );

  if (props.microphones && props.microphones.length > 0) {
    drawerMenuItems.push({
      key: 'microphones',
      text: props.strings.microphoneMenuTitle,
      iconProps: { iconName: 'MoreDrawerMicrophones' },
      subMenuProps: props.microphones.map((mic) => ({
        key: mic.id,
        itemKey: mic.id,
        iconProps: {
          iconName: isDeviceSelected(mic, props.selectedMicrophone)
            ? 'MoreDrawerSelectedMicrophone'
            : 'MoreDrawerMicrophones'
        },
        text: mic.name,
        onItemClick: onSelectMicrophone
      }))
    });
  }

  drawerMenuItems.push({
    key: 'people',
    text: props.strings.peopleButtonLabel,
    iconProps: { iconName: 'MoreDrawerPeople' },
    onItemClick: props.onPeopleButtonClicked
  });

  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};

const isDeviceSelected = (speaker: OptionsDevice, selectedSpeaker?: OptionsDevice): boolean =>
  !!selectedSpeaker && speaker.id === selectedSpeaker.id;
