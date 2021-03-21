// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import {
  CONTROL_BAR_LAYOUTS,
  ControlBar,
  ControlButton,
  audioButtonProps,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps,
  audioButtonWithLabelProps,
  hangupButtonWithLabelProps,
  optionsButtonWithLabelProps,
  screenShareButtonWithLabelProps,
  videoButtonWithLabelProps
} from '../components/ControlBar';
import { boolean, object, select } from '@storybook/addon-knobs';
import { getDocs } from './docs/ControlBarDocs';

const defaultOptionsMenuProps = {
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
  const optionsMenuProps = object('Options Menu', defaultOptionsMenuProps);

  return (
    <ControlBar layout={layout}>
      <ControlButton
        {...(showLabels ? videoButtonWithLabelProps : videoButtonProps)}
        isToggled={toggleButtons}
        showLabel={showLabels}
      />
      <ControlButton
        {...(showLabels ? audioButtonWithLabelProps : audioButtonProps)}
        isToggled={toggleButtons}
        showLabel={showLabels}
      />
      <ControlButton
        {...(showLabels ? screenShareButtonWithLabelProps : screenShareButtonProps)}
        isToggled={toggleButtons}
        showLabel={showLabels}
      />
      <ControlButton
        {...(showLabels ? optionsButtonWithLabelProps : optionsButtonProps)}
        menuProps={optionsMenuProps}
        showLabel={showLabels}
      />
      <ControlButton {...(showLabels ? hangupButtonWithLabelProps : hangupButtonProps)} showLabel={showLabels} />
    </ControlBar>
  );
};

export default {
  title: 'ACS Components/ControlBar',
  component: ControlBarComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
