// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { MoreHorizontal20Filled } from '@fluentui/react-icons';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

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
   * Utility props for stateful props.
   */
  microphones?: [{ id: string; name: string }];
  speakers?: [{ id: string; name: string }];
  cameras?: [{ id: string; name: string }];
  selectedMicrophone?: { id: string; name: string };
  selectedSpeaker?: { id: string; name: string };
  selectedCamera?: { id: string; name: string };
  onSelectCamera?: (device: any) => Promise<void>;
  onSelectMicrophone?: (device: any) => Promise<void>;
  onSelectSpeaker?: (device: any) => Promise<void>;
}

/**
 * Generates default menuprops for an OptionsButton if the props contain device
 * information and device change handlers.
 * @param props OptionsButtonProps
 * @returns MenuProps
 */
const generateDefaultMenuProps = (props: OptionsButtonProps): { items: Array<any> } => {
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

  const defaultMenuProps: { items: Array<any> } = { items: [] };

  if (cameras && selectedCamera && onSelectCamera) {
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
          onClick: () => !(val.id === selectedCamera?.id) && onSelectCamera(val)
        }))
      }
    });
  }

  if (microphones && selectedMicrophone && onSelectMicrophone) {
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
          onClick: () => !(val.id === selectedMicrophone?.id) && onSelectMicrophone(val)
        }))
      }
    });
  }

  if (speakers && selectedSpeaker && onSelectSpeaker) {
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
          onClick: () => !(val.id === selectedSpeaker?.id) && onSelectSpeaker(val)
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
