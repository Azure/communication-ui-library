// © Microsoft Corporation. All rights reserved.

import { Stack, DefaultButton, concatStyleSets } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import {
  audioButtonProps,
  ControlBar,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps
} from '../../components';
import { FluentThemeProvider } from '../../providers';

const importStatement = `
import { ControlBar } from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

// Import Helper Props for quickly creating common call control buttons.
import { 
  videoButtonProps,
  audioButtonProps,
  screenShareButtonProps,
  optionsButtonProps,
  hangupButtonProps 
} from '@azure/communication-ui';
`;

const exampleOptionsMenuProps = {
  items: [
    {
      key: '1',
      name: 'Choose Camera',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: [
          { key: 'cam1', text: 'Full Webcam', title: 'Full Webcam', canCheck: true, isChecked: true },
          { key: 'cam2', text: 'Macbook Webcam', title: 'Macbook Webcam' }
        ]
      }
    },
    {
      key: '2',
      name: 'Choose Microphone',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: [
          { key: 'mic1', text: 'Realtek Audio', title: 'Realtek Audio' },
          { key: 'mic2', text: 'Macbook Mic', title: 'Macbook Mic', canCheck: true, isChecked: true }
        ]
      }
    }
  ]
};

const ControlBarExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

const exampleCode = `
const ControlBarExample: () => JSX.Element = () => {
  return (
    <ControlBar layout={'horizontal'}>
      <DefaultButton {...videoButtonProps} onClick={toggleVideo} />
      <DefaultButton {...audioButtonProps} onClick={toggleAudio} />
      <DefaultButton {...screenShareButtonProps} onClick={toggleScreenShare} />
      <DefaultButton {...optionsButtonProps} menuProps={defaultOptionsMenuProps} />
      <DefaultButton {...hangupButtonProps} onClick={hangUpCall} />
    </ControlBar>
  );
};
`;

const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <Stack style={{ flexFlow: 'row', minHeight: '250px' }}>
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <DefaultButton {...videoButtonProps} />
          <DefaultButton {...audioButtonProps} />
          <DefaultButton {...screenShareButtonProps} />
          <DefaultButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
          <DefaultButton {...hangupButtonProps} />
        </ControlBar>
      </FluentThemeProvider>
    </Stack>
  );
};

const controlBarLayoutCode = `
<ControlBar layout='floatingLeft'>
  <DefaultButton {...videoButtonProps} />
  <DefaultButton {...audioButtonProps} />
  <DefaultButton {...screenShareButtonProps} />
  <DefaultButton {...optionsButtonProps} menuProps={defaultOptionsMenuProps} />
  <DefaultButton {...hangupButtonProps} />
</ControlBar>
`;

const customControlBarUsage = `
import { CallEndIcon } from '@fluentui/react-northstar';
import { FluentThemeProvider } from '@azure/communication-ui';

const CustomHangUpButton: () => JSX.Element = () => {
  const styles = concatStyleSets(hangupButtonProps.styles, {
    root: {
      height: 'inherit',
      background: '#d74747',
      color: 'white',
    },
    rootHovered: { 
      background: 'red', 
      color: 'white' 
    },
    flexContainer: { flexFlow: 'row' }
  });
  return (
    <DefaultButton 
      onRenderIcon={() => <CallEndIcon />}
      onRenderText={() => <span style={{ marginLeft: '0.250rem' }}>End Call</span>}
      styles={styles}
      onClick={() => {/* handle hangup */}}
    />
  );
};

const CustomControlBarExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <CustomHangUpButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};
`;

const CustomHangupButton: () => JSX.Element = () => {
  const styles = concatStyleSets(hangupButtonProps.styles, {
    root: {
      height: 'inherit',
      background: '#d74747',
      color: 'white'
    },
    rootHovered: {
      background: 'red',
      color: 'white'
    },
    flexContainer: { flexFlow: 'row' }
  });
  return (
    <DefaultButton
      onRenderIcon={() => <CallEndIcon />}
      onRenderText={() => <span style={{ marginLeft: '0.250rem' }}>End Call</span>}
      styles={styles}
      onClick={() => {
        /* handle hangup */
      }}
    />
  );
};

const CustomControlBarExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <CustomHangupButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBar</Title>
      <Description of={ControlBar} />
      <Canvas>
        <ControlBarExample />
      </Canvas>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Usage</Heading>
      <Canvas>
        <ControlBarExample />
      </Canvas>
      <Source code={exampleCode} />

      <Heading>Layouts</Heading>
      <Description>
        You can change the layout of Control Bar by providing a preset layout to the `layout` prop.
      </Description>
      <Canvas>
        <ControlBarLayoutExample />
      </Canvas>
      <Source code={controlBarLayoutCode} />

      <Heading>Custom Control Bar</Heading>
      <Canvas>
        <CustomControlBarExample />
      </Canvas>
      <Source code={customControlBarUsage} />

      <Heading>ControlBar Props</Heading>
      <Props of={ControlBar} />
    </>
  );
};
