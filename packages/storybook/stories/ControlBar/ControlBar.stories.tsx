// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton,
  labeledOptionsButtonProps,
  optionsButtonProps,
  LIGHT,
  DARK
} from '@azure/communication-ui';
import { boolean, select } from '@storybook/addon-knobs';
import { getDocs } from './ControlBarDocs';
import { DefaultButton } from '@fluentui/react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

const CONTROL_BAR_LAYOUTS = [
  'horizontal',
  'vertical',
  'dockedTop',
  'dockedBottom',
  'dockedLeft',
  'dockedRight',
  'floatingTop',
  'floatingBottom',
  'floatingLeft',
  'floatingRight'
] as const;

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

export const ControlBarComponent: (
  args: any,
  {
    globals: { theme }
  }
) => JSX.Element = (args, { globals: { theme } }) => {
  const layout = select('Layout', CONTROL_BAR_LAYOUTS, 'floatingBottom');
  const toggleButtons = boolean('Toggle Buttons', false);
  const showLabels = boolean('Show Labels', false);

  // This is code to set the color of the background div to show contrast to the control bar based on the theme like shown in the Figma design.
  let background = 'none';
  if (theme === DARK) {
    if (layout.startsWith('floating')) {
      background = '#252423';
    } else {
      background = '#161514';
    }
  } else if (theme === LIGHT) {
    background = '#f8f8f8';
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'inherit',
        background: background
      }}
    >
      <ControlBar layout={layout}>
        <CameraButton showLabel={showLabels} checked={toggleButtons} />
        <MicrophoneButton showLabel={showLabels} checked={toggleButtons} />
        <ScreenShareButton showLabel={showLabels} checked={toggleButtons} />
        <DefaultButton
          {...(showLabels ? labeledOptionsButtonProps : optionsButtonProps)}
          menuProps={exampleOptionsMenuProps}
        />
        <EndCallButton showLabel={showLabels} />
      </ControlBar>
    </div>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar`,
  component: ControlBar,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
