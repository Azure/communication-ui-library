// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Dialpad as DialpadComponent, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { hiddenControl } from '../controlsUtils';
import { CustomDialpadExample } from './snippets/CustomDialpad.snippet';
import { DialpadExample } from './snippets/Dialpad.snippet';

const CustomDialpadText = require('!!raw-loader!./snippets/CustomDialpad.snippet.tsx').default;
const ExampleDialpadText = require('!!raw-loader!./snippets/Dialpad.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <SingleLineBetaBanner version={'1.3.2-beta.1'} topOfPage={true} />
      <Title>Dialpad</Title>
      <Description>
        Component to render a Dialpad. This component allows numbers and +, *, # input by clicking on dialpad or using
        keyboard
      </Description>
      <Heading>Example Dialpad</Heading>
      <Canvas mdxSource={ExampleDialpadText}>
        <DialpadExample />
      </Canvas>
      <Heading>Example Dialpad with custom content</Heading>
      <Description>
        This example showcases how to customize the format for dialpad input using onChange, how to grab textfield
        values using onChange and how to add extra functionality to dialpad buttons.
      </Description>
      <Canvas mdxSource={CustomDialpadText}>
        <CustomDialpadExample />
      </Canvas>
      <Heading>Dialpad Props</Heading>
      <Props of={DialpadComponent} />
    </>
  );
};

const DialpadStory = (): JSX.Element => {
  const theme = useTheme();

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '75%'
      })}
    >
      <DialpadComponent />
    </div>
  );
};

export const Dialpad = DialpadStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-dialpad`,
  title: `${COMPONENT_FOLDER_PREFIX}/Dialpad`,
  component: DialpadComponent,
  argTypes: {
    strings: hiddenControl,
    onSendDtmfTone: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
