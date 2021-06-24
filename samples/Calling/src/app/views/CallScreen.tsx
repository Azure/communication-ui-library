// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '@fluentui/react';
import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import {
  CallAdapter,
  CallComposite,
  createAzureCommunicationCallAdapter,
  CustomCallControlButton,
  CallControlButtonCollection,
  ControlBarButton
} from '@azure/communication-react';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { refreshTokenAsync } from '../utils/refreshToken';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { ChatIcon } from '@fluentui/react-northstar';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: GroupCallLocator | TeamsMeetingLinkLocator;
  displayName: string;
  onCallEnded: () => void;
  onCallError: (e: Error) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, callLocator, displayName, onCallEnded, onCallError } = props;
  const [adapter, setAdapter] = useState<CallAdapter>();
  const adapterRef = useRef<CallAdapter>();
  const { currentTheme } = useSwitchableFluentTheme();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const adapter = await createAzureCommunicationCallAdapter(
        userId,
        token,
        callLocator,
        displayName,
        refreshTokenAsync(userId.communicationUserId)
      );
      adapter.on('callEnded', () => {
        onCallEnded();
      });
      adapter.on('error', (e) => {
        console.error(e);
        onCallError(e);
      });
      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [callLocator, displayName, token, userId, onCallEnded, onCallError]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  const overrideCallControlButtons = (defaultButtons: CallControlButtonCollection): CallControlButtonCollection => {
    // remove camera button
    const newButtons = defaultButtons.filter((button) => button !== 'camera');

    // add custom chat button
    newButtons.push({
      labelText: 'chat',
      toggledLabelText: 'chat open!',
      icon: <ChatIcon outline={!!chatOpen} key="chatIcon" />,
      toggledIcon: <ChatIcon outline={!chatOpen} key="toggledChatIcon" />,
      onClick: () => setChatOpen(!chatOpen),
      key: 'chat'
    });
    return newButtons;
  };

  return (
    <CallComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      callInvitationURL={window.location.href}
      overrideCallControlButtons={overrideCallControlButtons}
    />
  );
};
