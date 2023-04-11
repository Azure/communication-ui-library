// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem } from '@fluentui/react';
import { ControlBarButtonProps } from '@internal/react-components';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
import React from 'react';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { useMemo } from 'react';
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

/** @private */
export interface DesktopMoreButtonProps extends ControlBarButtonProps {
  disableButtonsForHoldScreen?: boolean;
  onClickShowDialpad?: () => void;
  /* @conditional-compile-remove(control-bar-button-injection) */
  callControls?: boolean | CommonCallControlOptions;
}

/**
 *
 * @private
 */
export const DesktopMoreButton = (props: DesktopMoreButtonProps): JSX.Element => {
  /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const localeStrings = useLocale();
  /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
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
      data-ui-id="call-with-chat-composite-more-button"
      /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{ items: moreButtonContextualMenuItems }}
    />
  );
};
