// © Microsoft Corporation. All rights reserved.

import { Stack, DefaultButton, concatStyleSets } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import {
  FluentThemeProvider,
  audioButtonProps,
  ControlBarComponent,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps
} from '@azure/communication-ui';

const importStatement = `
import { ControlBarComponent } from '@azure/communication-ui';
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

const ControlBarComponentExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBarComponent layout={'horizontal'}>
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBarComponent>
    </FluentThemeProvider>
  );
};

const exampleCode = `
const ControlBarComponentExample: () => JSX.Element = () => {
  return (
    <ControlBarComponent layout={'horizontal'}>
      <DefaultButton {...videoButtonProps} onClick={() => {/*handle onClick*/ }} />
      <DefaultButton {...audioButtonProps} onClick={() => {/*handle onClick*/ }} />
      <DefaultButton {...screenShareButtonProps} onClick={() => {/*handle onClick*/ }} />
      <DefaultButton {...optionsButtonProps} menuProps={/*some IContextualMenuProps*/} />
      <DefaultButton {...hangupButtonProps} onClick={() => {/*handle onClick*/ }} />
    </ControlBarComponent>
  );
};
`;

const ControlBarComponentLayoutExample: () => JSX.Element = () => {
  return (
    <Stack style={{ flexFlow: 'row', minHeight: '250px' }}>
      <FluentThemeProvider>
        <ControlBarComponent layout="floatingLeft">
          <DefaultButton {...videoButtonProps} />
          <DefaultButton {...audioButtonProps} />
          <DefaultButton {...screenShareButtonProps} />
          <DefaultButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
          <DefaultButton {...hangupButtonProps} />
        </ControlBarComponent>
      </FluentThemeProvider>
    </Stack>
  );
};

const ControlBarComponentLayoutCode = `
<ControlBarComponent layout='floatingLeft'>
  <DefaultButton {...videoButtonProps} />
  <DefaultButton {...audioButtonProps} />
  <DefaultButton {...screenShareButtonProps} />
  <DefaultButton {...optionsButtonProps} />
  <DefaultButton {...hangupButtonProps} />
</ControlBarComponent>
`;

const customControlBarComponentUsage = `
import { CallEndIcon } from '@fluentui/react-northstar';
import { FluentThemeProvider } from '@azure/communication-ui';

const CustomHangupButton: () => JSX.Element = () => {
  const styles = concatStyleSets(hangupButtonProps.styles, {
    root: {
      height: 'inherit',
      background: '#d74747',
      color: 'white',
      width: '10rem'
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

const CustomControlBarComponentExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBarComponent layout={'horizontal'}>
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <CustomHangupButton />
      </ControlBarComponent>
    </FluentThemeProvider>
  );
};
`;

const CustomHangupButton: () => JSX.Element = () => {
  const styles = concatStyleSets(hangupButtonProps.styles, {
    root: {
      height: 'inherit',
      background: '#d74747',
      color: 'white',
      width: '10rem'
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

const CustomControlBarComponentExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBarComponent layout={'horizontal'}>
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <CustomHangupButton />
      </ControlBarComponent>
    </FluentThemeProvider>
  );
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBarComponent</Title>
      <Description of={ControlBarComponent} />
      <Canvas>
        <ControlBarComponentExample />
      </Canvas>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Usage</Heading>
      <Description>
        ControlBarComponent can be rendered with `DefaultButton`, a
        [Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) component from Fluent UI.
      </Description>
      <Canvas>
        <ControlBarComponentExample />
      </Canvas>
      <Source code={exampleCode} />
      <Description>
        Note: In the example below, menuProps is a property of `Button`. The property type is
        [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
      </Description>

      <Heading>Layouts</Heading>
      <Description>
        You can change the layout of Control Bar by providing a preset layout to the `layout` prop.
      </Description>
      <Canvas>
        <ControlBarComponentLayoutExample />
      </Canvas>
      <Source code={ControlBarComponentLayoutCode} />

      <Heading>Custom Control Bar</Heading>
      <Canvas>
        <CustomControlBarComponentExample />
      </Canvas>
      <Source code={customControlBarComponentUsage} />

      <Heading>ControlBarComponent Props</Heading>
      <Props of={ControlBarComponent} />
    </>
  );
};
