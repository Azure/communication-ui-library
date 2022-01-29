// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuProps } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';

/* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
import { IContextualMenuItemStyles, IContextualMenuStyles } from '@fluentui/react';
/* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
import { ControlBarButtonStyles } from './ControlBarButton';
/* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
import { DeviceMenuStrings, OptionsDevice, generateDefaultDeviceMenuProps } from './DevicesButton';

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
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Title of microphone menu
   */
  microphoneMenuTitle?: string;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Title of speaker menu
   */
  speakerMenuTitle?: string;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Tooltip of microphone menu
   */
  microphoneMenuTooltip?: string;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Tooltip of speaker menu
   */
  speakerMenuTooltip?: string;
}

/* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
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

/* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
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
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Available microphones for selection
   */
  microphones?: OptionsDevice[];
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Available speakers for selection
   */
  speakers?: OptionsDevice[];
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Microphone that is shown as currently selected
   */
  selectedMicrophone?: OptionsDevice;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Speaker that is shown as currently selected
   */
  selectedSpeaker?: OptionsDevice;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone?: (device: OptionsDevice) => Promise<void>;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker?: (device: OptionsDevice) => Promise<void>;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
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
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
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

  return (
    <ControlBarButton
      {...props}
      onClick={props.onToggleMicrophone ?? props.onClick}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderMicOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderMicOffIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'microphoneButtonLabel'}
      menuProps={props.menuProps ?? generateDefaultDeviceMenuPropsTrampoline(props, strings)}
      menuIconProps={!showDeviceSelectionMenuTrampoline(props) ? { hidden: true } : undefined}
      split={showDeviceSelectionMenuTrampoline(props)}
    />
  );
};

/* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
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

const generateDefaultDeviceMenuPropsTrampoline = (
  props: MicrophoneButtonProps,
  strings: MicrophoneButtonStrings
): IContextualMenuProps | undefined => {
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  if (props.showDeviceSelectionMenu) {
    generateDefaultDeviceMenuProps({ ...props, styles: props.styles?.menuStyles }, fillDummyStringsIfMissing(strings));
  }
  return undefined;
};

const showDeviceSelectionMenuTrampoline = (props: MicrophoneButtonProps): boolean => {
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  if (props.showDeviceSelectionMenu) {
    return true;
  }
  return false;
};
