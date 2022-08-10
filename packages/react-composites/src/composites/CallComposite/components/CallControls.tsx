// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem, memoizeFunction, merge, Stack, useTheme } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBar, HoldButton, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { useCallback, useMemo } from 'react';
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
/* @conditional-compile-remove(one-to-n-calling) */
import { useLocale } from '../../localization';
import { MoreButton } from '../../common/MoreButton';
import { usePropsFor } from '../hooks/usePropsFor';
import { buttonFlyoutIncreasedSizeStyles } from '../styles/Buttons.styles';

/**
 * @private
 */
export type CallControlsProps = {
  /* @conditional-compile-remove(one-to-n-calling) */
  peopleButtonChecked?: boolean;
  /* @conditional-compile-remove(one-to-n-calling) */
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

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove() */
  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.moreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.moreDrawerButtonTooltip
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);

  /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(one-to-n-calling) */
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

  return (
    <Stack horizontalAlign="center">
      <Stack.Item>
        {/*
            Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
            control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
            set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
            dockedBottom it has position absolute and would therefore float on top of the media gallery,
            occluding some of its content.
         */}
        <ControlBar layout="horizontal" styles={controlBarStyles(theme.semanticColors.bodyBackground)}>
          {isEnabled(options?.microphoneButton) && <Microphone displayType={options?.displayType} />}
          {isEnabled(options?.cameraButton) && <Camera displayType={options?.displayType} />}
          {isEnabled(options?.screenShareButton) && (
            <ScreenShare option={options?.screenShareButton} displayType={options?.displayType} />
          )}
          {isEnabled(options?.participantsButton) && (
              <Participants
                option={options?.participantsButton}
                callInvitationURL={props.callInvitationURL}
                onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
                displayType={options?.displayType}
                increaseFlyoutItemSize={props.increaseFlyoutItemSize}
                isMobile={props.isMobile}
              />
            ) && (
              /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(one-to-n-calling) */
              <People
                checked={props.peopleButtonChecked}
                showLabel={options?.displayType !== 'compact'}
                onClick={props.onPeopleButtonClicked}
                data-ui-id="call-with-chat-composite-people-button"
                disabled={isDisabled(options?.participantsButton)}
                strings={peopleButtonStrings}
              />
            )}
          {isEnabled(options?.devicesButton) && (
            <Devices displayType={options?.displayType} increaseFlyoutItemSize={props.increaseFlyoutItemSize} />
          )}
          {
            /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(one-to-n-calling) */ isEnabled(
              isEnabled(options?.moreButton)
            ) && (
              <MoreButton
                strings={moreButtonStrings}
                menuIconProps={{ hidden: true }}
                menuProps={{ items: moreButtonContextualMenuItems() }}
                showLabel={!props.isMobile}
              />
            )
          }
          {/* @conditional-compile-remove(control-bar-button-injection) */ customButtons['primary']}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const isEnabled = (option: unknown): boolean => option !== false;
/* @conditional-compile-remove(one-to-n-calling) */
const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
