// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IContextualMenuItem } from '@fluentui/react';
import { ControlBarButtonProps } from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
import { HoldButton } from '@internal/react-components';
import { StartCaptionsButton } from '@internal/react-components';
import React from 'react';
import { useState } from 'react';
import { useMemo, useCallback } from 'react';
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';
import { buttonFlyoutIncreasedSizeStyles } from '../../CallComposite/styles/Buttons.styles';
import { MoreButton } from '../MoreButton';
import { useLocale } from '../../localization';
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallDesktopOverflowButtons,
  onFetchCustomButtonPropsTrampoline
} from './CustomButton';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';
import { showDtmfDialer } from '../../CallComposite/utils/MediaGalleryUtils';
import { useSelector } from '../../CallComposite/hooks/useSelector';
import { getTargetCallees } from '../../CallComposite/selectors/baseSelectors';
/* @conditional-compile-remove(together-mode) */
import { getIsTogetherModeActive, getCapabilites, getLocalUserId } from '../../CallComposite/selectors/baseSelectors';
import { getTeamsMeetingCoordinates, getIsTeamsMeeting } from '../../CallComposite/selectors/baseSelectors';
import { CallControlOptions } from '../../CallComposite';

/** @private */
export interface DesktopMoreButtonProps extends ControlBarButtonProps {
  disableButtonsForHoldScreen?: boolean;
  onClickShowDialpad?: () => void;
  isCaptionsSupported?: boolean;
  callControls?: boolean | CommonCallControlOptions;
  onCaptionsSettingsClick?: () => void;
  onUserSetOverflowGalleryPositionChange?: (position: 'Responsive' | 'horizontalTop') => void;
  onUserSetGalleryLayout?: (layout: VideoGalleryLayout) => void;
  userSetGalleryLayout?: VideoGalleryLayout;
  onSetDialpadPage?: () => void;
  dtmfDialerPresent?: boolean;
  teamsMeetingPhoneCallEnable?: boolean;
  onMeetingPhoneInfoClick?: () => void;
}

/**
 *
 * @private
 */
