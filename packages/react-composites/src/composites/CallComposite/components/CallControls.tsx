// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFunction, Stack, useTheme } from '@fluentui/react';
import { IContextualMenuItem } from '@fluentui/react';
import { useState } from 'react';
import {
  _isInLobbyOrConnecting,
  useCallingSelector,
  useCallingHandlers,
  holdButtonSelector
} from '@internal/calling-component-bindings';
import { ControlBar, ParticipantMenuItemsCallback, _Permissions } from '@internal/react-components';
import { HoldButton } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlOptions } from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
/* @conditional-compile-remove(control-bar-button-injection) */
import { generateCustomControlBarButtons, onFetchCustomButtonPropsTrampoline } from './buttons/Custom';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';
import { ContainerRectProps } from '../../common/ContainerRectProps';
/* @conditional-compile-remove(one-to-n-calling) */
import { People } from './buttons/People';
import { useLocale } from '../../localization';
import { MoreButton } from '../../common/MoreButton';
import { buttonFlyoutIncreasedSizeStyles } from '../styles/Buttons.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { SendDtmfDialpad } from '../../common/SendDtmfDialpad';
/* @conditional-compile-remove(PSTN-calls) */
import { useAdapter } from '../adapter/CallAdapterProvider';
import { isDisabled } from '../utils';
import { ControlBarButtonStrings } from '@internal/react-components';

/**
 * @private
 */
export type CallControlsProps = {
  /* @conditional-compile-remove(one-to-n-calling) */
  peopleButtonChecked?: boolean;
  onPeopleButtonClicked?: () => void;
  callInvitationURL?: string;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: boolean | CallControlOptions;
  /**
   * Option to increase the height of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  increaseFlyoutItemSize?: boolean;
  isMobile?: boolean;
};

// Enforce a background color on control bar to ensure it matches the composite background color.
const controlBarStyles = memoizeFunction((background: string) => ({ root: { background: background } }));

/**
 * @private
 */
export const CallControls = (props: CallControlsProps & ContainerRectProps): JSX.Element => {
  const options = useMemo(() => (typeof props.options === 'boolean' ? {} : props.options), [props.options]);

  /* @conditional-compile-remove(one-to-n-calling) */
  const localeStrings = useLocale();

  /* @conditional-compile-remove(one-to-n-calling) */
  const peopleButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.callWithChat.peopleButtonLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.peopleButtonTooltipOpen,
      tooltipOnContent: localeStrings.strings.callWithChat.peopleButtonTooltipClose
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */
  const dialpadStrings = useMemo(
    () => ({
      dialpadModalAriaLabel: localeStrings.strings.call.dialpadModalAriaLabel,
      dialpadCloseModalButtonAriaLabel: localeStrings.strings.call.dialpadCloseModalButtonAriaLabel,
      placeholderText: localeStrings.strings.call.dtmfDialpadPlaceHolderText
    }),
    [localeStrings]
  );

  const [showDialpad, setShowDialpad] = useState(false);
  deleteMe(showDialpad);
  const theme = useTheme();

  /* @conditional-compile-remove(control-bar-button-injection) */
  const customButtons = useMemo(
    () => generateCustomControlBarButtons(onFetchCustomButtonPropsTrampoline(options), options?.displayType),
    [options]
  );

  // when props.options is false then we want to hide the whole control bar.
  if (props.options === false) {
    return <></>;
  }

  /* @conditional-compile-remove(PSTN-calls) */
  const onDismissDialpad = (): void => {
    setShowDialpad(false);
  };

  const rolePermissions = usePermissionsTrampoline();

  let screenShareButtonIsEnabled = rolePermissions.screenShare && isEnabled(options?.screenShareButton);
  let microphoneButtonIsEnabled = rolePermissions.microphoneButton && isEnabled(options?.microphoneButton);
  let cameraButtonIsEnabled = rolePermissions.cameraButton && isEnabled(options?.cameraButton);

  return (
    <Stack horizontalAlign="center">
      {
        /* @conditional-compile-remove(PSTN-calls) */
        <SendDtmfDialpad
          isMobile={!!props.isMobile}
          strings={dialpadStrings}
          showDialpad={showDialpad}
          onDismissDialpad={onDismissDialpad}
        />
      }
      <Stack.Item>
        {/*
            Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
            control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
            set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
            dockedBottom it has position absolute and would therefore float on top of the media gallery,
            occluding some of its content.
         */}
        <ControlBar layout="horizontal" styles={controlBarStyles(theme.semanticColors.bodyBackground)}>
          {microphoneButtonIsEnabled && (
            <Microphone displayType={options?.displayType} disabled={isDisabled(options?.microphoneButton)} />
          )}
          {cameraButtonIsEnabled && (
            <Camera displayType={options?.displayType} disabled={isDisabled(options?.cameraButton)} />
          )}
          {screenShareButtonIsEnabled && (
            <ScreenShare
              option={options?.screenShareButton}
              displayType={options?.displayType}
              disabled={isDisabled(options?.screenShareButton)}
            />
          )}
          {isEnabled(options?.participantsButton) &&
            /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
            !props.isMobile && (
              <Participants
                option={options?.participantsButton}
                callInvitationURL={props.callInvitationURL}
                onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
                displayType={options?.displayType}
                increaseFlyoutItemSize={props.increaseFlyoutItemSize}
                isMobile={props.isMobile}
                disabled={isDisabled(options?.participantsButton)}
              />
            ) && (
              /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
              <People
                checked={props.peopleButtonChecked}
                showLabel={options?.displayType !== 'compact'}
                onClick={props.onPeopleButtonClicked}
                data-ui-id="call-composite-people-button"
                strings={peopleButtonStrings}
                disabled={isDisabled(options?.participantsButton)}
              />
            )}
          {isEnabled(options?.devicesButton) && (
            <Devices
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              disabled={isDisabled(options?.devicesButton)}
            />
          )}
          <CallControlsMoreButton
            options={options}
            onPeopleButtonClicked={props.onPeopleButtonClicked}
            isMobile={props.isMobile}
            setShowDialpad={setShowDialpad}
          />
          {/* @conditional-compile-remove(control-bar-button-injection) */ customButtons['primary']}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const deleteMe = (showDialpad: boolean): void => {
  /* nothing */
};

const CallControlsMoreButton = (props: {
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

  if (!isEnabled(moreButtonOptionsTrampoline(options))) {
    return <></>;
  }
  return (
    <MoreButton
      strings={moreButtonStrings}
      menuIconProps={{ hidden: true }}
      menuProps={{ items: moreButtonContextualMenuItems() }}
      showLabel={!props.isMobile}
    />
  );
};

const isEnabled = (option: unknown): boolean => option !== false;

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

const moreButtonOptionsTrampoline = (options?: CallControlOptions): boolean | undefined => {
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  return options?.moreButton;
  return undefined;
};

const usePermissionsTrampoline = (): _Permissions => {
  /* @conditional-compile-remove(rooms) */
  return _usePermissions();
  // On stable build, all users have all permissions
  return {
    cameraButton: true,
    microphoneButton: true,
    screenShare: true,
    removeParticipantButton: true
  };
};
