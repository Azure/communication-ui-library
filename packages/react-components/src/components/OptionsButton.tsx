// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenuItemType, Icon, IContextualMenuItem, IContextualMenuProps } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { buttonFlyoutItemStyles, buttonFlyoutItemStylesWithIncreasedTouchTargets } from './styles/ControlBar.styles';

/**
 * A device, e.g. camera, microphone, or speaker, in the {@link OptionsButton} flyout.
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
 * Strings of {@link OptionsButton} that can be overridden.
 *
 * @public
 */
export interface OptionsButtonStrings {
  /**
   * Label of button
   */
  label: string;
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
 * Props for {@link OptionsButton}.
 *
 * @public
 */
export interface OptionsButtonProps extends ControlBarButtonProps {
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
  strings?: Partial<OptionsButtonStrings>;
  /**
   * Option to increase the touch targets of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  increaseFlyoutItemTouchTargetSize?: boolean;
}

/**
 * Generates default menuprops for an OptionsButton if the props contain device
 * information and device change handlers.
 * @param props OptionsButtonProps
 * @returns MenuProps
 */
const generateDefaultMenuProps = (
  props: OptionsButtonProps,
  strings: OptionsButtonStrings
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

    // Confine the menu to the parents bounds.
    // More info: https://github.com/microsoft/fluentui/issues/18835
    calloutProps: { styles: { root: { maxWidth: '95%' } } }
  };

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
          itemProps: {
            styles: props.increaseFlyoutItemTouchTargetSize
              ? buttonFlyoutItemStylesWithIncreasedTouchTargets
              : buttonFlyoutItemStyles
          },
          iconProps: { iconName: 'OptionsCamera' },
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
          itemProps: {
            styles: props.increaseFlyoutItemTouchTargetSize
              ? buttonFlyoutItemStylesWithIncreasedTouchTargets
              : buttonFlyoutItemStyles
          },
          iconProps: { iconName: 'OptionsMic' },
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
          itemProps: {
            styles: props.increaseFlyoutItemTouchTargetSize
              ? buttonFlyoutItemStylesWithIncreasedTouchTargets
              : buttonFlyoutItemStyles
          },
          iconProps: { iconName: 'OptionsSpeaker' },
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

const onRenderOptionsIcon = (): JSX.Element => <Icon iconName="ControlButtonOptions" />;

/**
 * A button to open a menu that controls device options.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const OptionsButton = (props: OptionsButtonProps): JSX.Element => {
  const { onRenderIcon } = props;

  const localeStrings = useLocale().strings.optionsButton;
  const strings = { ...localeStrings, ...props.strings };

  const defaultMenuProps = generateDefaultMenuProps(props, strings);

  return (
    <ControlBarButton
      {...props}
      menuProps={props.menuProps ?? defaultMenuProps}
      menuIconProps={{ hidden: true }}
      onRenderIcon={onRenderIcon ?? onRenderOptionsIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'optionsButtonLabel'}
    />
  );
};
