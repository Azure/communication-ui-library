// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { audioButtonProps, ControlBar, ControlButton, hangupButtonProps, optionsButtonProps, screenShareButtonProps, videoButtonProps } from '../../components/ControlBar';
import { mergeThemes, Provider, teamsTheme } from '@fluentui/react-northstar';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
import { Stack } from '@fluentui/react';

const importStatement = `
import { ControlBar } from '@azure/communication-ui';
`;

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

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

const ControlBarExample: () => JSX.Element = () => {
  return (
    <Stack style={{ flexFlow: 'row' }}>
      <Provider theme={mergeThemes(iconTheme, teamsTheme)}>
        <ControlBar vertical={false}>
          <ControlButton {...videoButtonProps} />
          <ControlButton {...audioButtonProps} />
          <ControlButton {...screenShareButtonProps} />
          <ControlButton {...optionsButtonProps} menuProps={defaultOptionsMenuProps} />
          <ControlButton {...hangupButtonProps} />
        </ControlBar>
      </Provider>
    </Stack>
  );
};

const exampleCode = `
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

const ControlBarExample: () => JSX.Element = () => {
  return (
    <ControlBar vertical={false}>
      <ControlButton {...videoButtonProps} />
      <ControlButton {...videoButtonProps} />
      <ControlButton {...screenShareButtonProps} />
      <ControlButton {...optionsButtonProps} menuProps={defaultOptionsMenuProps} />
      <ControlButton {...hangupButtonProps} />
    </ControlBar>
  );
};
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBar</Title>
      <Description>
        The ControlBar Component provides allows you to handle a call.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <ControlBarExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={ControlBar} />
    </>
  );
};
