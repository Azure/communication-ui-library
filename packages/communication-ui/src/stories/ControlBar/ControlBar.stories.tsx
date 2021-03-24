// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import {
  CONTROL_BAR_LAYOUTS,
  ControlBar,
  audioButtonProps,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps,
  labeledVideoButtonProps,
  labeledAudioButtonProps,
  labeledScreenShareButtonProps,
  labeledOptionsButtonProps,
  labeledHangupButtonProps
} from '../../components/ControlBar';
import { boolean, select } from '@storybook/addon-knobs';
import { getDocs } from './ControlBarDocs';
import { DefaultButton } from '@fluentui/react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

const exampleOptionsMenuProps = {
  items: [
    {
      key: '1',
      name: 'Choose Camera',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: [
          { key: 'camera1', text: 'Full HD Webcam', title: 'Full HD Webcam', canCheck: true, isChecked: true },
          { key: 'camera2', text: 'Macbook Pro Webcam', title: 'Macbook Pro Webcam' }
        ]
      }
    },
    {
      key: '2',
      name: 'Choose Microphone',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: [
          { key: 'mic1', text: 'Realtek HD Audio', title: 'Realtek HD Audio' },
          { key: 'mic2', text: 'Macbook Pro Mic', title: 'Macbook Pro Mic', canCheck: true, isChecked: true }
        ]
      }
    }
  ]
};

export const ControlBarComponent: () => JSX.Element = () => {
  const layout = select('Layout', CONTROL_BAR_LAYOUTS, 'floatingBottom');
  const toggleButtons = boolean('Toggle Buttons', false);
  const showLabels = boolean('Show Labels', false);

  return (
    <ControlBar layout={layout}>
      <DefaultButton {...(showLabels ? labeledVideoButtonProps : videoButtonProps)} checked={toggleButtons} />
      <DefaultButton {...(showLabels ? labeledAudioButtonProps : audioButtonProps)} checked={toggleButtons} />
      <DefaultButton
        {...(showLabels ? labeledScreenShareButtonProps : screenShareButtonProps)}
        checked={toggleButtons}
      />
      <DefaultButton
        {...(showLabels ? labeledOptionsButtonProps : optionsButtonProps)}
        menuProps={exampleOptionsMenuProps}
      />
      <DefaultButton {...(showLabels ? labeledHangupButtonProps : hangupButtonProps)} />
    </ControlBar>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar`,
  component: ControlBarComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
