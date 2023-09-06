// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFunction, Stack, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
import { IContextualMenuItem } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */
import { useState } from 'react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBar, DevicesButton, ParticipantMenuItemsCallback } from '@internal/react-components';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlOptions } from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
import { generateCustomControlBarButtons, onFetchCustomButtonPropsTrampoline } from './buttons/Custom';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';
import { ContainerRectProps } from '../../common/ContainerRectProps';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { People } from './buttons/People';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
import { MoreButton } from '../../common/MoreButton';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(raise-hand) */
import { usePropsFor } from '../hooks/usePropsFor';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
import { buttonFlyoutIncreasedSizeStyles } from '../styles/Buttons.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { SendDtmfDialpad } from '../../common/SendDtmfDialpad';
/* @conditional-compile-remove(PSTN-calls) */
import { useAdapter } from '../adapter/CallAdapterProvider';
import { isDisabled } from '../utils';
import { callControlsContainerStyles } from '../styles/CallPage.styles';
import { CommonCallAdapter } from '../adapter';
/* @conditional-compile-remove(raise-hand) */
import { RaiseHand } from './buttons/RaiseHand';
/* @conditional-compile-remove(raise-hand) */
import { RaiseHandButton, RaiseHandButtonProps } from '@internal/react-components';
import { generateDefaultDeviceMenuProps } from '@internal/react-components';
/**
 * @private
 */
export type CallControlsProps = {
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
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
  displayVertical?: boolean;
};

// Enforce a background color on control bar to ensure it matches the composite background color.
const controlBarStyles = memoizeFunction((background: string) => ({ root: { background: background } }));

/**
 * @private
 */
