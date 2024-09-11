// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useCallback } from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';

import {
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuItemStyles,
  IContextualMenuStyles
} from '@fluentui/react';
/* @conditional-compile-remove(DNS) */
import { Toggle, Stack, IStyleFunctionOrObject, IToggleStyleProps, IToggleStyles } from '@fluentui/react';
import { ControlBarButtonStyles } from './ControlBarButton';
import { OptionsDevice, generateDefaultDeviceMenuProps } from './DevicesButton';
import { Announcer } from './Announcer';

/**
 * Strings of {@link MicrophoneButton} that can be overridden.
 *
 * @public
 */
export interface MicrophoneButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
  /** * Tooltip content when the button is disabled. */
  tooltipDisabledContent?: string;
  /** Tooltip content when the button is on. */
  tooltipOnContent?: string;
  /** Tooltip content when the button is off. */
  tooltipOffContent?: string;
  /**
   * Title of microphone menu
   */
  microphoneMenuTitle?: string;
  /**
   * Title of speaker menu
   */
  speakerMenuTitle?: string;
  /**
   * Tooltip of microphone menu
   */
  microphoneMenuTooltip?: string;
  /**
   * Tooltip of speaker menu
   */
  speakerMenuTooltip?: string;
  /**
   * Description of microphone button split button role
   */
  microphoneButtonSplitRoleDescription?: string;
  /**
   * Microphone split button aria label when mic is enabled.
   */
  onSplitButtonAriaLabel?: string;
  /**
   * Microphone split button aria label when mic is disabled.
   */
  offSplitButtonAriaLabel?: string;
  /**
   * Microphone action turned on string for announcer
   */
  microphoneActionTurnedOnAnnouncement?: string;
  /**
   * Microphone action turned off string for announcer
   */
  microphoneActionTurnedOffAnnouncement?: string;
  /**
   * Primary action for the microphone when microphone is live.
   */
  onSplitButtonMicrophonePrimaryAction?: string;
  /**
   * Primary action for the microphone when the microphone is muted.
   */
  offSplitButtonMicrophonePrimaryAction?: string;
  /**
   * Title for primary action section of split button
   */
  microphonePrimaryActionSplitButtonTitle?: string;
  /**
   * Aria description for the microphone button
   */
  microphoneAriaDescription?: string;
  /* @conditional-compile-remove(DNS) */
  /**
   * Title for deep noise suppression button
   * @beta
   */
  deepNoiseSuppressionTitle?: string;
  /* @conditional-compile-remove(DNS) */
  /**
   * Noise Suppression turned on string for announcer
   * @beta
   */
  deepNoiseSuppressionOnAnnouncement?: string;
  /* @conditional-compile-remove(DNS) */
  /**
   * Noise Suppression turned off string for announcer
   * @beta
   */
  deepNoiseSuppressionOffAnnouncement?: string;
}

/**
 * Styles for {@link MicrophoneButton}
 *
 * @public
 */
export interface MicrophoneButtonStyles extends ControlBarButtonStyles {
  /**
   * Styles for the {@link MicrophoneButton} menu.
   */
  menuStyles?: Partial<MicrophoneButtonContextualMenuStyles>;
}

/**
 * Styles for the {@link MicrophoneButton} menu.
 *
 * @public
 */
export interface MicrophoneButtonContextualMenuStyles extends IContextualMenuStyles {
  /**
   * Styles for the items inside the {@link MicrophoneButton} button menu.
   */
  menuItemStyles?: IContextualMenuItemStyles;
}

/**
 * Props for {@link MicrophoneButton}.
 *
 * @public
 */
export interface MicrophoneButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleMicrophone?: () => Promise<void>;
  /**
   * Available microphones for selection
   */
  microphones?: OptionsDevice[];
  /**
   * Available speakers for selection
   */
  speakers?: OptionsDevice[];
  /**
   * Microphone that is shown as currently selected
   */
  selectedMicrophone?: OptionsDevice;
  /**
   * Speaker that is shown as currently selected
   */
  selectedSpeaker?: OptionsDevice;
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone?: (device: OptionsDevice) => Promise<void>;
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker?: (device: OptionsDevice) => Promise<void>;
  /**
   * Whether to use a {@link SplitButton} with a {@link IContextualMenu} for device selection.
   *
   * default: false
   */
  enableDeviceSelectionMenu?: boolean;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<MicrophoneButtonStrings>;
  /**
   * Styles for {@link MicrophoneButton} and the device selection flyout.
   */
  styles?: Partial<MicrophoneButtonStyles>;
  /* @conditional-compile-remove(DNS) */
  /**
   * Whether the deep noise suppression is on or off
   *
   * @beta
   */
  isDeepNoiseSuppressionOn?: boolean;
  /* @conditional-compile-remove(DNS) */
  /**
   * Callback when noise suppression is clicked
   *
   * @beta
   */
  onClickNoiseSuppression?: () => void;
  /* @conditional-compile-remove(DNS) */
  /**
   * Show/Hide the deep noise suppression button
   *
   * @beta
   */
  showNoiseSuppressionButton?: boolean;
}

