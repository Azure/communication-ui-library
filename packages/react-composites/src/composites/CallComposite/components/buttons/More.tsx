// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem } from '@fluentui/react';
import { holdButtonSelector, useCallingHandlers, useCallingSelector } from '@internal/calling-component-bindings';
import { ControlBarButtonStrings, HoldButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { MoreButton } from '../../../common/MoreButton';
import { useLocale } from '../../../localization/LocalizationProvider';
/* @conditional-compile-remove(PSTN-calls) */
import { useAdapter } from '../../adapter/CallAdapterProvider';
import { buttonFlyoutIncreasedSizeStyles } from '../../styles/Buttons.styles';
import { CallControlOptions } from '../../types/CallControlOptions';
import { isDisabled, isEnabled } from '../../utils';

/**
 * {@link MoreButton} prepared to be used inside {@link CallControls}.
 *
 * This wrapper is responsible for marshalling strings and options and
 * providing the menu items for the the {@link MoreButton}.
 *
 * @private
 */
export const More = (props: {
  options?: CallControlOptions;
  onPeopleButtonClicked?: () => void;
  isMobile?: boolean;
  setShowDialpad: (value: boolean) => void;
}): JSX.Element => {
  const { options, onPeopleButtonClicked, isMobile, setShowDialpad } = props;
  const locale = useLocale();
  // Unfortunately can't use `usePropsFor`for conditionally exported components.
  // TODO: Use `usePropsFor` once `MoreButton` is stabilized.
  const holdButtonProps = {
    ...useCallingSelector(holdButtonSelector),
    ...useCallingHandlers(HoldButton)
  };
  const alternateCallerId = useAlternateCallerIdTrampoline();
  const moreButtonStrings = useMoreButtonStringsTrampoline();
  const holdButtonStrings = useHoldButtonStringsTrampoline();
  const dialpadKeyStrings = useDialpadKeyStringsTrampoline();

  // FIXME: Memoize!
  const moreButtonContextualMenuItems = (): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    if (isMobile && onPeopleButtonClicked && isEnabled(options?.participantsButton)) {
      items.push({
        key: 'peopleButtonKey',
        text: locale.component.strings.participantsButton.label,
        onClick: () => {
          if (onPeopleButtonClicked) {
            onPeopleButtonClicked();
          }
        },
        iconProps: { iconName: 'ControlButtonParticipantsContextualMenuItem', styles: { root: { lineHeight: 0 } } },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        disabled: isDisabled(options?.participantsButton),
        ['data-ui-id']: 'call-composite-more-menu-people-button'
      });
    }

    items.push({
      key: 'holdButtonKey',
      text: holdButtonStrings.text,
      onClick: () => {
        holdButtonProps.onToggleHold();
      },
      iconProps: { iconName: 'HoldCallContextualMenuItem', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: isDisabled(holdButtonOptionsTrampoline(options)),
      ['data-ui-id']: 'hold-button'
    });

    if (alternateCallerId) {
      items.push({
        key: 'showDialpadKey',
        text: dialpadKeyStrings.text,
        onClick: () => {
          setShowDialpad(true);
        },
        iconProps: { iconName: 'PeoplePaneOpenDialpad', styles: { root: { lineHeight: 0 } } },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        }
      });
    }
    return items;
  };

  return (
    <MoreButton
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{ items: moreButtonContextualMenuItems() }}
      showLabel={!props.isMobile}
    />
  );
};

const useMoreButtonStringsTrampoline = (): ControlBarButtonStrings => {
  const locale = useLocale();
  return useMemo(() => {
    // @conditional-compile-remove(PSTN-calls)
    // @conditional-compile-remove(one-to-n-calling)
    return {
      label: locale.strings.call.moreButtonCallingLabel,
      tooltipOffContent: locale.strings.callWithChat.moreDrawerButtonTooltip
    };
    return { label: '', tooltipOffContent: '' };
  }, [locale]);
};

const useDialpadKeyStringsTrampoline = (): { text: string } => {
  const locale = useLocale();
  return useMemo(() => {
    // @conditional-compile-remove(PSTN-calls)
    return { text: locale.strings.call.openDtmfDialpadLabel };
    return { text: '' };
  }, [locale]);
};

const useHoldButtonStringsTrampoline = (): { text: string } => {
  const locale = useLocale();
  return useMemo(() => {
    // @conditional-compile-remove(PSTN-calls)
    // @conditional-compile-remove(one-to-n-calling)
    return { text: locale.component.strings.holdButton.tooltipOffContent };
    return { text: '' };
  }, [locale]);
};

const useAlternateCallerIdTrampoline = (): string | undefined => {
  // FIXME: This should use a selector so that any update to `alternateCallerId` triggers a UI update.
  /* @conditional-compile-remove(PSTN-calls) */
  return useAdapter().getState().alternateCallerId;
  return undefined;
};

const holdButtonOptionsTrampoline = (options?: CallControlOptions): boolean | { disabled: boolean } | undefined => {
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  return options?.holdButton;
  return undefined;
};
