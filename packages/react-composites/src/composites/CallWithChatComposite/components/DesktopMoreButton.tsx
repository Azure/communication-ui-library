// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem } from '@fluentui/react';
import { ControlBarButtonProps, HoldButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';
import { buttonFlyoutIncreasedSizeStyles } from '../../CallComposite/styles/Buttons.styles';
import { MoreButton } from '../../common/MoreButton';
import { useLocale } from '../../localization';

/**
 *
 * @private
 */
export const DesktopMoreButton = (props: ControlBarButtonProps): JSX.Element => {
  const localeStrings = useLocale();
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

    items.push({
      key: 'holdButtonKey',
      text: localeStrings.component.strings.holdButton.tooltipOffContent,
      onClick: () => {
        holdButtonProps.onToggleHold();
      },
      iconProps: { iconName: 'HoldCall', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      }
    });

    return items;
  };

  return (
    <MoreButton
      {...props}
      data-ui-id="call-with-chat-composite-more-button"
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{ items: moreButtonContextualMenuItems() }}
    />
  );
};
