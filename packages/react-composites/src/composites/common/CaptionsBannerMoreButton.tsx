// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ControlBarButtonProps } from '@internal/react-components';
import { useCallback } from 'react';
import { IContextualMenuItem } from '@fluentui/react';
import { StartCaptionsButton } from '@internal/react-components';
import { useMemo } from 'react';
import { buttonFlyoutIncreasedSizeStyles } from '../CallComposite/styles/Buttons.styles';
import { useLocale } from '../localization';
import { MoreButton } from './MoreButton';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';

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
  const startCaptionsButtonProps = usePropsFor(StartCaptionsButton);
  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.captionsBannerMoreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.call.captionsBannerMoreButtonTooltip
    }),
    [localeStrings]
  );

  const moreButtonContextualMenuItems: IContextualMenuItem[] = [];

  const startCaptions = useCallback(async () => {
    await startCaptionsButtonProps.onStartCaptions({
      spokenLanguage: startCaptionsButtonProps.currentSpokenLanguage
    });
  }, [startCaptionsButtonProps]);

  const stopCaptions = useCallback(async () => {
    await startCaptionsButtonProps.onStopCaptions();
  }, [startCaptionsButtonProps]);

  moreButtonContextualMenuItems.push({
    key: 'ToggleCaptionsKey',
    text: startCaptionsButtonProps.checked
      ? localeStrings.strings.call.startCaptionsButtonTooltipOnContent
      : localeStrings.strings.call.startCaptionsButtonTooltipOffContent,
    onClick: () => {
      startCaptionsButtonProps.checked
        ? stopCaptions()
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
};
