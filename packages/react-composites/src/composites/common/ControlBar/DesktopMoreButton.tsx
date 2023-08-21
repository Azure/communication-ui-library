// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem } from '@fluentui/react';
/* @conditional-compile-remove(gallery-layouts) */
import { ContextualMenuItemType } from '@fluentui/react';
import { ControlBarButtonProps } from '@internal/react-components';
/* @conditional-compile-remove(gallery-layouts) */
import { VideoGalleryLayout } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _StartCaptionsButton } from '@internal/react-components';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
import React from 'react';
/* @conditional-compile-remove(gallery-layouts) */
import { useState } from 'react';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
import { useMemo, useCallback } from 'react';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { buttonFlyoutIncreasedSizeStyles } from '../../CallComposite/styles/Buttons.styles';
import { MoreButton } from '../MoreButton';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(control-bar-button-injection) */
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';
/* @conditional-compile-remove(control-bar-button-injection) */
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallDesktopOverflowButtons,
  onFetchCustomButtonPropsTrampoline
} from './CustomButton';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { _startCaptionsButtonSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../../CallComposite/hooks/useAdaptedSelector';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';

/** @private */
export interface DesktopMoreButtonProps extends ControlBarButtonProps {
  disableButtonsForHoldScreen?: boolean;
  onClickShowDialpad?: () => void;
  /* @conditional-compile-remove(close-captions) */
  isCaptionsSupported?: boolean;
  /* @conditional-compile-remove(control-bar-button-injection) */
  callControls?: boolean | CommonCallControlOptions;
  onCaptionsSettingsClick?: () => void;
  /* @conditional-compile-remove(gallery-layouts) */
  onUserSetOverflowGalleryPositionChange?: (position: 'Responsive' | 'HorizontalTop') => void;
  /* @conditional-compile-remove(gallery-layouts) */
  onUserSetGalleryLayout?: (layout: VideoGalleryLayout) => void;
  /* @conditional-compile-remove(gallery-layouts) */
  userSetGalleryLayout?: VideoGalleryLayout;
}

/**
 *
 * @private
 */
export const DesktopMoreButton = (props: DesktopMoreButtonProps): JSX.Element => {
  /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
  const localeStrings = useLocale();
  /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);
  /* @conditional-compile-remove(close-captions) */
  const startCaptionsButtonProps = useAdaptedSelector(_startCaptionsButtonSelector);
  /* @conditional-compile-remove(close-captions) */
  const startCaptionsButtonHandlers = useHandlers(_StartCaptionsButton);
  /* @conditional-compile-remove(close-captions) */
  const startCaptions = useCallback(async () => {
    await startCaptionsButtonHandlers.onStartCaptions({
      spokenLanguage: startCaptionsButtonProps.currentSpokenLanguage
    });
  }, [startCaptionsButtonHandlers, startCaptionsButtonProps.currentSpokenLanguage]);

  /* @conditional-compile-remove(gallery-layouts) */
  const [galleryPositionTop, setGalleryPositionTop] = useState<boolean>(false);
  /* @conditional-compile-remove(gallery-layouts) */
  const [focusedContentOn, setFocusedContentOn] = useState<boolean>(false);
  /* @conditional-compile-remove(gallery-layouts) */
  const [previousLayout, setPreviousLayout] = useState<VideoGalleryLayout>(
    props.userSetGalleryLayout ?? 'floatingLocalVideo'
  );

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.moreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.moreDrawerButtonTooltip
    }),
    [localeStrings]
  );

  const moreButtonContextualMenuItems: IContextualMenuItem[] = [];

  /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(gallery-layouts) */
  const menuSubIconStyleSet = {
    root: {
      height: 'unset',
      lineHeight: '100%',
      width: '1.25rem'
    }
  };

  /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
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

  // is captions feature is active
  /* @conditional-compile-remove(close-captions) */
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
          ? startCaptionsButtonHandlers.onStopCaptions()
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

  /*@conditional-compile-remove(PSTN-calls) */
  if (props.onClickShowDialpad) {
    moreButtonContextualMenuItems.push({
      key: 'showDialpadKey',
      text: localeStrings.strings.callWithChat.openDtmfDialpadLabel,
      onClick: () => {
        props.onClickShowDialpad && props.onClickShowDialpad();
      },
      iconProps: { iconName: 'Dialpad', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: props.disableButtonsForHoldScreen
    });
  }

  /* @conditional-compile-remove(gallery-layouts) */
  if (props.onUserSetOverflowGalleryPositionChange) {
    moreButtonContextualMenuItems.push({
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
      subMenuProps: {
        items: [
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
          },
          { key: 'dividerLayoutsKey', itemType: ContextualMenuItemType.Divider },
          {
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
                props.onUserSetOverflowGalleryPositionChange &&
                  props.onUserSetOverflowGalleryPositionChange('HorizontalTop');
                setGalleryPositionTop(true);
              } else {
                props.onUserSetOverflowGalleryPositionChange &&
                  props.onUserSetOverflowGalleryPositionChange('Responsive');
                setGalleryPositionTop(false);
              }
            }
          }
        ]
      }
    });
  }

  /* @conditional-compile-remove(control-bar-button-injection) */
  const customDrawerButtons = useMemo(
    () =>
      generateCustomCallDesktopOverflowButtons(
        onFetchCustomButtonPropsTrampoline(typeof props.callControls === 'object' ? props.callControls : undefined),
        typeof props.callControls === 'object' ? props.callControls.displayType : undefined
      ),
    [props.callControls]
  );

  /* @conditional-compile-remove(control-bar-button-injection) */
  customDrawerButtons['primary'].slice(CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_DESKTOP_CUSTOM_BUTTONS).forEach((element) => {
    moreButtonContextualMenuItems.push({
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      ...element
    });
  });
  /* @conditional-compile-remove(control-bar-button-injection) */
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

  /* @conditional-compile-remove(control-bar-button-injection) */
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
      /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{
        items: moreButtonContextualMenuItems,
        calloutProps: {
          preventDismissOnEvent: _preventDismissOnEvent
        }
      }}
    />
  );
};
