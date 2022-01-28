// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItemStyles, IContextualMenuStyles } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles } from './ControlBarButton';
import { OptionsDevice, generateDefaultDeviceMenuProps, DeviceMenuStrings } from './DevicesButton';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';

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
}

/**
 * Styles for {@link MicrophoneButton}
 *
 * @public
 */
export interface MicrophoneButtonStyles extends ControlBarButtonStyles {
  /**
   * Styles for the {@link DevicesButton} menu.
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
  showDeviceSelectionMenu?: boolean;
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
  const localeStrings = useLocale().strings.microphoneButton;
  const strings = { ...localeStrings, ...props.strings };

  const onRenderMicOnIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonMicOn" />
  );
  const onRenderMicOffIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonMicOff" />
  );
  const deviceMenuProps =
    props.menuProps ??
    (props.showDeviceSelectionMenu
      ? generateDefaultDeviceMenuProps(
          { ...props, styles: props.styles?.menuStyles },
          fillDummyStringsIfMissing(strings)
        )
      : undefined);

  return (
    <ControlBarButton
      {...props}
      onClick={props.onToggleMicrophone ?? props.onClick}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderMicOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderMicOffIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'microphoneButtonLabel'}
      menuProps={deviceMenuProps}
      menuIconProps={!props.showDeviceSelectionMenu ? { hidden: true } : undefined}
      split={!!props.showDeviceSelectionMenu}
    />
  );
};

// Due to backward compatibility requirements, strings in MicrophoneButtonStrings must be
// optional. So we fill in default values for missing ones.
const fillDummyStringsIfMissing = (strings: MicrophoneButtonStrings): DeviceMenuStrings => ({
  // Setup defaults
  cameraMenuTitle: '',
  microphoneMenuTitle: '',
  speakerMenuTitle: '',
  cameraMenuTooltip: '',
  microphoneMenuTooltip: '',
  speakerMenuTooltip: '',
  // Now override available values
  ...strings
});
