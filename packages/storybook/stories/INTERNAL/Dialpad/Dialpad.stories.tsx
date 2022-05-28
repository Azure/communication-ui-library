// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { _Dialpad as DialpadComponent, useTheme } from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { CustomDialpadExample } from './snippets/CustomDialpad.snippet';
import { DialpadExample } from './snippets/Dialpad.snippet';

const CustomDialpadText = require('!!raw-loader!./snippets/CustomDialpad.snippet.tsx').default;
const ExampleDialpadText = require('!!raw-loader!./snippets/Dialpad.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
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
        On Dialpad button click, the corresponding primaryContentToDtmfMapping will be logged on the console Note that
        primaryContentToDtmfMapping and onSendDtmfTones need to be defined with custom dialpad content This example also
        showcase how to customize the format for dialpad input Note that dialpad only allows numeric inputs/special
        characters including +, * and #
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

  const dialpadStrings = {
    defaultText: 'Enter a number'
  };

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '75%'
      })}
    >
      <DialpadComponent strings={dialpadStrings} />
    </div>
  );
};

export const Dialpad = DialpadStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-dialpad`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Dialpad`,
  component: DialpadComponent,
  argTypes: {
    strings: hiddenControl,
    onSendDtmfTones: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
