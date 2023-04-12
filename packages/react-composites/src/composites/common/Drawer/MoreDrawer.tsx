// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
/* @conditional-compile-remove(close-captions) */
import { useState } from 'react';
/* @conditional-compile-remove(control-bar-button-injection) */
import { useMemo } from 'react';
import {
  OptionsDevice,
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles
} from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _StartCaptionsButton } from '@internal/react-components';

/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
import { AudioDeviceInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(control-bar-button-injection) */
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallDrawerButtons,
  onFetchCustomButtonPropsTrampoline
} from '../ControlBar/CustomButton';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { useLocale } from '../../localization';
import { isDisabled } from '../../CallComposite/utils';
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';
/* @conditional-compile-remove(close-captions) */
import { Stack, Toggle, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(close-captions) */
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { _startCaptionsButtonSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { defaultSpokenLanguage } from '../utils';
/* @conditional-compile-remove(close-captions) */
import { SpokenLanguageDrawer } from './SpokenLanguageDrawer';
/* @conditional-compile-remove(close-captions) */
import { themedToggleButtonStyle } from './MoreDrawer.styles';

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
  audioDeviceMenuTitle?: string;
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
  /* @conditional-compile-remove(close-captions) */
  /**
   * Label for captions drawerMenuItem
   *
   * @remarks Only displayed when in Teams call
   */
  captionsMenuTitle: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * Label for spokenLanguage drawerMenuItem
   *
   * @remarks Only displayed when in Teams call, disabled until captions is on
   */
  spokenLanguageMenuTitle: string;
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
  callControls?: boolean | CommonCallControlOptions;
  onClickShowDialpad?: () => void;
  /* @conditional-compile-remove(close-captions) */
  isCaptionsSupported?: boolean;
  strings: MoreDrawerStrings;
  disableButtonsForHoldScreen?: boolean;
}

const inferCallWithChatControlOptions = (
  callWithChatControls?: boolean | CommonCallControlOptions
): CommonCallControlOptions | false => {
  if (callWithChatControls === false) {
    return false;
  }
  const options = callWithChatControls === true || callWithChatControls === undefined ? {} : callWithChatControls;
  return options;
};

/** @private */
export const MoreDrawer = (props: MoreDrawerProps): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const theme = useTheme();
  const drawerMenuItems: DrawerMenuItemProps[] = [];

  const { speakers, onSelectSpeaker, onLightDismiss } = props;

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const localeStrings = useLocale();
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);

  const onSpeakerItemClick = useCallback(
    (_ev, itemKey) => {
      const selected = speakers?.find((speaker) => speaker.id === itemKey);
      if (selected) {
        // This is unsafe - we're only passing in part of the argument to the handler.
        // But this is a known issue in our state.
        onSelectSpeaker(selected as AudioDeviceInfo);
      }
      onLightDismiss();
    },
    [speakers, onSelectSpeaker, onLightDismiss]
  );

  const drawerSelectionOptions = inferCallWithChatControlOptions(props.callControls);

  if (props.speakers && props.speakers.length > 0) {
    drawerMenuItems.push({
      itemKey: 'speakers',
      disabled: props.disableButtonsForHoldScreen,
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
      onLightDismiss();
    },
    [microphones, onSelectMicrophone, onLightDismiss]
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
      disabled: props.disableButtonsForHoldScreen,
      text: text,
      iconProps: { iconName: iconName },
      subMenuProps: props.microphones.map((mic) => ({
        itemKey: mic.id,
        iconProps: {
          iconName: isDeviceSelected(mic, props.selectedMicrophone) ? selectedIconName : iconName
        },
        text: mic.name,
        onItemClick: onMicrophoneItemClick,
        secondaryIconProps: isDeviceSelected(mic, props.selectedMicrophone) ? { iconName: 'Accept' } : undefined,
        disabled: drawerSelectionOptions !== false ? isDisabled(drawerSelectionOptions.microphoneButton) : undefined
      })),
      secondaryText: props.selectedMicrophone?.name
    });
  }
  if (drawerSelectionOptions !== false && isEnabled(drawerSelectionOptions?.peopleButton)) {
    drawerMenuItems.push({
      itemKey: 'people',
      id: 'call-composite-drawer-people-button',
      text: props.strings.peopleButtonLabel,
      iconProps: { iconName: 'MoreDrawerPeople' },
      onItemClick: props.onPeopleButtonClicked,
      disabled: isDisabled(drawerSelectionOptions.peopleButton)
    });
  }

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  if (drawerSelectionOptions !== false && isEnabled(drawerSelectionOptions?.holdButton)) {
    drawerMenuItems.push({
      itemKey: 'holdButtonKey',
      disabled: props.disableButtonsForHoldScreen || isDisabled(drawerSelectionOptions.holdButton),
      text: localeStrings.component.strings.holdButton.tooltipOffContent,
      onItemClick: () => {
        holdButtonProps.onToggleHold();
      },
      iconProps: { iconName: 'HoldCallContextualMenuItem', styles: { root: { lineHeight: 0 } } }
    });
  }

  /*@conditional-compile-remove(PSTN-calls) */
  // dtmf tone sending only works for 1:1 PSTN call
  if (drawerSelectionOptions !== false && props.onClickShowDialpad) {
    drawerMenuItems.push({
      itemKey: 'showDialpadKey',
      disabled: props.disableButtonsForHoldScreen,
      text: localeStrings.strings.callWithChat.openDtmfDialpadLabel,
      onItemClick: () => {
        props.onClickShowDialpad && props.onClickShowDialpad();
      },
      iconProps: { iconName: 'Dialpad', styles: { root: { lineHeight: 0 } } }
    });
  }

  /* @conditional-compile-remove(close-captions) */
  // Captions drawers
  const startCaptionsButtonProps = useAdaptedSelector(_startCaptionsButtonSelector);
  /* @conditional-compile-remove(close-captions) */
  const startCaptionsButtonHandlers = useHandlers(_StartCaptionsButton);

  /* @conditional-compile-remove(close-captions) */
  const [isSpokenLanguageDrawerOpen, setIsSpokenLanguageDrawerOpen] = useState<boolean>(false);

  /* @conditional-compile-remove(close-captions) */
  const [currentSpokenLanguage, setCurrentSpokenLanguage] = useState<string>(
    startCaptionsButtonProps.currentSpokenLanguage === ''
      ? defaultSpokenLanguage
      : startCaptionsButtonProps.currentSpokenLanguage
  );

  /* @conditional-compile-remove(close-captions) */
  if (props.isCaptionsSupported) {
    const captionsDrawerItems: DrawerMenuItemProps[] = [];

    drawerMenuItems.push({
      itemKey: 'captions',
      disabled: props.disableButtonsForHoldScreen,
      text: props.strings.captionsMenuTitle,
      iconProps: { iconName: 'CaptionsIcon' },
      subMenuProps: captionsDrawerItems
    });

    captionsDrawerItems.push({
      itemKey: 'ToggleCaptionsKey',
      text: startCaptionsButtonProps.checked
        ? localeStrings.strings.call.startCaptionsButtonTooltipOnContent
        : localeStrings.strings.call.startCaptionsButtonTooltipOffContent,
      iconProps: {
        iconName: startCaptionsButtonProps.checked ? 'CaptionsOffIcon' : 'CaptionsIcon',
        styles: { root: { lineHeight: 0 } }
      },
      disabled: props.disableButtonsForHoldScreen,
      secondaryComponent: (
        <Stack verticalFill verticalAlign="center">
          <Toggle
            checked={startCaptionsButtonProps.checked}
            styles={themedToggleButtonStyle(theme, startCaptionsButtonProps.checked)}
            onChange={async () => {
              if (!startCaptionsButtonProps.checked) {
                await startCaptionsButtonHandlers.onStartCaptions({
                  spokenLanguage: currentSpokenLanguage
                });
                // set spoken language when start captions with a spoken language specified.
                // this is to fix the bug when a second user starts captions with a new spoken language, captions bot ignore that spoken language
                startCaptionsButtonHandlers.onSetSpokenLanguage(currentSpokenLanguage);
              } else {
                startCaptionsButtonHandlers.onStopCaptions();
              }
            }}
          />
        </Stack>
      )
    });

    captionsDrawerItems.push({
      itemKey: 'ChangeSpokenLanguage',
      text: props.strings.spokenLanguageMenuTitle,
      secondaryText: currentSpokenLanguage,
      iconProps: {
        iconName: 'ChangeSpokenLanguageIcon',
        styles: { root: { lineHeight: 0 } }
      },
      disabled: props.disableButtonsForHoldScreen || !startCaptionsButtonProps.checked,
      onItemClick: () => {
        setIsSpokenLanguageDrawerOpen(true);
      },
      secondaryIconProps: {
        iconName: 'ChevronRight',
        styles: { root: { lineHeight: 0 } }
      }
    });
  }

  /* @conditional-compile-remove(control-bar-button-injection) */
  const customDrawerButtons = useMemo(
    () =>
      generateCustomCallDrawerButtons(
        onFetchCustomButtonPropsTrampoline(drawerSelectionOptions !== false ? drawerSelectionOptions : undefined),
        drawerSelectionOptions !== false ? drawerSelectionOptions?.displayType : undefined
      ),
    [drawerSelectionOptions]
  );

  /* @conditional-compile-remove(control-bar-button-injection) */
  customDrawerButtons['primary'].slice(CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_MOBILE_CUSTOM_BUTTONS).forEach((element) => {
    drawerMenuItems.push(element);
  });
  /* @conditional-compile-remove(control-bar-button-injection) */
  customDrawerButtons['secondary'].forEach((element) => {
    drawerMenuItems.push(element);
  });
  /* @conditional-compile-remove(control-bar-button-injection) */
  customDrawerButtons['overflow'].forEach((element) => {
    drawerMenuItems.push(element);
  });
  /* @conditional-compile-remove(close-captions) */
  return (
    <>
      {isSpokenLanguageDrawerOpen && props.isCaptionsSupported && (
        <SpokenLanguageDrawer
          onLightDismiss={props.onLightDismiss}
          setCurrentSpokenLanguage={setCurrentSpokenLanguage}
          currentSpokenLanguage={currentSpokenLanguage}
          strings={props.strings}
        />
      )}
      {!isSpokenLanguageDrawerOpen && <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />}
    </>
  );

  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};

const isDeviceSelected = (speaker: OptionsDevice, selectedSpeaker?: OptionsDevice): boolean =>
  !!selectedSpeaker && speaker.id === selectedSpeaker.id;

const isEnabled = (option: unknown): boolean => option !== false;
