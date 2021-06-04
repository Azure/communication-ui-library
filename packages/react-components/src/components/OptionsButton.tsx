// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, IButtonProps, IContextualMenuItem, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { MoreIcon } from '@fluentui/react-northstar';
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
  onSelectCamera?: (device: any) => Promise<void>;
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone?: (device: any) => Promise<void>;
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker?: (device: any) => Promise<void>;
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

  let defaultMenuProps: { items: IContextualMenuItem[] } | undefined = undefined;

  if (cameras && selectedCamera && onSelectCamera) {
    defaultMenuProps = defaultMenuProps ?? { items: [] };
    defaultMenuProps.items.push({
      key: '1',
      name: 'Choose Camera',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: cameras.map((val) => ({
          key: val.id,
          text: val.name,
          title: val.name,
          canCheck: true,
          isChecked: val.id === selectedCamera?.id,
          onClick: () => {
            if (val.id !== selectedCamera?.id) {
              onSelectCamera(val);
            }
          }
        }))
      }
    });
  }

  if (microphones && selectedMicrophone && onSelectMicrophone) {
    defaultMenuProps = defaultMenuProps ?? { items: [] };
    defaultMenuProps.items.push({
      key: '2',
      name: 'Choose Microphone',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: microphones.map((val) => ({
          key: val.id,
          text: val.name,
          title: val.name,
          canCheck: true,
          isChecked: val.id === selectedMicrophone?.id,
          onClick: () => {
            if (val.id !== selectedMicrophone?.id) {
              onSelectMicrophone(val);
            }
          }
        }))
      }
    });
  }

  if (speakers && selectedSpeaker && onSelectSpeaker) {
    defaultMenuProps = defaultMenuProps ?? { items: [] };
    defaultMenuProps.items.push({
      key: '3',
      name: 'Choose Speaker',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: speakers.map((val) => ({
          key: val.id,
          text: val.name,
          title: val.name,
          canCheck: true,
          isChecked: val.id === selectedSpeaker?.id,
          onClick: () => {
            if (val.id !== selectedSpeaker?.id) {
              onSelectSpeaker(val);
            }
          }
        }))
      }
    });
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
    return <MoreIcon key={'optionsIconKey'} />;
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
