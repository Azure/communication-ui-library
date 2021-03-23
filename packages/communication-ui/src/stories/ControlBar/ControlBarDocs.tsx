// © Microsoft Corporation. All rights reserved.

import { Stack } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import {
  audioButtonProps,
  ControlBar,
  ControlButton,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps
} from '../../components';
import { FluentThemeProvider } from '../../providers';

const importStatement = `
import { ControlBar, ControlButton } from '@azure/communication-ui';

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
    <Stack style={{ flexFlow: 'row' }}>
      <FluentThemeProvider>
        <ControlBar layout={'horizontal'}>
          <ControlButton {...videoButtonProps} />
          <ControlButton {...audioButtonProps} />
          <ControlButton {...screenShareButtonProps} />
          <ControlButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
          <ControlButton {...hangupButtonProps} />
        </ControlBar>
      </FluentThemeProvider>
    </Stack>
  );
};

const exampleCode = `
const ControlBarExample: () => JSX.Element = () => {
  return (
    <ControlBar layout={'horizontal'}>
      <ControlButton {...videoButtonProps} onClick={toggleVideo} showLabel={false} />
      <ControlButton {...audioButtonProps} onClick={toggleAudio} showLabel={false} />
      <ControlButton {...screenShareButtonProps} onClick={toggleScreenShare} showLabel={false} />
      <ControlButton {...hangupButtonProps} onClick={hangUpCall} showLabel={false} />
    </ControlBar>
  );
};
`;

const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <Stack style={{ flexFlow: 'row', minHeight: '250px' }}>
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <ControlButton {...videoButtonProps} />
          <ControlButton {...audioButtonProps} />
          <ControlButton {...screenShareButtonProps} />
          <ControlButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
          <ControlButton {...hangupButtonProps} />
        </ControlBar>
      </FluentThemeProvider>
    </Stack>
  );
};

const controlBarLayoutCode = `
<ControlBar layout='floatingLeft'>
  <ControlButton {...videoButtonProps} />
  <ControlButton {...audioButtonProps} />
  <ControlButton {...screenShareButtonProps} />
  <ControlButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
  <ControlButton {...hangupButtonProps} />
</ControlBar>
`;

const customControlButtonUsage = `
import { CallEndIcon } from '@fluentui/react-northstar';
import { FluentThemeProvider } from '@azure/communication-ui';

const HangUpButton: () => JSX.Element = () => {
  const styles = {
    root: {
      marginTop: '10px !important',
      minHeight: '1rem',
      background: 'firebrick',
      color: 'white',
      ':hover': { background: 'red', color: 'white' }
    },
    flexContainer: { flexFlow: 'row' },
    label: { color: 'white', paddingLeft: '0.5rem' }
  };
  return (
    <ControlButton 
      defaultIcon={<CallEndIcon />} 
      defaultLabel={<>End Call</>} 
      showLabel={true}
      styles={styles}
      onClick={() => {// handle hangup}}
    />
  );
};

const CustomControlButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <ControlButton {...videoButtonProps} />
        <ControlButton {...audioButtonProps} />
        <HangUpButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};
`;

const HangUpButton: () => JSX.Element = () => {
  const styles = {
    root: {
      marginTop: '10px !important',
      minHeight: '1rem',
      background: 'firebrick',
      color: 'white',
      ':hover': { background: 'red', color: 'white' }
    },
    flexContainer: { flexFlow: 'row' },
    label: { color: 'white', paddingLeft: '0.5rem' }
  };
  return <ControlButton defaultIcon={<CallEndIcon />} defaultLabel={<>End Call</>} showLabel={true} styles={styles} />;
};

const CustomControlButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <ControlButton {...videoButtonProps} />
        <ControlButton {...audioButtonProps} />
        <HangUpButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBar & ControlButton</Title>
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

      <Heading>Custom Button</Heading>
      <Canvas>
        <CustomControlButtonExample />
      </Canvas>
      <Source code={customControlButtonUsage} />

      <Heading>ControlBar Props</Heading>
      <Props of={ControlBar} />

      <Heading>ControlButton Props</Heading>
      <Props of={ControlButton} />
    </>
  );
};
