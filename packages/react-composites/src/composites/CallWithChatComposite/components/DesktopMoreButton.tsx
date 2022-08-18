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
import { MoreButton } from '../../common/MoreButton';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { useLocale } from '../../localization';

/** @private */
export interface DesktopMoreButtonProps extends ControlBarButtonProps {
  disableButtonsForHoldScreen?: boolean;
  onClickShowDialpad?: () => void;
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

  const moreButtonContextualMenuItems = (): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    items.push({
      key: 'holdButtonKey',
      text: localeStrings.component.strings.holdButton.tooltipOffContent,
      onClick: () => {
        holdButtonProps.onToggleHold();
      },
      iconProps: { iconName: 'HoldCall', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: props.disableButtonsForHoldScreen
    });

    /*@conditional-compile-remove(PSTN-calls) */
    if (props.onClickShowDialpad) {
      items.push({
        key: 'showDialpadKey',
        text: localeStrings.strings.callWithChat.openDtmfDialpad,
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

    return items;
  };

  return (
    <MoreButton
      {...props}
      data-ui-id="call-with-chat-composite-more-button"
      /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{ items: moreButtonContextualMenuItems() }}
    />
  );
};
