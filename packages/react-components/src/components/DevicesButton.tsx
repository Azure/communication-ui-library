// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuItemStyles,
  IContextualMenuProps,
  IContextualMenuStyles,
  merge
} from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles } from './ControlBarButton';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';
import { buttonFlyoutItemStyles } from './styles/ControlBar.styles';

/**
 * Styles for the {@link DevicesButton} menu.
 *
 * @public
 */
export interface DevicesButtonContextualMenuStyles extends IContextualMenuStyles {
  /**
   * Styles for the items inside the {@link DevicesButton} button menu.
   */
  menuItemStyles?: IContextualMenuItemStyles;
}

/**
 * Styles for the Devices button menu items.
 *
 * @public
 */
export interface DevicesButtonStyles extends ControlBarButtonStyles {
  /**
   * Styles for the {@link DevicesButton} menu.
   */
  menuStyles?: Partial<DevicesButtonContextualMenuStyles>;
}

/**
 * A device, e.g. camera, microphone, or speaker, in the {@link DevicesButton} flyout.
 *
 * @public
 */
export interface OptionsDevice {
  /**
   * Device unique identifier
   */
  id: string;
  /**
   * Device name
   */
  name: string;
}

/**
 * Strings of {@link DevicesButton} that can be overridden.
 *
 * @public
 */
export interface DevicesButtonStrings {
  /**
   * Label of button
   */
  label: string;
  /**
   * Button tooltip content.
   */
  tooltipContent?: string;
  /**
   * Title of camera menu
   */
  cameraMenuTitle: string;
  /**
   * Title of microphone menu
   */
  microphoneMenuTitle: string;
  /**
   * Title of speaker menu
   */
  speakerMenuTitle: string;
  /**
   * Tooltip of camera menu
   */
  cameraMenuTooltip: string;
  /**
   * Tooltip of microphone menu
   */
  microphoneMenuTooltip: string;
  /**
   * Tooltip of speaker menu
   */
  speakerMenuTooltip: string;
}

/**
 * Props for {@link DevicesButton}.
 *
 * @public
 */
export interface DevicesButtonProps extends ControlBarButtonProps {
  /**
   * Available microphones for selection
   */
  microphones?: OptionsDevice[];
  /**
   * Available speakers for selection
   */
  speakers?: OptionsDevice[];
  /**
   * Available cameras for selection
   */
  cameras?: OptionsDevice[];
  /**
   * Microphone that is shown as currently selected
   */
  selectedMicrophone?: OptionsDevice;
  /**
   * Speaker that is shown as currently selected
   */
  selectedSpeaker?: OptionsDevice;
  /**
   * Camera that is shown as currently selected
   */
  selectedCamera?: OptionsDevice;
  /**
   * Callback when a camera is selected
   */
  onSelectCamera?: (device: OptionsDevice) => Promise<void>;
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone?: (device: OptionsDevice) => Promise<void>;
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker?: (device: OptionsDevice) => Promise<void>;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<DevicesButtonStrings>;
  /**
   * Option to increase the touch targets of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  styles?: DevicesButtonStyles;
}

/**
 * Generates default menuprops for an DevicesButton if the props contain device
 * information and device change handlers.
 * @param props DevicesButtonProps
 * @returns MenuProps
 */
const generateDefaultMenuProps = (
  props: DevicesButtonProps,
  strings: DevicesButtonStrings
): { items: IContextualMenuItem[] } | undefined => {
  const {
    microphones,
    speakers,
    cameras,
    selectedMicrophone,
    selectedSpeaker,
    selectedCamera,
    onSelectCamera,
    onSelectMicrophone,
    onSelectSpeaker
  } = props;

  const defaultMenuProps: IContextualMenuProps = {
    items: [],
    styles: props.styles?.menuStyles,
    calloutProps: {
      styles: {
        root: {
          // Confine the menu to the parents bounds.
          // More info: https://github.com/microsoft/fluentui/issues/18835
          // NB: 95% to keep some space for margin, drop shadow etc around the Callout.
          maxWidth: '95%'
        }
      },
      // Disable dismiss on resize to work around a couple Fluent UI bugs
      // - The Callout is dismissed whenever *any child of window (inclusive)* is resized. In practice, this
      //   happens when we change the VideoGallery layout, or even when the video stream element is internally resized
      //   by the headless SDK.
      // - There is a `preventDismissOnEvent` prop that we could theoretically use to only dismiss when the target of
      //   of the 'resize' event is the window itself. But experimentation shows that setting that prop doesn't
      //   deterministically avoid dismissal.
      //
      // A side effect of this workaround is that the context menu stays open when window is resized, and may
      // get detached from original target visually. That bug is preferable to the bug when this value is not set -
      // The Callout (frequently) gets dismissed automatically.
      preventDismissOnResize: true
    }
  };

  const menuItemStyles = merge(buttonFlyoutItemStyles, props.styles?.menuStyles?.menuItemStyles ?? {});

  if (cameras && selectedCamera && onSelectCamera) {
    defaultMenuProps.items.push({
      key: 'sectionCamera',
      title: strings.cameraMenuTooltip,
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: strings.cameraMenuTitle,
        items: cameras.map((camera) => ({
          key: camera.id,
          text: camera.name,
          title: camera.name,
          iconProps: { iconName: 'OptionsCamera', styles: { root: { lineHeight: 0 } } },
          itemProps: {
            styles: menuItemStyles
          },
          role: 'menuitem',
          canCheck: true,
          isChecked: camera.id === selectedCamera?.id,
          onClick: () => {
            if (camera.id !== selectedCamera?.id) {
              onSelectCamera(camera);
            }
          }
        }))
      }
    });
  }

