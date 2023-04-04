// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem } from '@fluentui/react';
import { ControlBarButtonProps, _StartCaptionsButton } from '@internal/react-components';
import React from 'react';
import { useMemo } from 'react';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { buttonFlyoutIncreasedSizeStyles } from '../CallComposite/styles/Buttons.styles';
import { useLocale } from '../localization';
import { MoreButton } from './MoreButton';

/** @private */
export interface CaptionsBannerMoreButtonProps extends ControlBarButtonProps {
  onCaptionsSettingsClick?: () => void;
}

/**
 *
 * @private
 */
export const CaptionsBannerMoreButton = (props: CaptionsBannerMoreButtonProps): JSX.Element => {
  const localeStrings = useLocale();

  const startCaptionsButtonProps = usePropsFor(_StartCaptionsButton);

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
      ? localeStrings.component.strings.startCaptionsButton.tooltipOnContent
      : localeStrings.component.strings.startCaptionsButton.tooltipOffContent,
    onClick: () => {
      startCaptionsButtonProps.checked
        ? startCaptionsButtonProps.onStopCaptions()
        : startCaptionsButtonProps.currentSpokenLanguage
        ? startCaptionsButtonProps.onStartCaptions({
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
