// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem } from '@fluentui/react';
import { ControlBarButtonProps } from '@internal/react-components';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
import React, { useState } from 'react';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { useMemo } from 'react';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { buttonFlyoutIncreasedSizeStyles } from '../../CallComposite/styles/Buttons.styles';
import { MoreButton } from '../../common/MoreButton';
import { SendDtmfDialpad } from '../../common/SendDtmfDialpad';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { useLocale } from '../../localization';

/**
 *
 * @private
 */
export const DesktopMoreButton = (props: ControlBarButtonProps): JSX.Element => {
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

  /* @conditional-compile-remove(PSTN-calls) */
  const dialpadStrings = useMemo(
    () => ({
      dialpadModalAriaLabel: localeStrings.strings.callWithChat.dialpadModalAriaLabel,
      dialpadCloseModalButtonAriaLabel: localeStrings.strings.callWithChat.dialpadCloseModalButtonAriaLabel,
      placeholderText: localeStrings.strings.callWithChat.dtmfDialpadPlaceHolderText
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */
  const [showDialpad, setShowDialpad] = useState(false);

  /* @conditional-compile-remove(PSTN-calls) */
  const onDismissDialpad = (): void => {
    setShowDialpad(false);
  };

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
      }
    });

    /*@conditional-compile-remove(PSTN-calls) */
    items.push({
      key: 'showDialpadKey',
      text: localeStrings.strings.callWithChat.openDtmfDialpad,
      onClick: () => {
        setShowDialpad(true);
      },
      iconProps: { iconName: 'Dialpad', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      }
    });

    return items;
  };

  return (
    <>
      {
        /* @conditional-compile-remove(PSTN-calls) */
        <SendDtmfDialpad
          isMobile={false}
          strings={dialpadStrings}
          showDialpad={showDialpad}
          onDismissDialpad={onDismissDialpad}
        />
      }
      <MoreButton
        {...props}
        data-ui-id="call-with-chat-composite-more-button"
        /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
        strings={moreButtonStrings}
        menuIconProps={{ hidden: true }}
        menuProps={{ items: moreButtonContextualMenuItems() }}
      />
    </>
  );
};
