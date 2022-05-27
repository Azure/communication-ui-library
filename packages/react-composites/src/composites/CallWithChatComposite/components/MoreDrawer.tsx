// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
/* @conditional-compile-remove(control-bar-button-injection) */
import { useMemo } from 'react';
import {
  OptionsDevice,
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuItemProps
} from '@internal/react-components';
import { AudioDeviceInfo } from '@azure/communication-calling';
import { CallWithChatControlOptions } from '../CallWithChatComposite';
/* @conditional-compile-remove(control-bar-button-injection) */
import { generateCustomDrawerButtons } from '../../CallComposite/components/buttons/Custom';
/* @conditional-compile-remove(control-bar-button-injection) */
import { CustomCallControlButtonCallback } from '../../CallComposite';

/** @private */
export interface MoreDrawerStrings {
  /**
   * Label for people drawerMenuItem.
   */
  peopleButtonLabel: string;
  /**
   * Label for audio device drawerMenuItem.
   *
   * @remarks This replaces the microphoneMenuTitle speakers can not be enumerated
   *
   */
  audioDeviceMenuTitle: string;
  /**
   * Label for microphone drawerMenuItem.
   *
   * @remarks Only displayed when speakers can be enumerated otherwise audioDeviceMenuTitle is used
   *
   */
  microphoneMenuTitle: string;
  /**
   * Label for speaker drawerMenuItem.
   *
   * @remarks Only displayed when speakers can be enumerated
   *
   */
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
  callControls?: boolean | CallWithChatControlOptions;
  strings: MoreDrawerStrings;
}

const inferCallWithChatControlOptions = (
  callWithChatControls?: boolean | CallWithChatControlOptions
): CallWithChatControlOptions | false => {
  if (callWithChatControls === false) {
    return false;
  }
  const options = callWithChatControls === true || callWithChatControls === undefined ? {} : callWithChatControls;
  return options;
};

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

  const drawerSelectionOptions = inferCallWithChatControlOptions(props.callControls);

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
    // Set props as Microphone if speakers can be enumerated else set as Audio Device
    const speakersAvailable = props.speakers && props.speakers.length > 0;
    const itemKey = speakersAvailable ? 'microphones' : 'audioDevices';
    const text = speakersAvailable ? props.strings.microphoneMenuTitle : props.strings.audioDeviceMenuTitle;
    const iconName = speakersAvailable ? 'MoreDrawerMicrophones' : 'MoreDrawerSpeakers';
    const selectedIconName = speakersAvailable ? 'MoreDrawerSelectedMicrophone' : 'MoreDrawerSelectedSpeaker';

    drawerMenuItems.push({
      itemKey: itemKey,
      text: text,
      iconProps: { iconName: iconName },
      subMenuProps: props.microphones.map((mic) => ({
        itemKey: mic.id,
        iconProps: {
          iconName: isDeviceSelected(mic, props.selectedMicrophone) ? selectedIconName : iconName
        },
        text: mic.name,
        onItemClick: onMicrophoneItemClick,
        secondaryIconProps: isDeviceSelected(mic, props.selectedMicrophone) ? { iconName: 'Accept' } : undefined
      })),
      secondaryText: props.selectedMicrophone?.name
    });
  }

  if (drawerSelectionOptions !== false && isEnabled(drawerSelectionOptions?.peopleButton)) {
    drawerMenuItems.push({
      itemKey: 'people',
      text: props.strings.peopleButtonLabel,
      iconProps: { iconName: 'MoreDrawerPeople' },
      onItemClick: props.onPeopleButtonClicked
    });
  }
  /* @conditional-compile-remove(control-bar-button-injection) */
  const customDrawerButtons = useMemo(
    () =>
      generateCustomDrawerButtons(
        onFetchCustomButtonPropsTrampoline(drawerSelectionOptions !== false ? drawerSelectionOptions : undefined),
        drawerSelectionOptions !== false ? drawerSelectionOptions?.displayType : undefined
      ),
    [drawerSelectionOptions]
  );

  /* @conditional-compile-remove(control-bar-button-injection) */
  customDrawerButtons['overflowBar']?.props.children.forEach((element) => {
    drawerMenuItems.push({
      itemKey: element.key,
      text: element.strings.label,
      onItemClick: element.onClick,
      iconProps: { iconName: element.onRenderOnIcon().props.iconName },
      subMenuProps: element.menuProps ? makeSubMenuItems(element) : undefined
    });
  });
  /* @conditional-compile-remove(control-bar-button-injection) */
  customDrawerButtons['mainBar']?.props.children.slice(1).forEach((element) => {
    drawerMenuItems.push({
      itemKey: element.key,
      text: element.strings.label,
      onItemClick: element.onClick,
      iconProps: { iconName: element.onRenderOnIcon().props.iconName },
      subMenuProps: element.menuProps ? makeSubMenuItems(element) : undefined
    });
  });
  /* @conditional-compile-remove(control-bar-button-injection) */
  customDrawerButtons['sideBar']?.props.children.forEach((element) => {
    drawerMenuItems.push({
      itemKey: element.key,
      text: element.strings.label,
      onItemClick: element.onClick,
      iconProps: { iconName: element.onRenderOnIcon().props.iconName },
      subMenuProps: element.menuProps ? makeSubMenuItems(element) : undefined
    });
  });

  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};

const isDeviceSelected = (speaker: OptionsDevice, selectedSpeaker?: OptionsDevice): boolean =>
  !!selectedSpeaker && speaker.id === selectedSpeaker.id;

const isEnabled = (option: unknown): boolean => option !== false;

/* @conditional-compile-remove(control-bar-button-injection) */
/** @private */
const onFetchCustomButtonPropsTrampoline = (
  options?: CallWithChatControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  response = options?.onFetchCustomButtonProps;
  return response;
};

/* @conditional-compile-remove(control-bar-button-injection) */
/** @private */
const makeSubMenuItems = (menuItem): _DrawerMenuItemProps[] => {
  const subMenuProps: _DrawerMenuItemProps[] = [];
  if (menuItem.menuProps) {
    menuItem.menuProps?.items.forEach((subMenuItem) => {
      subMenuProps.push({
        itemKey: subMenuItem.key,
        text: subMenuItem.text
      });
    });
  }
  return subMenuProps;
};
