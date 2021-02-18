// © Microsoft Corporation. All rights reserved.

import React from 'react';

import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { IncomingCallModal } from '../../components/IncomingCallAlerts';
import { mergeThemes, Provider, teamsTheme } from '@fluentui/react-northstar';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
import { VideoContainerProps } from '../../consumers';

const importStatement = `
import { IncomingCallModal } from '@azure/communication-ui';
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

const IncomingCallModalExample: () => JSX.Element = () => {
  const defaultIncomingCall = {
    callerName: 'Maximus Aurelius',
    callerNameAlt: '2nd',
    callerTitle: 'Works at Somewhere',
    alertText: 'Incoming Video Call',
    avatar: undefined,
    localParticipantName: 'John Doe',
    localVideoInverted: true,
    showLocalVideo: true,
    localVideoStream: undefined,
    onClickAccept: () => null,
    onClickReject: () => null,
    onClickVideoToggle: () => null
  };

  return (
    <Provider theme={mergeThemes(iconTheme, teamsTheme)}>
      <IncomingCallModal
        {...defaultIncomingCall}
        connectLocalMediaGalleryTileWithData={
          (/*ownProps: LocalVideoContainerOwnProps*/): VideoContainerProps => {
            return {
              isVideoReady: false,
              // Add your logic of rendering local video stream using ownProps.scalingMode
              // e.g: localVideoStreamElement: renderVideoStream(ownProps.scalingMode);
              videoStreamElement: null
            };
          }
        }
      />
    </Provider>
  );
};

const exampleCode = `
const IncomingCallModalExample: () => JSX.Element = () => {
  const defaultIncomingCall = {
    callerName: 'Maximus Aurelius',
    callerNameAlt: '2nd',
    callerTitle: 'Works at Somewhere',
    alertText: 'Incoming Video Call',
    avatar: undefined,
    localParticipantName: 'John Doe',
    localVideoInverted: true,
    showLocalVideo: true,
    // User needs to provide functions that handle call behavior.
    onClickAccept: () => null,
    onClickReject: () => null,
    onClickVideoToggle: () => null
  };

  return <IncomingCallModal {...defaultIncomingCall} />;
};
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>IncomingCallModal</Title>
      <Description>
        The IncomingCallModal Component alerts about an incoming call. It can render a custom avatar image, local video
        preview, caller name, title, and incoming call alert text. It also supports custom actions for the call end and
        receive buttons. By default, the call end and receive buttons do not have an effect. User will need to provide
        the `onClickAccept` and `onClickReject` functions that handle the call.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <IncomingCallModalExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={IncomingCallModal} />
    </>
  );
};
