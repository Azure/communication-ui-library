// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { ControlBarButtonProps } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { useCallback } from 'react';
/* @conditional-compile-remove(close-captions) */
import { IContextualMenuItem } from '@fluentui/react';
/* @conditional-compile-remove(close-captions) */
import { _StartCaptionsButton } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { useMemo, useEffect } from 'react';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { buttonFlyoutIncreasedSizeStyles } from '../CallComposite/styles/Buttons.styles';
/* @conditional-compile-remove(close-captions) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(close-captions) */
import { MoreButton } from './MoreButton';
/* @conditional-compile-remove(close-captions) */
import { _startCaptionsButtonSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(close-captions) */
import { _preventDismissOnEvent } from '@internal/acs-ui-common';

/** @private */
export interface CaptionsBannerMoreButtonProps extends ControlBarButtonProps {
  onCaptionsSettingsClick?: () => void;
}

/**
 *
 * @private
 */
export const CaptionsBannerMoreButton = (props: CaptionsBannerMoreButtonProps): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const localeStrings = useLocale();
  /* @conditional-compile-remove(close-captions) */
  const startCaptionsButtonProps = useAdaptedSelector(_startCaptionsButtonSelector);
  /* @conditional-compile-remove(close-captions) */
  const startCaptionsButtonHandlers = useHandlers(_StartCaptionsButton);
  /* @conditional-compile-remove(close-captions) */
  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.captionsBannerMoreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.call.captionsBannerMoreButtonTooltip
    }),
    [localeStrings]
  );
  /* @conditional-compile-remove(close-captions) */
  const moreButtonContextualMenuItems: IContextualMenuItem[] = [];
  /* @conditional-compile-remove(close-captions) */
  useEffect(() => {
    if (startCaptionsButtonProps.checked) {
      // set spoken language when start captions with a spoken language specified.
      // this is to fix the bug when a second user starts captions with a new spoken language, captions bot ignore that spoken language
      startCaptionsButtonHandlers.onSetSpokenLanguage(startCaptionsButtonProps.currentSpokenLanguage);
    }
  }, [startCaptionsButtonProps.checked]);

  /* @conditional-compile-remove(close-captions) */
  const startCaptions = useCallback(async () => {
    await startCaptionsButtonHandlers.onStartCaptions({
      spokenLanguage: startCaptionsButtonProps.currentSpokenLanguage
    });
  }, [startCaptionsButtonHandlers, startCaptionsButtonProps.currentSpokenLanguage]);

  /* @conditional-compile-remove(close-captions) */
  moreButtonContextualMenuItems.push({
    key: 'ToggleCaptionsKey',
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
    }
  });
  /* @conditional-compile-remove(close-captions) */
  if (props.onCaptionsSettingsClick) {
    moreButtonContextualMenuItems.push({
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
      disabled: !startCaptionsButtonProps.checked
    });
  }
  /* @conditional-compile-remove(close-captions) */
  return (
    <MoreButton
      {...props}
      data-ui-id="captions-banner-more-button"
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
  return <></>;
};
