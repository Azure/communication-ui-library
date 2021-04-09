// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import {
  ControlBar,
  audioButtonProps,
  hangupButtonProps,
  labeledVideoButtonProps,
  labeledAudioButtonProps,
  labeledScreenShareButtonProps,
  labeledOptionsButtonProps,
  labeledHangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps,
  LIGHT,
  DARK,
  THEMES
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

  let background = THEMES[theme]?.palette?.white;
  let controlBarBackground = THEMES[theme]?.palette?.white;

  if (theme === DARK) {
    if (layout.startsWith('floating')) {
      background = '#252423';
      controlBarBackground = THEMES[DARK]?.palette?.neutralLight;
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
      <ControlBar layout={layout} styles={{ root: { background: controlBarBackground } }}>
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