  if (microphones && selectedMicrophone && onSelectMicrophone) {
    defaultMenuProps.items.push({
      key: 'sectionMicrophone',
      title: strings.microphoneMenuTooltip,
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: strings.microphoneMenuTitle,
        items: microphones.map((microphone) => ({
          key: microphone.id,
          text: microphone.name,
          title: microphone.name,
          iconProps: { iconName: 'OptionsMic', styles: { root: { lineHeight: 0 } } },
          itemProps: {
            styles: menuItemStyles
          },
          role: 'menuitem',
          canCheck: true,
          isChecked: microphone.id === selectedMicrophone?.id,
          onClick: () => {
            if (microphone.id !== selectedMicrophone?.id) {
              onSelectMicrophone(microphone);
            }
          }
        }))
      }
    });
  }

  if (speakers && selectedSpeaker && onSelectSpeaker) {
    defaultMenuProps.items.push({
      key: 'sectionSpeaker',
      title: strings.speakerMenuTooltip,
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: strings.speakerMenuTitle,
        items: speakers.map((speaker) => ({
          key: speaker.id,
          text: speaker.name,
          title: speaker.name,
          iconProps: { iconName: 'OptionsSpeaker', styles: { root: { lineHeight: 0 } } },
          itemProps: {
            styles: menuItemStyles
          },
          role: 'menuitem',
          canCheck: true,
          isChecked: speaker.id === selectedSpeaker?.id,
          onClick: () => {
            if (speaker.id !== selectedSpeaker?.id) {
              onSelectSpeaker(speaker);
            }
          }
        }))
      }
    });
  }

  if (defaultMenuProps.items.length === 0) {
    // Avoids creating an empty context menu.
    return undefined;
  }
  return defaultMenuProps;
};

/**
 * A button to open a menu that controls device options.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const DevicesButton = (props: DevicesButtonProps): JSX.Element => {
  const { onRenderIcon } = props;

  const localeStrings = useLocale().strings.devicesButton;
  const strings = { ...localeStrings, ...props.strings };

  const devicesButtonMenu = props.menuProps ?? generateDefaultMenuProps(props, strings);

  const onRenderOptionsIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonOptions" />
  );

  return (
    <ControlBarButton
      {...props}
      menuProps={devicesButtonMenu}
      menuIconProps={{ hidden: true }}
      onRenderIcon={onRenderIcon ?? onRenderOptionsIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'devicesButtonLabel'}
    />
  );
};
