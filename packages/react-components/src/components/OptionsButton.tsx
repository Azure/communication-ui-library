// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { MoreHorizontal20Filled } from '@fluentui/react-icons';
import {
  DefaultButton,
  IButtonProps,
  IContextualMenuItem,
  Label,
  concatStyleSets,
  mergeStyles,
  ContextualMenuItemType
} from '@fluentui/react';
import { useLocale } from '../localization';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

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
export interface OptionsButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;
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
  onSelectCamera?: (device: any) => Promise<void>;
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone?: (device: any) => Promise<void>;
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker?: (device: any) => Promise<void>;
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
          iconProps: { iconName: 'Camera' },
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
        items: microphones.map((micophone) => ({
          key: micophone.id,
          text: micophone.name,
          title: micophone.name,
          iconProps: { iconName: 'Microphone' },
          canCheck: true,
          isChecked: micophone.id === selectedMicrophone?.id,
          onClick: () => {
            if (micophone.id !== selectedMicrophone?.id) {
              onSelectMicrophone(micophone);
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

/**
 * `OptionsButton` allows you to easily create a component for rendering an options button. It can be used in your ControlBar component for example.
 * This button should contain dropdown menu items you can define through its property `menuProps`.
 * This `menuProps` property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @param props - of type OptionsButtonProps
 */
export const OptionsButton = (props: OptionsButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const localeStrings = useLocale().strings.optionsButton;
  const strings = { ...localeStrings, ...props.strings };

  const defaultMenuProps = generateDefaultMenuProps(props, strings);

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <MoreHorizontal20Filled primaryFill="currentColor" key={'optionsIconKey'} />;
  };

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={'optionsLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {strings.label}
        </Label>
      );
    },
    [strings.label]
  );

  return (
    <DefaultButton
      {...props}
      menuProps={props.menuProps ?? defaultMenuProps}
      menuIconProps={{ hidden: true }}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
