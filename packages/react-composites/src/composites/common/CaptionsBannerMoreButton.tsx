// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(close-captions) */
import { IContextualMenuItem } from '@fluentui/react';
/* @conditional-compile-remove(close-captions) */
import { ControlBarButtonProps, _StartCaptionsButton } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { useMemo } from 'react';
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
/** @private */
export interface CaptionsBannerMoreButtonProps extends ControlBarButtonProps {
  onCaptionsSettingsClick?: () => void;
}

/* @conditional-compile-remove(close-captions) */
/**
 *
 * @private
 */
export const CaptionsBannerMoreButton = (props: CaptionsBannerMoreButtonProps): JSX.Element => {
  const localeStrings = useLocale();

  const startCaptionsButtonProps = useAdaptedSelector(_startCaptionsButtonSelector);

  const startCaptionsButtonHandlers = useHandlers(_StartCaptionsButton);

  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.moreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.moreDrawerButtonTooltip
    }),
    [localeStrings]
  );

  const moreButtonContextualMenuItems: IContextualMenuItem[] = [];

  moreButtonContextualMenuItems.push({
    key: 'ToggleCaptionsKey',
    text: startCaptionsButtonProps.checked
      ? localeStrings.strings.call.startCaptionsButtonTooltipOnContent
      : localeStrings.strings.call.startCaptionsButtonTooltipOffContent,
    onClick: () => {
      startCaptionsButtonProps.checked
        ? startCaptionsButtonHandlers.onStopCaptions()
        : startCaptionsButtonProps.currentSpokenLanguage
        ? startCaptionsButtonHandlers.onStartCaptions({
            spokenLanguage: startCaptionsButtonProps.currentSpokenLanguage
          })
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

  if (props.onCaptionsSettingsClick) {
    moreButtonContextualMenuItems.push({
      key: 'openCaptionsSettingKey',
      text: localeStrings.strings.call.captionsSettingLabel,
      onClick: props.onCaptionsSettingsClick,
      iconProps: {
        iconName: 'SettingsIcon',
        styles: { root: { lineHeight: 0 } }
      },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: !startCaptionsButtonProps.checked
    });
  }

  return (
    <MoreButton
      {...props}
      data-ui-id="captions-banner-more-button"
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{ items: moreButtonContextualMenuItems }}
    />
  );
};

// This is a placeholder to bypass CC of "close-captions", remove when move the feature to stable
export {};