export const CallControls = (props: CallControlsProps & ContainerRectProps): JSX.Element => {
  const options = useMemo(() => (typeof props.options === 'boolean' ? {} : props.options), [props.options]);
  /* @conditional-compile-remove(PSTN-calls) */
  const adapter = useAdapter();

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
  const localeStrings = useLocale();

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  const peopleButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.peopleButtonLabel,
      tooltipOffContent: localeStrings.strings.call.peopleButtonTooltipOpen,
      tooltipOnContent: localeStrings.strings.call.peopleButtonTooltipClose
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
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
      dialpadModalAriaLabel: localeStrings.strings.call.dialpadModalAriaLabel,
      dialpadCloseModalButtonAriaLabel: localeStrings.strings.call.dialpadCloseModalButtonAriaLabel,
      placeholderText: localeStrings.strings.call.dtmfDialpadPlaceholderText
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);

  /* @conditional-compile-remove(raise-hand) */
  const raiseHandButtonProps = usePropsFor(RaiseHandButton) as RaiseHandButtonProps;

  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = useAdapter().getState().alternateCallerId;

  const devicesButtonProps = usePropsFor(DevicesButton);

  let numberOfButtons = 0;

  const screenShareButtonIsEnabled = isEnabled(options?.screenShareButton);
  if (screenShareButtonIsEnabled) {
    numberOfButtons++;
  }

  const microphoneButtonIsEnabled = isEnabled(options?.microphoneButton);
  if (microphoneButtonIsEnabled) {
    numberOfButtons++;
  }

  const cameraButtonIsEnabled = isEnabled(options?.cameraButton);
  if (cameraButtonIsEnabled) {
    numberOfButtons++;
  }

  if (isEnabled(options?.endCallButton)) {
    numberOfButtons++;
  }

  let showParticipantsButtonInControlBar =
    isEnabled(options?.participantsButton) &&
    /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
    !props.isMobile;
  if (showParticipantsButtonInControlBar) {
    numberOfButtons++;
  }

  const moreButtonContextualMenuItems = (): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    if (props.isMobile && props.onPeopleButtonClicked && isEnabled(options?.participantsButton)) {
      items.push({
        key: 'peopleButtonKey',
        text: localeStrings.component.strings.participantsButton.label,
        onClick: () => {
          if (props.onPeopleButtonClicked) {
            props.onPeopleButtonClicked();
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

    /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
    if (!isRoomsCallTrampoline(adapter)) {
      items.push({
        key: 'holdButtonKey',
        text: localeStrings.component.strings.holdButton.tooltipOffContent,
        onClick: () => {
          holdButtonProps.onToggleHold();
        },
        iconProps: { iconName: 'HoldCallContextualMenuItem', styles: { root: { lineHeight: 0 } } },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        disabled: isDisabled(options?.holdButton),
        ['data-ui-id']: 'hold-button'
      });
    }

    /* @conditional-compile-remove(PSTN-calls) */
    // dtmf tone sending only works for 1:1 PSTN call
    if (alternateCallerId) {
      items.push({
        key: 'showDialpadKey',
        text: localeStrings.strings.call.openDtmfDialpadLabel,
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

  const moreButtonMenuItems = moreButtonContextualMenuItems();
  let showMoreButton = isEnabled(options?.moreButton) && moreButtonMenuItems.length > 0;
  if (showMoreButton) {
    numberOfButtons++;
  }

  let showDevicesButtonInControlBar = isEnabled(options?.devicesButton);
  if (showDevicesButtonInControlBar && (props.isMobile ? numberOfButtons < 5 : true)) {
    numberOfButtons++;
  } else {
    showDevicesButtonInControlBar = false;

    showMoreButton = isEnabled(options?.moreButton);
  }

  /* @conditional-compile-remove(raise-hand) */
  const raiseHandButtonIsEnabled = isEnabled(options?.raiseHandButton);
  /* @conditional-compile-remove(raise-hand) */
  let showRaiseHandButtonInControlBar = raiseHandButtonIsEnabled;
  /* @conditional-compile-remove(raise-hand) */
  if (showRaiseHandButtonInControlBar && (props.isMobile ? numberOfButtons < 5 : true)) {
    numberOfButtons++;
  } else {
    // If more button is not present but enabled then replace previous button (devices button) with more button
    if (!showMoreButton && isEnabled(options?.moreButton)) {
      showMoreButton = true;
      showDevicesButtonInControlBar = false;
    }

    showRaiseHandButtonInControlBar = false;
  }

  if (!showDevicesButtonInControlBar) {
    const devicesButtonMenu = generateDefaultDeviceMenuProps(
      devicesButtonProps,
      localeStrings.component.strings.devicesButton
    );
    moreButtonMenuItems.push({
      key: 'devicesButtonKey',
      text: localeStrings.component.strings.devicesButton.label,
      iconProps: { iconName: 'ControlButtonOptions', styles: { root: { lineHeight: 0 } } },
      subMenuProps: devicesButtonMenu,
      ['data-ui-id']: 'devices-button'
    });
  }

  /* @conditional-compile-remove(raise-hand) */
  if (!showRaiseHandButtonInControlBar) {
    moreButtonMenuItems.push({
      key: 'raiseHandButtonKey',
      text: raiseHandButtonProps.checked
        ? localeStrings.component.strings.raiseHandButton.onLabel
        : localeStrings.component.strings.raiseHandButton.offLabel,
      onClick: () => {
        if (raiseHandButtonProps.onToggleRaiseHand) {
          raiseHandButtonProps.onToggleRaiseHand();
        }
      },
      iconProps: { iconName: 'RaiseHandContextualMenuItem', styles: { root: { lineHeight: 0 } } },
      itemProps: {
        styles: buttonFlyoutIncreasedSizeStyles
      },
      disabled: isDisabled(options?.raiseHandButton),
      ['data-ui-id']: 'raise-hand-button'
    });
  }

  /* @conditional-compile-remove(PSTN-calls) */
  const [showDialpad, setShowDialpad] = useState(false);

  const theme = useTheme();

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

  return (
    <Stack horizontalAlign="center" className={callControlsContainerStyles}>
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
        <ControlBar
          layout={props.displayVertical ? 'vertical' : 'horizontal'}
          styles={controlBarStyles(theme.semanticColors.bodyBackground)}
        >
          {microphoneButtonIsEnabled && (
            <Microphone displayType={options?.displayType} disabled={isDisabled(options?.microphoneButton)} />
          )}
          {cameraButtonIsEnabled && (
            <Camera displayType={options?.displayType} disabled={isDisabled(options?.cameraButton)} />
          )}
          {
            /* @conditional-compile-remove(raise-hand) */ showRaiseHandButtonInControlBar && (
              <RaiseHand displayType={options?.displayType} />
            )
          }
          {screenShareButtonIsEnabled && (
            <ScreenShare
              option={options?.screenShareButton}
              displayType={options?.displayType}
              disabled={isDisabled(options?.screenShareButton)}
            />
          )}
          {showParticipantsButtonInControlBar && (
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
                ariaLabel={peopleButtonStrings?.label}
                showLabel={options?.displayType !== 'compact'}
                onClick={props.onPeopleButtonClicked}
                data-ui-id="call-composite-people-button"
                strings={peopleButtonStrings}
                disabled={isDisabled(options?.participantsButton)}
              />
            )}
          {showDevicesButtonInControlBar && (
            <Devices
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              disabled={isDisabled(options?.devicesButton)}
            />
          )}
          {
            /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
            showMoreButton && (
              <MoreButton
                data-ui-id="common-call-composite-more-button"
                strings={moreButtonStrings}
                menuIconProps={{ hidden: true }}
                menuProps={{ items: moreButtonMenuItems }}
                showLabel={options?.displayType !== 'compact'}
              />
            )
          }
          {customButtons['primary']}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const isEnabled = (option: unknown): boolean => option !== false;

/** @private */
export const isRoomsCallTrampoline = (adapter: CommonCallAdapter): boolean => {
  /* @conditional-compile-remove(rooms) */
  return adapter.getState().isRoomsCall;

  return false;
};
