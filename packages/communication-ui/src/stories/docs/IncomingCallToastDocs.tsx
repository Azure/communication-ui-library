// © Microsoft Corporation. All rights reserved.

import React from 'react';

import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { IncomingCallToast } from '../../components/IncomingCallAlerts';
import { mergeThemes, Provider, teamsTheme } from '@fluentui/react-northstar';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';

const importStatement = `
import { IncomingCallToast } from '@azure/acs-ui-sdk';
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

const IncomingCallToastExample: () => JSX.Element = () => {
  const defaultIncomingCall = {
    callerName: 'Maximus Aurelius',
    alertText: 'You are being summoned...',
    avatar: undefined,
    onClickAccept: () => null,
    onClickReject: () => null
  };

  return (
    <Provider theme={mergeThemes(iconTheme, teamsTheme)}>
      <IncomingCallToast {...defaultIncomingCall} />
    </Provider>
  );
};

const exampleCode = `
const IncomingCallToastExample: () => JSX.Element = () => {
  const defaultIncomingCall = {
    callerName: 'Maximus Aurelius',
    alertText: 'You are being summoned...',
    avatar: undefined,
    // User needs to provide functions that handle call behavior.
    onClickAccept: () => { await accept(call); },
    onClickReject: () => { await reject(call); }
  };

  return <IncomingCallToast {...defaultIncomingCall} />;
};
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>IncomingCallToast</Title>
      <Description>
        The IncomingCallToast Component alerts about an incoming call. It can render a custom avatar image, caller name
        and incoming call alert text. It also supports custom actions for the call end and receive buttons. By default,
        the call end and receive buttons do not have an effect. User will need to provide the `onClickAccept` and
        `onClickReject` functions that handle the call.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <IncomingCallToastExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={IncomingCallToast} />
    </>
  );
};