/**
 * A button to turn microphone on / off.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const MicrophoneButton = (props: MicrophoneButtonProps): JSX.Element => {
  const { onToggleMicrophone } = props;
  const localeStrings = useLocale().strings.microphoneButton;
  const strings = { ...localeStrings, ...props.strings };
  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);

  const isSplit = props.split ?? props.enableDeviceSelectionMenu;

  // The button should be disabled when there are no mics. However if the button is a split button, if there are
  // no mics but there are speakers, then only the primary part of the button should be disabled to allow for
  // speaker change.
  const primaryDisabled = props.primaryDisabled || (isSplit && !props.microphones?.length ? true : undefined);
  const disabled =
    props.disabled ||
    (isSplit && !props.microphones?.length && !props.speakers?.length) ||
    (!isSplit && props.microphones && props.microphones?.length === 0);

  const onRenderMicOnIcon = (): JSX.Element => {
    return <_HighContrastAwareIcon disabled={disabled} iconName="ControlButtonMicOn" />;
  };
  const onRenderMicOffIcon = (): JSX.Element => {
    return <_HighContrastAwareIcon disabled={disabled} iconName="ControlButtonMicOff" />;
  };

  const isMicOn = props.checked;

  const splitButtonAriaString = isMicOn ? strings.onSplitButtonAriaLabel : strings.offSplitButtonAriaLabel;

  const toggleAnnouncerString = useCallback(
    (isMicOn: boolean) => {
      setAnnouncerString(
        !isMicOn ? strings.microphoneActionTurnedOffAnnouncement : strings.microphoneActionTurnedOnAnnouncement
      );
    },
    [strings.microphoneActionTurnedOffAnnouncement, strings.microphoneActionTurnedOnAnnouncement]
  );

  const onToggleClick = useCallback(async () => {
    if (onToggleMicrophone) {
      try {
        await onToggleMicrophone();
        // allows for the setting of narrator strings triggering the announcer when microphone is turned on or off.
        toggleAnnouncerString(!isMicOn);
        // eslint-disable-next-line no-empty
      } finally {
      }
    }
  }, [isMicOn, onToggleMicrophone, toggleAnnouncerString]);

  /* @conditional-compile-remove(DNS) */
  const deepNoiseSuppressionToggleStyles: IStyleFunctionOrObject<IToggleStyleProps, IToggleStyles> = {
    root: {
      margin: '4px',
      padding: '0px 12px',
      flexFlow: 'row-reverse',
      justifyContent: 'space-between'
    },
    label: { fontWeight: 400 }
  };

  const splitButtonMenuItems: IContextualMenuItem[] = [];

  /* @conditional-compile-remove(DNS) */
  if (props.showNoiseSuppressionButton) {
    splitButtonMenuItems.push({
      key: 'microphoneDNSToggle',
      onRender: () => {
        return (
          <Stack
            onClick={async () => {
              await props.onClickNoiseSuppression?.();
              setAnnouncerString(
                props.isDeepNoiseSuppressionOn
                  ? strings.deepNoiseSuppressionOnAnnouncement
                  : strings.deepNoiseSuppressionOffAnnouncement
              );
            }}
          >
            <Toggle
              label={strings.deepNoiseSuppressionTitle}
              checked={props.isDeepNoiseSuppressionOn}
              inlineLabel
              styles={deepNoiseSuppressionToggleStyles}
            />
          </Stack>
        );
      }
    });
  }

  splitButtonMenuItems.push({
    key: 'microphonePrimaryAction',
    text: props.checked ? strings.onSplitButtonMicrophonePrimaryAction : strings.offSplitButtonMicrophonePrimaryAction,
    onClick: () => {
      onToggleClick();
    },
    iconProps: {
      iconName: props.checked ? 'SplitButtonPrimaryActionMicUnmuted' : 'SplitButtonPrimaryActionMicMuted',
      styles: { root: { lineHeight: 0 } }
    }
  });

  /**
   * We need to also include the primary action of the button to the
   * split button for mobile devices.
   */
  const splitButtonPrimaryAction: IContextualMenuItem = {
    key: 'primaryAction',
    title: 'toggle mic',
    itemType: ContextualMenuItemType.Section,
    sectionProps: {
      topDivider: true,
      items: splitButtonMenuItems
    }
  };

  return (
    <>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      <ControlBarButton
        {...props}
        onClick={props.onToggleMicrophone ? onToggleClick : props.onClick}
        onRenderOnIcon={props.onRenderOnIcon ?? onRenderMicOnIcon}
        onRenderOffIcon={props.onRenderOffIcon ?? onRenderMicOffIcon}
        strings={strings}
        labelKey={props.labelKey ?? 'microphoneButtonLabel'}
        menuProps={
          props.menuProps ??
          (props.enableDeviceSelectionMenu
            ? generateDefaultDeviceMenuProps(
                { ...props, styles: props.styles?.menuStyles },
                strings,
                splitButtonPrimaryAction
              )
            : undefined)
        }
        menuIconProps={props.menuIconProps ?? !props.enableDeviceSelectionMenu ? { hidden: true } : undefined}
        split={props.split ?? props.enableDeviceSelectionMenu}
        aria-roledescription={
          props.enableDeviceSelectionMenu ? strings.microphoneButtonSplitRoleDescription : undefined
        }
        aria-description={strings.microphoneAriaDescription}
        splitButtonAriaLabel={props.enableDeviceSelectionMenu ? splitButtonAriaString : undefined}
        disabled={disabled}
        primaryDisabled={primaryDisabled}
      />
    </>
  );
};
