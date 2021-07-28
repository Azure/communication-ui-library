// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MoreHorizontal20Filled, Video20Regular } from '@fluentui/react-icons';
import { IContextualMenuItem, ContextualMenuItemType, Theme } from '@fluentui/react';
import { useTheme } from '../theming';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { iconStyle } from './styles/OptionsButton.styles';

/**
 * Device to represent a camera, microphone, or speaker for component OptionsButton component
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
 * Strings of OptionsButton that can be overridden
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
 * Props for OptionsButton component
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
}

/**
 * Generates default menuprops for an OptionsButton if the props contain device
 * information and device change handlers.
 * @param props OptionsButtonProps
 * @returns MenuProps
 */
const generateDefaultMenuProps = (
  props: OptionsButtonProps,
  strings: OptionsButtonStrings,
  theme: Theme
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

  const defaultMenuProps: { items: IContextualMenuItem[] } = { items: [] };

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
          onRenderIcon: () => <Video20Regular style={{ ...iconStyle, ...{ color: theme.palette.themePrimary } }} />,
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
          iconProps: { iconName: 'Microphone' },
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
          iconProps: { iconName: 'Volume1' },
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

const onRenderOptionsIcon = (): JSX.Element => (
  <MoreHorizontal20Filled primaryFill="currentColor" key={'optionsIconKey'} />
);

/**
 * `OptionsButton` allows you to easily create a component for rendering an options button. It can be used in your ControlBar component for example.
 * This button should contain dropdown menu items you can define through its property `menuProps`.
 * This `menuProps` property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @param props - of type OptionsButtonProps
 */
export const OptionsButton = (props: OptionsButtonProps): JSX.Element => {
  const { onRenderIcon } = props;

  const theme = useTheme();
  const localeStrings = useLocale().strings.optionsButton;
  const strings = { ...localeStrings, ...props.strings };

  const defaultMenuProps = generateDefaultMenuProps(props, strings, theme);

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
