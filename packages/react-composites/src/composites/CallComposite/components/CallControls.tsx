// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { memoizeFunction, Stack, useTheme } from '@fluentui/react';
import { IContextualMenuItem } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBar, DevicesButton, ParticipantMenuItemsCallback } from '@internal/react-components';
import { HoldButton } from '@internal/react-components';
import React, { useMemo } from 'react';
/* @conditional-compile-remove(DNS) */
import { useCallback, useState, useEffect } from 'react';
import { CallControlOptions } from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';
import { ContainerRectProps } from '../../common/ContainerRectProps';

import { People } from './buttons/People';
import { useLocale } from '../../localization';
import { MoreButton } from '../../common/MoreButton';
import { usePropsFor } from '../hooks/usePropsFor';
import { buttonFlyoutIncreasedSizeStyles } from '../styles/Buttons.styles';
/* @conditional-compile-remove(DNS) */
import { useAdapter } from '../adapter/CallAdapterProvider';
import { isDisabled } from '../utils';
import { callControlsContainerStyles } from '../styles/CallPage.styles';
import { RaiseHand } from './buttons/RaiseHand';
import { RaiseHandButton, RaiseHandButtonProps } from '@internal/react-components';
import { _generateDefaultDeviceMenuProps } from '@internal/react-components';
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallControlBarButton,
  generateCustomCallDesktopOverflowButtons,
  onFetchCustomButtonPropsTrampoline
} from '../../common/ControlBar/CustomButton';
import { Reaction } from './buttons/Reaction';
import { useSelector } from '../hooks/useSelector';
import { capabilitySelector } from '../../CallComposite/selectors/capabilitySelector';
import { callStatusSelector } from '../../CallComposite/selectors/callStatusSelector';
/* @conditional-compile-remove(DNS) */
import { _isSafari } from '../../CallComposite/utils';
import { getIsRoomsCall, getReactionResources, getRole } from '../selectors/baseSelectors';
/* @conditional-compile-remove(calling-environment-info) */
import { getEnvironmentInfo } from '../selectors/baseSelectors';
/* @conditional-compile-remove(DNS) */
import {
  getDeepNoiseSuppresionEffectsDependency,
  getDeepNoiseSuppresionIsOnByDefault,
  getHideDeepNoiseSupressionButton
} from '../selectors/baseSelectors';

/**
 * @private
 */
