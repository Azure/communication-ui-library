// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import {
  OptionsDevice,
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles,
  SpokenLanguageStrings,
  CaptionLanguageStrings
} from '@internal/react-components';
import { _ReactionDrawerMenuItem } from '@internal/react-components';
import { ReactionResources } from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
import { _StartCaptionsButton, _CaptionsSettingsModal } from '@internal/react-components';

import { HoldButton } from '@internal/react-components';
import { RaiseHandButton, RaiseHandButtonProps } from '@internal/react-components';
import { AudioDeviceInfo } from '@azure/communication-calling';
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallDrawerButtons,
  onFetchCustomButtonPropsTrampoline
} from '../ControlBar/CustomButton';
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';
import { useLocale } from '../../localization';
import { isDisabled } from '../../CallComposite/utils';
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';
import { Stack, Toggle, useTheme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { useAdaptedSelector } from '../../CallComposite/hooks/useAdaptedSelector';
import { _captionSettingsSelector, _startCaptionsButtonSelector } from '@internal/calling-component-bindings';
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
import { CaptionLanguageSettingsDrawer } from './CaptionLanguageSettingsDrawer';
import { themedToggleButtonStyle } from './MoreDrawer.styles';
import { _spokenLanguageToCaptionLanguage } from '@internal/react-components';
import { useAdapter } from '../../CallComposite/adapter/CallAdapterProvider';
import { useSelector } from '../../CallComposite/hooks/useSelector';
import { getTargetCallees } from '../../CallComposite/selectors/baseSelectors';
import { getTeamsMeetingCoordinates, getIsTeamsMeeting } from '../../CallComposite/selectors/baseSelectors';
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
  /**
   * Label for captions drawerMenuItem
   *
   * @remarks Only displayed when in Teams call
   */
  captionsMenuTitle: string;
  /**
   * Label for spokenLanguage drawerMenuItem
   *
   * @remarks Only displayed when in Teams call, disabled until captions is on
   */
  spokenLanguageMenuTitle: string;

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
  /**
   * Callback to hide and show the dialpad in the more drawer
   */
  onSetDialpadPage?: () => void;
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
  isCaptionsSupported?: boolean;
  strings: MoreDrawerStrings;
  disableButtonsForHoldScreen?: boolean;
  useTeamsCaptions?: boolean;
  reactionResources?: ReactionResources;
  onReactionClick?: (reaction: string) => Promise<void>;
  onClickMeetingPhoneInfo?: () => void;
  onMuteAllRemoteParticipants?: () => void;
  /* @conditional-compile-remove(media-access) */
  onForbidOthersAudio?: () => void;
  /* @conditional-compile-remove(media-access) */
  onPermitOthersAudio?: () => void;
  /* @conditional-compile-remove(media-access) */
  onForbidOthersVideo?: () => void;
  /* @conditional-compile-remove(media-access) */
  onPermitOthersVideo?: () => void;
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
  const theme = useTheme();
  const callAdapter = useAdapter();
  const drawerMenuItems: DrawerMenuItemProps[] = [];

  const { speakers, onSelectSpeaker, onLightDismiss } = props;

  const localeStrings = useLocale();
  const holdButtonProps = usePropsFor(HoldButton);

  const callees = useSelector(getTargetCallees);
  const allowDtmfDialer = showDtmfDialer(callees);
  const [dtmfDialerChecked, setDtmfDialerChecked] = useState<boolean>(props.dtmfDialerPresent ?? false);

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

  const showCaptionsButton =
    props.isCaptionsSupported && drawerSelectionOptions !== false && isEnabled(drawerSelectionOptions.captionsButton);

  if (props.reactionResources !== undefined) {
    drawerMenuItems.push({
      itemKey: 'reactions',
      onRendererContent: () => (
        <_ReactionDrawerMenuItem
          onReactionClick={async (reaction) => {
            props.onReactionClick?.(reaction);
            onLightDismiss();
          }}
          reactionResources={props.reactionResources}
        />
      )
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
  /**
   * Only render the dtmf dialer if the dialpad for PSTN calls is not present
   */
  if (
    props.onSetDialpadPage &&
    allowDtmfDialer &&
    drawerSelectionOptions !== false &&
    isEnabled(drawerSelectionOptions.dtmfDialerButton)
  ) {
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

  if (drawerSelectionOptions !== false && isEnabled(drawerSelectionOptions?.galleryControlsButton)) {
    drawerMenuItems.push(galleryLayoutOptions);
  }
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

  const role = callAdapter.getState().call?.role;
  const hideRaiseHandButtonInRoomsCall =
    callAdapter.getState().isRoomsCall && role && ['Consumer', 'Unknown'].includes(role);

  if (
    drawerSelectionOptions !== false &&
    isEnabled(drawerSelectionOptions?.raiseHandButton) &&
    !hideRaiseHandButtonInRoomsCall
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

  const isTeamsMeeting = getIsTeamsMeeting(callAdapter.getState());

  const teamsMeetingCoordinates = getTeamsMeetingCoordinates(callAdapter.getState());

  if (
    drawerSelectionOptions !== false &&
    isEnabled(drawerSelectionOptions?.teamsMeetingPhoneCallButton) &&
    isTeamsMeeting &&
    teamsMeetingCoordinates
  ) {
    drawerMenuItems.push({
      itemKey: 'phoneCallInfoKey',
      disabled: isDisabled(drawerSelectionOptions.teamsMeetingPhoneCallButton),
      text: localeStrings.strings.call.phoneCallMoreButtonLabel,
      onItemClick: () => {
        props.onClickMeetingPhoneInfo?.();
        onLightDismiss();
      },
      iconProps: {
        iconName: 'PhoneNumberButton',
        styles: { root: { lineHeight: 0 } }
      }
    });
  }

  //Captions drawer menu
  const supportedSpokenLanguageStrings = useLocale().strings.call.spokenLanguageStrings;

  //Captions drawer menu
  const supportedCaptionLanguageStrings = useLocale().strings.call.captionLanguageStrings;

  const captionSettingsProp = useAdaptedSelector(_captionSettingsSelector);

  const startCaptionsButtonHandlers = useHandlers(_StartCaptionsButton);

  const captionSettingsHandlers = useHandlers(_CaptionsSettingsModal);

  const [isSpokenLanguageDrawerOpen, setIsSpokenLanguageDrawerOpen] = useState<boolean>(false);

  const [isCaptionLanguageDrawerOpen, setIsCaptionLanguageDrawerOpen] = useState<boolean>(false);

  const [currentSpokenLanguage, setCurrentSpokenLanguage] = useState<keyof SpokenLanguageStrings>(
    captionSettingsProp.currentSpokenLanguage ?? 'en-us'
  );

  const [currentCaptionLanguage, setCurrentCaptionLanguage] = useState<keyof CaptionLanguageStrings>(
    captionSettingsProp.currentCaptionLanguage ?? _spokenLanguageToCaptionLanguage[currentSpokenLanguage]
  );

  const onToggleChange = useCallback(async () => {
    if (!captionSettingsProp.isCaptionsFeatureActive) {
      await startCaptionsButtonHandlers.onStartCaptions({
        spokenLanguage: currentSpokenLanguage
      });
    } else {
      startCaptionsButtonHandlers.onStopCaptions();
    }
  }, [captionSettingsProp.isCaptionsFeatureActive, startCaptionsButtonHandlers, currentSpokenLanguage]);

  if (showCaptionsButton) {
    const captionsDrawerItems: DrawerMenuItemProps[] = [];

    const spokenLanguageString = supportedSpokenLanguageStrings
      ? supportedSpokenLanguageStrings[currentSpokenLanguage]
      : currentSpokenLanguage;

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

    if (props.useTeamsCaptions) {
      const captionLanguageString = supportedCaptionLanguageStrings
        ? supportedCaptionLanguageStrings[currentCaptionLanguage]
        : currentCaptionLanguage;

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
  }

  const customDrawerButtons = useMemo(
    () =>
      generateCustomCallDrawerButtons(
        onFetchCustomButtonPropsTrampoline(drawerSelectionOptions !== false ? drawerSelectionOptions : undefined),
        drawerSelectionOptions !== false ? drawerSelectionOptions?.displayType : undefined
      ),
    [drawerSelectionOptions]
  );

  customDrawerButtons['primary'].slice(CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_MOBILE_CUSTOM_BUTTONS).forEach((element) => {
    drawerMenuItems.push(element);
  });
  customDrawerButtons['secondary'].forEach((element) => {
    drawerMenuItems.push(element);
  });
  customDrawerButtons['overflow'].forEach((element) => {
    drawerMenuItems.push(element);
  });

  return (
    <>
      {isSpokenLanguageDrawerOpen && showCaptionsButton && (
        <SpokenLanguageSettingsDrawer
          onLightDismiss={props.onLightDismiss}
          selectLanguage={setCurrentSpokenLanguage}
          setCurrentLanguage={captionSettingsHandlers.onSetSpokenLanguage}
          currentLanguage={currentSpokenLanguage}
          strings={{ menuTitle: props.strings.spokenLanguageMenuTitle }}
          supportedLanguageStrings={supportedSpokenLanguageStrings}
        />
      )}
      {isCaptionLanguageDrawerOpen && showCaptionsButton && (
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
};

const isDeviceSelected = (speaker: OptionsDevice, selectedSpeaker?: OptionsDevice): boolean =>
  !!selectedSpeaker && speaker.id === selectedSpeaker.id;

const isEnabled = (option: unknown): boolean => option !== false;
