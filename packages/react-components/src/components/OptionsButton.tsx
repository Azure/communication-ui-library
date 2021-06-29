// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
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
  onSelectCamera?: (device: OptionsDevice) => Promise<void>;
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone?: (device: OptionsDevice) => Promise<void>;
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker?: (device: OptionsDevice) => Promise<void>;
}

/**
 * Generates default menuprops for an OptionsButton if the props contain device
 * information and device change handlers.
 * @param props OptionsButtonProps
 * @returns MenuProps
 */
const generateDefaultMenuProps = (props: OptionsButtonProps): { items: IContextualMenuItem[] } | undefined => {
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
      title: 'Choose Camera',
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: 'Camera',
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
      title: 'Choose Microphone',
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: 'Microphone',
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
      title: 'Choose Speaker',
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: 'Speaker',
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

  const defaultMenuProps = generateDefaultMenuProps(props);

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <MoreHorizontal20Filled primaryFill="currentColor" key={'optionsIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'optionsLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {'Options'}
      </Label>
    );
  };

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
