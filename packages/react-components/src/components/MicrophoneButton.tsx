// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useCallback } from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';

import { IContextualMenuItemStyles, IContextualMenuStyles } from '@fluentui/react';
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
  microphoneButtonSplitRoleDescription: string;
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
  microphoneActionTurnedOnAnnouncement: string;
  /**
   * Microphone action turned off string for announcer
   */
  microphoneActionTurnedOffAnnouncement: string;
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
  const onRenderMicOnIcon = (): JSX.Element => {
    return <HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonMicOn" />;
  };
  const onRenderMicOffIcon = (): JSX.Element => {
    return <HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonMicOff" />;
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
            ? generateDefaultDeviceMenuProps({ ...props, styles: props.styles?.menuStyles }, strings)
            : undefined)
        }
        menuIconProps={props.menuIconProps ?? !props.enableDeviceSelectionMenu ? { hidden: true } : undefined}
        split={props.split ?? props.enableDeviceSelectionMenu}
        aria-roledescription={
          props.enableDeviceSelectionMenu ? strings.microphoneButtonSplitRoleDescription : undefined
        }
        splitButtonAriaLabel={props.enableDeviceSelectionMenu ? splitButtonAriaString : undefined}
      />
    </>
  );
};