export type CallControlsProps = {
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

const inferCallControlOptions = (
  mobileView: boolean,
  callControlOptions?: boolean | CallControlOptions
): CallControlOptions => {
  if (callControlOptions === false) {
    return {};
  }

  const options = callControlOptions === true || callControlOptions === undefined ? {} : callControlOptions;
  if (mobileView) {
    // Set options to always not show screen share button for mobile
    options.screenShareButton = false;
  }
  return options;
};

/**
 * @private
 */
export const CallControls = (props: CallControlsProps & ContainerRectProps): JSX.Element => {
  const options: CallControlOptions = useMemo(
    () => inferCallControlOptions(!!props.isMobile, props.options),
    [props.isMobile, props.options]
  );

  const localeStrings = useLocale();

  /* @conditional-compile-remove(DNS) */
  const [isDeepNoiseSuppressionOn, setDeepNoiseSuppressionOn] = useState<boolean>(false);

  /* @conditional-compile-remove(DNS) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(DNS) */
  const startDeepNoiseSuppression = useCallback(async () => {
    await adapter.startNoiseSuppressionEffect();
  }, [adapter]);

  /* @conditional-compile-remove(DNS) */
  const deepNoiseSuppresionEffectsDependency = useSelector(getDeepNoiseSuppresionEffectsDependency);
  /* @conditional-compile-remove(DNS) */
  const deepNoiseSuppressionOnByDefault = useSelector(getDeepNoiseSuppresionIsOnByDefault);
  /* @conditional-compile-remove(DNS) */
  useEffect(() => {
    if (deepNoiseSuppresionEffectsDependency && deepNoiseSuppressionOnByDefault) {
      startDeepNoiseSuppression();
      setDeepNoiseSuppressionOn(true);
    }
  }, [adapter, deepNoiseSuppresionEffectsDependency, deepNoiseSuppressionOnByDefault, startDeepNoiseSuppression]);

  /* @conditional-compile-remove(DNS) */
  const environmentInfo = useSelector(getEnvironmentInfo);

  /* @conditional-compile-remove(DNS) */
  const isSafari = _isSafari(environmentInfo);
  /* @conditional-compile-remove(DNS) */
  const hideDeepNoiseSuppressionButton = useSelector(getHideDeepNoiseSupressionButton);
  /* @conditional-compile-remove(DNS) */
  const showNoiseSuppressionButton = !!(
    deepNoiseSuppresionEffectsDependency &&
    !hideDeepNoiseSuppressionButton &&
    !isSafari
  );

  /* @conditional-compile-remove(DNS) */
  const onClickNoiseSuppression = useCallback(async () => {
    if (isDeepNoiseSuppressionOn) {
      await adapter.stopNoiseSuppressionEffect();
      setDeepNoiseSuppressionOn(false);
    } else {
      await adapter.startNoiseSuppressionEffect();
      setDeepNoiseSuppressionOn(true);
    }
  }, [adapter, isDeepNoiseSuppressionOn]);

  const peopleButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.peopleButtonLabel,
      tooltipOffContent: localeStrings.strings.call.peopleButtonTooltipOpen,
      tooltipOnContent: localeStrings.strings.call.peopleButtonTooltipClose
    }),
    [localeStrings]
  );

  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.moreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.moreDrawerButtonTooltip
    }),
    [localeStrings]
  );

  const holdButtonProps = usePropsFor(HoldButton);

  const raiseHandButtonProps = usePropsFor(RaiseHandButton) as RaiseHandButtonProps;

  const capabilitiesSelector = useSelector(capabilitySelector);
  const callState = useSelector(callStatusSelector);
  const isReactionAllowed =
    callState.callStatus !== 'Connected' ||
    !capabilitiesSelector?.capabilities ||
    capabilitiesSelector.capabilities.useReactions.isPresent;

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

  const showParticipantsButtonInControlBar = isEnabled(options?.participantsButton) && !props.isMobile;
  if (showParticipantsButtonInControlBar) {
    numberOfButtons++;
  }

  const showReactionButtonInControlBar = isEnabled(options?.reactionButton) && isReactionAllowed && !props.isMobile;
  if (showReactionButtonInControlBar) {
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

    if (!isRoomsCall) {
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
    return items;
  };

  const customDrawerButtons = useMemo(
    () =>
      generateCustomCallDesktopOverflowButtons(
        onFetchCustomButtonPropsTrampoline(typeof options === 'object' ? options : undefined),
        typeof options === 'object' ? options.displayType : undefined
      ),
    [options]
  );

  const moreButtonMenuItems = moreButtonContextualMenuItems();
  let showMoreButton = isEnabled(options?.moreButton) && moreButtonMenuItems.length > 0;
  if (showMoreButton) {
    numberOfButtons++;
  }

  const customButtons = useMemo(
    () => generateCustomCallControlBarButton(onFetchCustomButtonPropsTrampoline(options), options?.displayType),
    [options]
  );

  numberOfButtons += React.Children.count(customButtons['primary']) + React.Children.count(customButtons['secondary']);

  let showDevicesButtonInControlBar = isEnabled(options?.devicesButton);
  if (showDevicesButtonInControlBar && (props.isMobile ? numberOfButtons < 5 : true)) {
    numberOfButtons++;
  } else {
    showDevicesButtonInControlBar = false;

    showMoreButton = isEnabled(options?.moreButton);
  }

  const reactionResources = useSelector(getReactionResources);
  const raiseHandButtonIsEnabled = isEnabled(options?.raiseHandButton);
  let showRaiseHandButtonInControlBar = raiseHandButtonIsEnabled;
  const role = useSelector(getRole);
  const isRoomsCall = useSelector(getIsRoomsCall);
  const hideRaiseHandButtonInRoomsCall = isRoomsCall && role && ['Consumer', 'Unknown'].includes(role);
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
    const devicesButtonMenu = _generateDefaultDeviceMenuProps(
      devicesButtonProps,
      localeStrings.component.strings.devicesButton
    );
    moreButtonMenuItems.push({
      key: 'devicesButtonKey',
      text: localeStrings.component.strings.devicesButton.label,
      iconProps: { iconName: 'ControlButtonOptions', styles: { root: { lineHeight: 0 } } },
      subMenuProps: devicesButtonMenu,
      ['data-ui-id']: 'call-composite-more-menu-devices-button'
    });
  }

  if (!showRaiseHandButtonInControlBar && !hideRaiseHandButtonInRoomsCall) {
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
      ['data-ui-id']: 'call-composite-more-menu-raise-hand-button'
    });
  }

  // Custom Buttons in More Button Menu should always be the last items pushed into the moreButtonMenuItems array
  if (customDrawerButtons['primary']) {
    customDrawerButtons['primary']
      .slice(
        props.isMobile
          ? CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_MOBILE_CUSTOM_BUTTONS
          : CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_DESKTOP_CUSTOM_BUTTONS
      )
      .forEach((element) => {
        moreButtonMenuItems.push({
          itemProps: {
            styles: buttonFlyoutIncreasedSizeStyles
          },
          ...element
        });
      });
  }
  if (customDrawerButtons['secondary']) {
    customDrawerButtons['secondary'].forEach((element) => {
      moreButtonMenuItems.push({
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        ...element
      });
    });
  }
  if (customDrawerButtons['overflow']) {
    customDrawerButtons['overflow'].forEach((element) => {
      moreButtonMenuItems.push({
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        ...element
      });
    });
  }

  const theme = useTheme();

  // when props.options is false then we want to hide the whole control bar.
  if (props.options === false) {
    return <></>;
  }

  return (
    <Stack horizontalAlign="center" className={callControlsContainerStyles}>
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
            <Microphone
              displayType={options?.displayType}
              disabled={isDisabled(options?.microphoneButton)}
              /* @conditional-compile-remove(DNS) */
              onClickNoiseSuppression={onClickNoiseSuppression}
              /* @conditional-compile-remove(DNS) */
              isDeepNoiseSuppressionOn={isDeepNoiseSuppressionOn}
              /* @conditional-compile-remove(DNS) */
              showNoiseSuppressionButton={showNoiseSuppressionButton}
            />
          )}
          {cameraButtonIsEnabled && (
            <Camera displayType={options?.displayType} disabled={isDisabled(options?.cameraButton)} />
          )}
          {showReactionButtonInControlBar && reactionResources && (
            <Reaction displayType={options?.displayType} reactionResource={reactionResources} />
          )}
          {showRaiseHandButtonInControlBar && !hideRaiseHandButtonInRoomsCall && (
            <RaiseHand displayType={options?.displayType} />
          )}
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
              <People
                checked={props.peopleButtonChecked}
                ariaLabel={peopleButtonStrings?.label}
                showLabel={options?.displayType !== 'compact'}
                onClick={props.onPeopleButtonClicked}
                data-ui-id="call-composite-people-button"
                strings={peopleButtonStrings}
                disabled={isDisabled(options?.participantsButton)}
                disableTooltip={props.isMobile}
              />
            )}
          {showDevicesButtonInControlBar && (
            <Devices
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              disabled={isDisabled(options?.devicesButton)}
            />
          )}
          {customButtons['primary']
            ?.slice(
              0,
              props.isMobile
                ? CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_MOBILE_CUSTOM_BUTTONS
                : CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_DESKTOP_CUSTOM_BUTTONS
            )
            .map((CustomButton, i) => {
              return (
                <CustomButton
                  key={`primary-custom-button-${i}`}
                  // styles={commonButtonStyles}
                  showLabel={options?.displayType !== 'compact'}
                  disableTooltip={props.isMobile}
                />
              );
            })}
          {showMoreButton && (
            <MoreButton
              disableTooltip={props.isMobile}
              data-ui-id="common-call-composite-more-button"
              strings={moreButtonStrings}
              menuIconProps={{ hidden: true }}
              menuProps={{ items: moreButtonMenuItems }}
              showLabel={options?.displayType !== 'compact'}
            />
          )}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const isEnabled = (option: unknown): boolean => option !== false;