export const DesktopMoreButton = (props: DesktopMoreButtonProps): JSX.Element => {
  const localeStrings = useLocale();
  const holdButtonProps = usePropsFor(HoldButton);
  const startCaptionsButtonProps = usePropsFor(StartCaptionsButton);
  const startCaptions = useCallback(async () => {
    await startCaptionsButtonProps.onStartCaptions({
      spokenLanguage: startCaptionsButtonProps.currentSpokenLanguage
    });
  }, [startCaptionsButtonProps]);

  /* @conditional-compile-remove(overflow-top-composite) */
  const [galleryPositionTop, setGalleryPositionTop] = useState<boolean>(false);
  const [focusedContentOn, setFocusedContentOn] = useState<boolean>(false);
  const [previousLayout, setPreviousLayout] = useState<VideoGalleryLayout>(
    props.userSetGalleryLayout ?? 'floatingLocalVideo'
  );

  const callees = useSelector(getTargetCallees);
  const allowDtmfDialer = showDtmfDialer(callees);

  const isTeamsMeeting = useSelector(getIsTeamsMeeting);
  const teamsMeetingCoordinates = useSelector(getTeamsMeetingCoordinates);
  /* @conditional-compile-remove(together-mode) */
  const isTogetherModeActive = useSelector(getIsTogetherModeActive);
  /* @conditional-compile-remove(together-mode) */
  const participantCapability = useSelector(getCapabilites);
  /* @conditional-compile-remove(together-mode) */
  const participantId = useSelector(getLocalUserId);

  const [dtmfDialerChecked, setDtmfDialerChecked] = useState<boolean>(props.dtmfDialerPresent ?? false);

  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.moreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.moreDrawerButtonTooltip
    }),
    [localeStrings]
  );

  const moreButtonContextualMenuItems: IContextualMenuItem[] = [];

  const menuSubIconStyleSet = {
    root: {
      height: 'unset',
      lineHeight: '100%',
      width: '1.25rem'
    }
  };

  if (props.callControls === true || (props.callControls as CallControlOptions)?.holdButton !== false) {
    moreButtonContextualMenuItems.push({
      key: 'holdButtonKey',
      text: localeStrings.component.strings.holdButton.tooltipOffContent,
      onClick: () => {
        holdButtonProps.onToggleHold();
      },
      iconProps: { iconName: 'HoldCallContextualMenuItem', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: props.disableButtonsForHoldScreen
    });
  }

  // is captions feature is active
  if (props.isCaptionsSupported) {
    const captionsContextualMenuItems: IContextualMenuItem[] = [];

    moreButtonContextualMenuItems.push({
      key: 'liveCaptionsKey',
      id: 'common-call-composite-captions-button',
      text: localeStrings.strings.call.liveCaptionsLabel,
      iconProps: { iconName: 'CaptionsIcon', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: props.disableButtonsForHoldScreen,
      subMenuProps: {
        id: 'captions-contextual-menu',
        items: captionsContextualMenuItems,
        calloutProps: {
          preventDismissOnEvent: _preventDismissOnEvent
        }
      },
      submenuIconProps: {
        iconName: 'HorizontalGalleryRightButton',
        styles: menuSubIconStyleSet
      }
    });

    captionsContextualMenuItems.push({
      key: 'ToggleCaptionsKey',
      id: 'common-call-composite-captions-toggle-button',
      text: startCaptionsButtonProps.checked
        ? localeStrings.strings.call.startCaptionsButtonTooltipOnContent
        : localeStrings.strings.call.startCaptionsButtonTooltipOffContent,
      onClick: () => {
        startCaptionsButtonProps.checked
          ? startCaptionsButtonProps.onStopCaptions()
          : startCaptionsButtonProps.currentSpokenLanguage !== ''
            ? startCaptions()
            : props.onCaptionsSettingsClick && props.onCaptionsSettingsClick();
      },
      iconProps: {
        iconName: startCaptionsButtonProps.checked ? 'CaptionsOffIcon' : 'CaptionsIcon',
        styles: { root: { lineHeight: 0 } }
      },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: props.disableButtonsForHoldScreen
    });

    if (props.onCaptionsSettingsClick) {
      captionsContextualMenuItems.push({
        key: 'openCaptionsSettingsKey',
        id: 'common-call-composite-captions-settings-button',
        text: localeStrings.strings.call.captionsSettingsLabel,
        onClick: props.onCaptionsSettingsClick,
        iconProps: {
          iconName: 'CaptionsSettingsIcon',
          styles: { root: { lineHeight: 0 } }
        },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        disabled: props.disableButtonsForHoldScreen || !startCaptionsButtonProps.checked
      });
    }
  }

  const dtmfDialerScreenOption = {
    key: 'dtmfDialerScreenKey',
    itemProps: {
      styles: buttonFlyoutIncreasedSizeStyles
    },
    text: !dtmfDialerChecked
      ? localeStrings.strings.call.dtmfDialerMoreButtonLabelOn
      : localeStrings.strings.call.dtmfDialerMoreButtonLabelOff,
    onClick: () => {
      props.onSetDialpadPage && props.onSetDialpadPage();
      setDtmfDialerChecked(!dtmfDialerChecked);
    },
    iconProps: {
      iconName: 'DtmfDialpadButton',
      styles: { root: { lineHeight: 0 } }
    }
  };
  /**
   * Only render the dtmf dialer if the dialpad for PSTN calls is not present
   */
  if (props.onSetDialpadPage && allowDtmfDialer) {
    if (props.callControls === true || (props.callControls as CallControlOptions)?.dtmfDialerButton !== false) {
      moreButtonContextualMenuItems.push(dtmfDialerScreenOption);
    }
  }

  const joinByPhoneOption = {
    key: 'phoneCallKey',
    itemProps: {
      styles: buttonFlyoutIncreasedSizeStyles
    },
    text: localeStrings.strings.call.phoneCallMoreButtonLabel,
    onClick: () => {
      props.onMeetingPhoneInfoClick && props.onMeetingPhoneInfoClick();
    },
    iconProps: {
      iconName: 'PhoneNumberButton',
      styles: { root: { lineHeight: 0 } }
    }
  };
  /**
   * Only render the phone call button if meeting conordinates are present
   */
  if (props.teamsMeetingPhoneCallEnable && isTeamsMeeting && teamsMeetingCoordinates) {
    moreButtonContextualMenuItems.push(joinByPhoneOption);
  }

  if (props.onUserSetOverflowGalleryPositionChange) {
    const galleryOptions = {
      key: 'overflowGalleryPositionKey',
      iconProps: {
        iconName: 'GalleryOptions',
        styles: { root: { lineHeight: 0 } }
      },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      submenuIconProps: {
        styles: menuSubIconStyleSet
      },
      text: localeStrings.strings.call.moreButtonGalleryControlLabel,
      disabled: props.disableButtonsForHoldScreen,
      subMenuProps: {
        items: [
          {
            key: 'dynamicSelectionKey',
            text: localeStrings.strings.call.moreButtonGalleryFloatingLocalLayoutLabel,
            canCheck: true,
            itemProps: {
              styles: buttonFlyoutIncreasedSizeStyles
            },
            isChecked: props.userSetGalleryLayout === 'floatingLocalVideo',
            onClick: () => {
              props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('floatingLocalVideo');
              setFocusedContentOn(false);
            },
            iconProps: {
              iconName: 'FloatingLocalVideoGalleryLayout',
              styles: { root: { lineHeight: 0 } }
            }
          },
          {
            key: 'speakerSelectionKey',
            text: localeStrings.strings.call.moreButtonGallerySpeakerLayoutLabel,
            canCheck: true,
            itemProps: {
              styles: buttonFlyoutIncreasedSizeStyles
            },
            isChecked: props.userSetGalleryLayout === 'speaker',
            onClick: () => {
              props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('speaker');
              setFocusedContentOn(false);
            },
            iconProps: {
              iconName: 'SpeakerGalleryLayout',
              styles: { root: { lineHeight: 0 } }
            }
          },
          {
            key: 'focusedContentSelectionKey',
            text: localeStrings.strings.call.moreButtonGalleryFocusedContentLayoutLabel,
            canCheck: true,
            itemProps: {
              styles: buttonFlyoutIncreasedSizeStyles
            },
            isChecked: focusedContentOn,
            onClick: () => {
              if (focusedContentOn === false) {
                setPreviousLayout(props.userSetGalleryLayout ?? 'floatingLocalVideo');
                props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('focusedContent');
                setFocusedContentOn(true);
              } else {
                props.onUserSetGalleryLayout && props.onUserSetGalleryLayout(previousLayout);
                setFocusedContentOn(false);
              }
            },
            iconProps: {
              iconName: 'FocusedContentGalleryLayout',
              styles: { root: { lineHeight: 0 } }
            }
          }
        ],
        calloutProps: {
          preventDismissOnEvent: _preventDismissOnEvent
        }
      }
    };

    /* @conditional-compile-remove(gallery-layout-composite) */
    const galleryOption = {
      key: 'defaultSelectionKey',
      text: localeStrings.strings.call.moreButtonGalleryDefaultLayoutLabel,
      canCheck: true,
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      isChecked: props.userSetGalleryLayout === 'default',
      onClick: () => {
        props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('default');
        setFocusedContentOn(false);
      },
      iconProps: {
        iconName: 'DefaultGalleryLayout',
        styles: { root: { lineHeight: 0 } }
      }
    };
    /* @conditional-compile-remove(large-gallery) */
    const largeGalleryOption = {
      key: 'largeGallerySelectionKey',
      text: localeStrings.strings.call.moreButtonLargeGalleryDefaultLayoutLabel,
      canCheck: true,
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      isChecked: props.userSetGalleryLayout === 'largeGallery',
      onClick: () => {
        props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('largeGallery');
        setFocusedContentOn(false);
      },
      iconProps: {
        iconName: 'LargeGalleryLayout',
        styles: { root: { lineHeight: 0 } }
      }
    };

    /* @conditional-compile-remove(together-mode) */
    const togetherModeOption = {
      key: 'togetherModeSelectionKey',
      text: localeStrings.strings.call.moreButtonTogetherModeLayoutLabel,
      canCheck: true,
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      isChecked: props.userSetGalleryLayout === 'togetherMode',
      onClick: () => {
        props.onUserSetGalleryLayout && props.onUserSetGalleryLayout('togetherMode');
        setFocusedContentOn(false);
      },
      disabled: !(
        (participantId?.kind === 'microsoftTeamsUser' && participantCapability?.startTogetherMode?.isPresent) ||
        isTogetherModeActive
      ),
      iconProps: {
        iconName: 'LargeGalleryLayout',
        styles: { root: { lineHeight: 0 } }
      }
    };

    /* @conditional-compile-remove(overflow-top-composite) */
    const overflowGalleryOption = {
      key: 'topKey',
      text: localeStrings.strings.call.moreButtonGalleryPositionToggleLabel,
      canCheck: true,
      topDivider: true,
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      iconProps: {
        iconName: 'OverflowGalleryTop',
        styles: { root: { lineHeight: 0 } }
      },
      isChecked: galleryPositionTop,
      onClick: () => {
        if (galleryPositionTop === false) {
          props.onUserSetOverflowGalleryPositionChange && props.onUserSetOverflowGalleryPositionChange('horizontalTop');
          setGalleryPositionTop(true);
        } else {
          props.onUserSetOverflowGalleryPositionChange && props.onUserSetOverflowGalleryPositionChange('Responsive');
          setGalleryPositionTop(false);
        }
      }
    };
    /* @conditional-compile-remove(large-gallery) */
    galleryOptions.subMenuProps?.items?.push(largeGalleryOption);
    /* @conditional-compile-remove(gallery-layout-composite) */
    galleryOptions.subMenuProps?.items?.push(galleryOption);
    /* @conditional-compile-remove(overflow-top-composite) */
    galleryOptions.subMenuProps?.items?.push(overflowGalleryOption);
    /* @conditional-compile-remove(together-mode) */
    galleryOptions.subMenuProps?.items?.push(togetherModeOption);
    if (props.callControls === true || (props.callControls as CallControlOptions)?.galleryControlsButton !== false) {
      moreButtonContextualMenuItems.push(galleryOptions);
    }
  }

  const customDrawerButtons = useMemo(
    () =>
      generateCustomCallDesktopOverflowButtons(
        onFetchCustomButtonPropsTrampoline(typeof props.callControls === 'object' ? props.callControls : undefined),
        typeof props.callControls === 'object' ? props.callControls.displayType : undefined
      ),
    [props.callControls]
  );

  customDrawerButtons['primary'].slice(CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_DESKTOP_CUSTOM_BUTTONS).forEach((element) => {
    moreButtonContextualMenuItems.push({
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      ...element
    });
  });

  customDrawerButtons['secondary']
    .slice(CUSTOM_BUTTON_OPTIONS.MAX_SECONDARY_DESKTOP_CUSTOM_BUTTONS)
    .forEach((element) => {
      moreButtonContextualMenuItems.push({
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        ...element
      });
    });

  customDrawerButtons['overflow'].forEach((element) => {
    moreButtonContextualMenuItems.push({
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      ...element
    });
  });

  return (
    <MoreButton
      {...props}
      data-ui-id="common-call-composite-more-button"
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{
        shouldFocusOnContainer: false,
        items: moreButtonContextualMenuItems,
        calloutProps: {
          preventDismissOnEvent: _preventDismissOnEvent
        }
      }}
    />
  );
};
