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
  videoButtonProps
} from '../components/ControlBar';
import { boolean, select } from '@storybook/addon-knobs';
import { getDocs } from './docs/ControlBarDocs';
import { DefaultButton, IButtonProps, Icon, concatStyleSets, Persona, PersonaSize } from '@fluentui/react';
import { controlButtonStyles, hangUpControlButtonStyles } from '../components/styles/ControlBar.styles';

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

  const showLabel = showLabels ? {} : { onRenderText: () => null };

  const otherUserScreenSharing = boolean('Other user screen sharing', false);

  return (
    // <ControlBar layout={layout}>
    //   <DefaultButton {...videoButtonProps} {...showLabel} checked={toggleButtons} />
    //   <DefaultButton {...audioButtonProps} {...showLabel} checked={toggleButtons} />
    //   <DefaultButton {...screenShareButtonProps} {...showLabel} checked={toggleButtons} />
    //   <DefaultButton {...optionsButtonProps} {...showLabel} menuProps={defaultOptionsMenuProps} />
    //   <DefaultButton {...hangupButtonProps} {...showLabel} />
    // </ControlBar>
    <ControlBar layout={layout}>
      <DefaultButton
        onRenderIcon={(props?: IButtonProps): JSX.Element => {
          if (props?.checked) {
            return <Icon iconName="Video" />;
          } else {
            return <Icon iconName="VideoOff" />;
          }
        }}
        styles={controlButtonStyles}
        checked={toggleButtons}
      />
      <DefaultButton
        onRenderIcon={(props?: IButtonProps): JSX.Element => {
          if (props?.checked) {
            return <Icon iconName="Microphone" />;
          } else {
            return <Icon iconName="MicOff" />;
          }
        }}
        styles={controlButtonStyles}
        checked={toggleButtons}
      />
      <DefaultButton
        onRenderIcon={(props?: IButtonProps): JSX.Element => {
          if (otherUserScreenSharing) {
            return <Persona text="Other user" size={PersonaSize.size24} hidePersonaDetails={true} />;
          } else if (props?.checked) {
            return <Icon iconName="Screencast" />;
          } else {
            return <Icon iconName="ShareiOS" />;
          }
        }}
        styles={controlButtonStyles}
        disabled={otherUserScreenSharing}
        checked={toggleButtons}
      />
      <DefaultButton
        onRenderIcon={() => <Icon iconName="DeclineCall" />}
        onRenderText={() => <span style={{ margin: '0.250rem' }}>Leave</span>}
        styles={concatStyleSets(hangUpControlButtonStyles, {
          root: {
            background: '#d74654',
            width: '6.5625rem'
          },
          flexContainer: { flexFlow: 'flex' }
        })}
      />
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
