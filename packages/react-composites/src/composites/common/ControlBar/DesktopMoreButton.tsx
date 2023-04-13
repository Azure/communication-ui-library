// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem } from '@fluentui/react';
import { ControlBarButtonProps } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _StartCaptionsButton } from '@internal/react-components';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
import React from 'react';
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
    // set spoken language when start captions with a spoken language specified.
    // this is to fix the bug when a second user starts captions with a new spoken language, captions bot ignore that spoken language
    startCaptionsButtonHandlers.onSetSpokenLanguage(startCaptionsButtonProps.currentSpokenLanguage);
  }, [startCaptionsButtonHandlers, startCaptionsButtonProps.currentSpokenLanguage]);

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.moreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.moreDrawerButtonTooltip
    }),
    [localeStrings]
  );

  const moreButtonContextualMenuItems: IContextualMenuItem[] = [];

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

    const menuSubIconStyleSet = {
      root: {
        height: 'unset',
        lineHeight: '100%',
        width: '1.25rem'
      }
    };

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
