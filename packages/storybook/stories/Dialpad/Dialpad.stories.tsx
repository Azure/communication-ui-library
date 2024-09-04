// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Dialpad as DialpadComponent, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import MobileDetect from 'mobile-detect';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { hiddenControl } from '../controlsUtils';
import { CustomDialpadExample } from './snippets/CustomDialpad.snippet';
import { DialpadExample } from './snippets/Dialpad.snippet';
import { DialerExample } from './snippets/DialpadDialer.snippet';

const CustomDialpadText = require('!!raw-loader!./snippets/CustomDialpad.snippet.tsx').default;
const ExampleDialpadText = require('!!raw-loader!./snippets/Dialpad.snippet.tsx').default;
const DialerExampleText = require('!!raw-loader!./snippets/DialpadDialer.snippet.tsx').default;

export const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const getDocs: () => JSX.Element = () => {
  const isTouchOnlyDevice = !!new MobileDetect(window.navigator.userAgent).mobile() || isIOS();
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Dialpad</Title>
      <Heading>Dialpad modes</Heading>
      <Description>
        The Dialpad component is versatile in its usage. Like on a physical phone, the dialpad can have many different
        roles. Our Dialpad component is designed to accommodate different scenarios encountered in calling experiences.
      </Description>
      <Subheading>Dialer Mode</Subheading>
      <Description>
        This is the default mode of the Dialpad component. In this mode you are able to enter and edit numbers in the
        Dialpad's input box. The typical scenario to use this mode is when you are dialling a phone number to call the
        number, or to dial in a new participant into an ongoing call.
      </Description>
      <Canvas mdxSource={DialerExampleText}>
        <DialerExample isTouchOnlyDevice={isTouchOnlyDevice} />
      </Canvas>
      <Subheading>DTMF Mode</Subheading>
      <Description>
        This mode is for sending DTMF tones when in a call. These tones are used for controlling bots or other services
        that you might encounter. Each tone is mapped to a sound that is played when pressing each key. You can disable
        these sounds by using the `disableDtmfPlayback` property on the component. In this mode, the input box in the
        dialpad is hidden since you are not able to edit DTMF tones that are sent.
      </Description>
      <Canvas mdxSource={ExampleDialpadText}>
        <DialpadExample isTouchOnlyDevice={isTouchOnlyDevice} />
      </Canvas>
      <Description>
        Component to render a Dialpad. This component allows numbers and +, *, # input by clicking on dialpad or using
        keyboard
      </Description>
      <Heading>Customizing your Dialpad</Heading>
      <Description>
        We provide many different ways to customize the Dialpad component. This example showcases how to customize the
        format for dialpad input using onChange, how to grab textfield values using onChange, and how to add extra
        functionality to dialpad buttons. This overrides the included number formatting behavior to North American phone
        numbers. In this example, the sounds are also disabled.
      </Description>
      <Canvas mdxSource={CustomDialpadText}>
        <CustomDialpadExample isTouchOnlyDevice={isTouchOnlyDevice} />
      </Canvas>
      <Heading>Dialpad Props</Heading>
      <Props of={DialpadComponent} />
    </>
  );
};

const DialpadStory = (): JSX.Element => {
  const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile() || isIOS();
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
      <DialpadComponent longPressTrigger={isMobile ? 'touch' : 'mouseAndTouch'} />
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
