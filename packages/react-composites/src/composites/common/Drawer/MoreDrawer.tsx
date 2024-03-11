// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback } from 'react';
/* @conditional-compile-remove(close-captions) */
import { useState } from 'react';
/* @conditional-compile-remove(control-bar-button-injection) */
import { useMemo } from 'react';
import {
  OptionsDevice,
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles,
  SpokenLanguageStrings,
  CaptionLanguageStrings
} from '@internal/react-components';
/* @conditional-compile-remove(reaction) */
import { ReactionResources } from '@internal/react-components';
/* @conditional-compile-remove(gallery-layouts) */
import { VideoGalleryLayout } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _StartCaptionsButton, _CaptionsSettingsModal } from '@internal/react-components';

/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
/* @conditional-compile-remove(raise-hand) */
import { RaiseHandButton, RaiseHandButtonProps } from '@internal/react-components';
import { AudioDeviceInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(reaction) */
import { Reaction } from '@azure/communication-calling';
/* @conditional-compile-remove(control-bar-button-injection) */
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallDrawerButtons,
  onFetchCustomButtonPropsTrampoline
} from '../ControlBar/CustomButton';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(raise-hand) */
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
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
import { _captionSettingsSelector, _startCaptionsButtonSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { CaptionLanguageSettingsDrawer } from './CaptionLanguageSettingsDrawer';
/* @conditional-compile-remove(close-captions) */
import { themedToggleButtonStyle } from './MoreDrawer.styles';
/* @conditional-compile-remove(close-captions) */
import { _spokenLanguageToCaptionLanguage } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { useAdapter } from '../../CallComposite/adapter/CallAdapterProvider';
/* @conditional-compile-remove(dtmf-dialer) */
import { useSelector } from '../../CallComposite/hooks/useSelector';
/* @conditional-compile-remove(dtmf-dialer) */
import { getTargetCallees } from '../../CallComposite/selectors/baseSelectors';
/* @conditional-compile-remove(dtmf-dialer) */
import { showDtmfDialer } from '../../CallComposite/utils/MediaGalleryUtils';
import { SpokenLanguageSettingsDrawer } from './SpokenLanguageSettingsDrawer';

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

  /* @conditional-compile-remove(close-captions) */
  /**
   * Label for captionLanguage drawerMenuItem
   *
   * @remarks Only displayed when in Teams call, disabled until captions is on
   */
  captionLanguageMenuTitle: string;

  /**
   * Label for gallery options drawerMenuItem
   */
  galleryOptionsMenuTitle: string;
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
  userSetGalleryLayout?: VideoGalleryLayout;
  /**
   * Callback for when the gallery layout is changed
   */
  onUserSetGalleryLayout?: (layout: VideoGalleryLayout) => void;
  /* @conditional-compile-remove(dtmf-dialer) */
  /**
   * Callback to hide and show the dialpad in the more drawer
   */
  onSetDialpadPage?: () => void;
  /* @conditional-compile-remove(dtmf-dialer) */
  /**
   * Whether the dialpad is present in the call
   */
  dtmfDialerPresent?: boolean;
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
  /* @conditional-compile-remove(reaction) */
  reactionResources?: ReactionResources;
  /* @conditional-compile-remove(reaction) */
  onReactionClick?: (reaction: Reaction) => Promise<void>;
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
  /* @conditional-compile-remove(rooms) */
  const callAdapter = useAdapter();
  const drawerMenuItems: DrawerMenuItemProps[] = [];

  const { speakers, onSelectSpeaker, onLightDismiss } = props;

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
  const localeStrings = useLocale();
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);

  /* @conditional-compile-remove(dtmf-dialer) */
  const callees = useSelector(getTargetCallees);
  /* @conditional-compile-remove(dtmf-dialer) */
  const allowDtmfDialer = showDtmfDialer(callees);
  /* @conditional-compile-remove(dtmf-dialer) */
  const [dtmfDialerChecked, setDtmfDialerChecked] = useState<boolean>(props.dtmfDialerPresent ?? false);

  /* @conditional-compile-remove(raise-hand) */
  const raiseHandButtonProps = usePropsFor(RaiseHandButton) as RaiseHandButtonProps;

  const onSpeakerItemClick = useCallback(
    (
      _ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined,
      itemKey: string | undefined
    ) => {
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

  if (props.reactionResources !== undefined) {
    drawerMenuItems.push({
      itemKey: 'reactions',
      reactionResources: props.reactionResources,
      onReactionClick: props.onReactionClick
    });
  }

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
    (
      _ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined,
      itemKey: string | undefined
    ) => {
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

  /* @conditional-compile-remove(dtmf-dialer) */
  const dtmfDialerScreenOption = {
    itemKey: 'dtmfDialerScreenKey',
    text: !dtmfDialerChecked
      ? localeStrings.strings.call.dtmfDialerMoreButtonLabelOn
      : localeStrings.strings.call.dtmfDialerMoreButtonLabelOff,
    onItemClick: () => {
      if (props.onSetDialpadPage) {
        props.onSetDialpadPage();
      }
      setDtmfDialerChecked(!dtmfDialerChecked);
      onLightDismiss();
    },
    iconProps: {
      iconName: 'DtmfDialpadButton',
      styles: { root: { lineHeight: 0 } }
    }
  };
  /* @conditional-compile-remove(dtmf-dialer) */
  /**
   * Only render the dtmf dialer if the dialpad for PSTN calls is not present
   */
  if (props.onSetDialpadPage && allowDtmfDialer) {
    drawerMenuItems.push(dtmfDialerScreenOption);
  }

  const galleryLayoutOptions = {
    itemKey: 'galleryPositionKey',
    iconProps: {
      iconName: 'GalleryOptions',
      styles: { root: { lineHeight: 0 } }
    },
    disabled: props.disableButtonsForHoldScreen,
    text: localeStrings.strings.call.moreButtonGalleryControlLabel,
    subMenuProps: [
      {
        itemKey: 'dynamicSelectionKey',
        text: localeStrings.strings.call.moreButtonGalleryFloatingLocalLayoutLabel,
        onItemClick: () => {
          props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('floatingLocalVideo');
          onLightDismiss();
        },
        iconProps: {
          iconName: 'FloatingLocalVideoGalleryLayout',
          styles: { root: { lineHeight: 0 } }
        },
        secondaryIconProps: props.userSetGalleryLayout === 'floatingLocalVideo' ? { iconName: 'Accept' } : undefined
      },
      {
        itemKey: 'focusedContentSelectionKey',
        text: localeStrings.strings.call.moreButtonGalleryFocusedContentLayoutLabel,
        onItemClick: () => {
          props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('focusedContent');
          onLightDismiss();
        },
        iconProps: {
          iconName: 'FocusedContentGalleryLayout',
          styles: { root: { lineHeight: 0 } }
        },
        secondaryIconProps: props.userSetGalleryLayout === 'focusedContent' ? { iconName: 'Accept' } : undefined
      }
    ]
  };

  /* @conditional-compile-remove(gallery-layout-composite) */
  const galleryOption = {
    itemKey: 'defaultSelectionKey',
    text: localeStrings.strings.call.moreButtonGalleryDefaultLayoutLabel,
    onItemClick: () => {
      props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('default');
      onLightDismiss();
    },
    iconProps: {
      iconName: 'DefaultGalleryLayout',
      styles: { root: { lineHeight: 0 } }
    },
    secondaryIconProps: props.userSetGalleryLayout === 'default' ? { iconName: 'Accept' } : undefined
  };

  /* @conditional-compile-remove(gallery-layout-composite) */
  galleryLayoutOptions.subMenuProps?.push(galleryOption);

  drawerMenuItems.push(galleryLayoutOptions);

  if (drawerSelectionOptions !== false && isEnabled(drawerSelectionOptions?.peopleButton)) {
    drawerMenuItems.push({
      itemKey: 'people',
      id: 'call-composite-drawer-people-button',
      text: props.strings.peopleButtonLabel,
      iconProps: { iconName: 'MoreDrawerPeople' },
      onItemClick: props.onPeopleButtonClicked,
      disabled: isDisabled(drawerSelectionOptions.peopleButton) || props.disableButtonsForHoldScreen
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
        onLightDismiss();
      },
      iconProps: { iconName: 'HoldCallContextualMenuItem', styles: { root: { lineHeight: 0 } } }
    });
  }

  /*@conditional-compile-remove(rooms) */
  const role = callAdapter.getState().call?.role;
  /*@conditional-compile-remove(rooms) */
  const hideRaiseHandButtonInRoomsCall =
    callAdapter.getState().isRoomsCall && role && ['Consumer', 'Unknown'].includes(role);

  /* @conditional-compile-remove(raise-hand) */
  if (
    drawerSelectionOptions !== false &&
    isEnabled(drawerSelectionOptions?.raiseHandButton) &&
    /*@conditional-compile-remove(rooms) */ !hideRaiseHandButtonInRoomsCall
  ) {
    const raiseHandIcon = raiseHandButtonProps.checked ? 'LowerHandContextualMenuItem' : 'RaiseHandContextualMenuItem';
    drawerMenuItems.push({
      itemKey: 'raiseHandButtonKey',
      disabled: props.disableButtonsForHoldScreen || isDisabled(drawerSelectionOptions.raiseHandButton),
      text: raiseHandButtonProps.checked
        ? localeStrings.component.strings.raiseHandButton.onLabel
        : localeStrings.component.strings.raiseHandButton.offLabel,
      onItemClick: () => {
        if (raiseHandButtonProps.onToggleRaiseHand) {
          raiseHandButtonProps.onToggleRaiseHand();
        }
        onLightDismiss();
      },
      iconProps: {
        iconName: raiseHandIcon,
        styles: { root: { lineHeight: 0 } }
      }
    });
  }

  /* @conditional-compile-remove(close-captions) */
  //Captions drawer menu
  const supportedSpokenLanguageStrings = useLocale().strings.call.spokenLanguageStrings;

  /* @conditional-compile-remove(close-captions) */
  //Captions drawer menu
  const supportedCaptionLanguageStrings = useLocale().strings.call.captionLanguageStrings;
  /* @conditional-compile-remove(close-captions) */
  const captionSettingsProp = useAdaptedSelector(_captionSettingsSelector);
  /* @conditional-compile-remove(close-captions) */
  const startCaptionsButtonHandlers = useHandlers(_StartCaptionsButton);
  /* @conditional-compile-remove(close-captions) */
  const captionSettingsHandlers = useHandlers(_CaptionsSettingsModal);

  /* @conditional-compile-remove(close-captions) */
  const [isSpokenLanguageDrawerOpen, setIsSpokenLanguageDrawerOpen] = useState<boolean>(false);

  /* @conditional-compile-remove(close-captions) */
  const [isCaptionLanguageDrawerOpen, setIsCaptionLanguageDrawerOpen] = useState<boolean>(false);

  /* @conditional-compile-remove(close-captions) */
  const [currentSpokenLanguage, setCurrentSpokenLanguage] = useState<keyof SpokenLanguageStrings>(
    captionSettingsProp.currentSpokenLanguage ?? 'en-us'
  );

  /* @conditional-compile-remove(close-captions) */
  const [currentCaptionLanguage, setCurrentCaptionLanguage] = useState<keyof CaptionLanguageStrings>(
    captionSettingsProp.currentCaptionLanguage ?? _spokenLanguageToCaptionLanguage[currentSpokenLanguage]
  );

  /* @conditional-compile-remove(close-captions) */
  const onToggleChange = useCallback(async () => {
    if (!captionSettingsProp.isCaptionsFeatureActive) {
      await startCaptionsButtonHandlers.onStartCaptions({
        spokenLanguage: currentSpokenLanguage
      });
    } else {
      startCaptionsButtonHandlers.onStopCaptions();
    }
  }, [captionSettingsProp.isCaptionsFeatureActive, startCaptionsButtonHandlers, currentSpokenLanguage]);

  /* @conditional-compile-remove(close-captions) */
  if (props.isCaptionsSupported) {
    const captionsDrawerItems: DrawerMenuItemProps[] = [];

    const spokenLanguageString = supportedSpokenLanguageStrings
      ? supportedSpokenLanguageStrings[currentSpokenLanguage]
      : currentSpokenLanguage;
    const captionLanguageString = supportedCaptionLanguageStrings
      ? supportedCaptionLanguageStrings[currentCaptionLanguage]
      : currentCaptionLanguage;

    drawerMenuItems.push({
      itemKey: 'captions',
      id: 'common-call-composite-captions-button',
      disabled: props.disableButtonsForHoldScreen,
      text: props.strings.captionsMenuTitle,
      iconProps: { iconName: 'CaptionsIcon' },
      subMenuProps: captionsDrawerItems
    });

    captionsDrawerItems.push({
      itemKey: 'ToggleCaptionsKey',
      text: captionSettingsProp.isCaptionsFeatureActive
        ? localeStrings.strings.call.startCaptionsButtonTooltipOnContent
        : localeStrings.strings.call.startCaptionsButtonTooltipOffContent,
      iconProps: {
        iconName: captionSettingsProp.isCaptionsFeatureActive ? 'CaptionsOffIcon' : 'CaptionsIcon',
        styles: { root: { lineHeight: 0 } }
      },
      onItemClick: onToggleChange,
      disabled: props.disableButtonsForHoldScreen,
      secondaryComponent: (
        <Stack verticalFill verticalAlign="center">
          <Toggle
            id="common-call-composite-captions-toggle-button"
            checked={captionSettingsProp.isCaptionsFeatureActive}
            styles={themedToggleButtonStyle(theme, captionSettingsProp.isCaptionsFeatureActive)}
            onChange={onToggleChange}
          />
        </Stack>
      )
    });

    captionsDrawerItems.push({
      itemKey: 'ChangeSpokenLanguage',
      text: props.strings.spokenLanguageMenuTitle,
      id: 'common-call-composite-captions-spoken-settings-button',
      secondaryText: spokenLanguageString,
      iconProps: {
        iconName: 'ChangeSpokenLanguageIcon',
        styles: { root: { lineHeight: 0 } }
      },
      disabled: props.disableButtonsForHoldScreen || !captionSettingsProp.isCaptionsFeatureActive,
      onItemClick: () => {
        setIsSpokenLanguageDrawerOpen(true);
      },
      secondaryIconProps: {
        iconName: 'ChevronRight',
        styles: { root: { lineHeight: 0 } }
      }
    });

    captionsDrawerItems.push({
      itemKey: 'ChangeCaptionLanguage',
      text: props.strings.captionLanguageMenuTitle,
      id: 'common-call-composite-captions-subtitle-settings-button',
      secondaryText: captionLanguageString,
      iconProps: {
        iconName: 'ChangeCaptionLanguageIcon',
        styles: { root: { lineHeight: 0 } }
      },
      disabled: props.disableButtonsForHoldScreen || !captionSettingsProp.isCaptionsFeatureActive,
      onItemClick: () => {
        setIsCaptionLanguageDrawerOpen(true);
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
        <SpokenLanguageSettingsDrawer
          onLightDismiss={props.onLightDismiss}
          selectLanguage={setCurrentSpokenLanguage}
          setCurrentLanguage={captionSettingsHandlers.onSetSpokenLanguage}
          currentLanguage={currentSpokenLanguage}
          strings={{ menuTitle: props.strings.spokenLanguageMenuTitle }}
          supportedLanguageStrings={supportedSpokenLanguageStrings}
        />
      )}
      {isCaptionLanguageDrawerOpen && props.isCaptionsSupported && (
        <CaptionLanguageSettingsDrawer
          onLightDismiss={props.onLightDismiss}
          selectLanguage={setCurrentCaptionLanguage}
          setCurrentLanguage={captionSettingsHandlers.onSetCaptionLanguage}
          currentLanguage={currentCaptionLanguage}
          strings={{ menuTitle: props.strings.captionLanguageMenuTitle }}
          supportedLanguageStrings={supportedCaptionLanguageStrings}
        />
      )}
      {!isSpokenLanguageDrawerOpen && !isCaptionLanguageDrawerOpen && (
        <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />
      )}
    </>
  );

  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};

const isDeviceSelected = (speaker: OptionsDevice, selectedSpeaker?: OptionsDevice): boolean =>
  !!selectedSpeaker && speaker.id === selectedSpeaker.id;

const isEnabled = (option: unknown): boolean => option !== false;
