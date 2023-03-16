// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  FluentThemeProvider,
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  createStatefulCallClient,
  StatefulCallClient
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Description, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useState, useMemo } from 'react';
import { v1 as createGUID } from 'uuid';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { ArgsFrom, controlsToAdd } from '../../../controlsUtils';
import CallingComponents from './CallingComponents.snippet';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL,
  errorBar: controlsToAdd.showErrorBar
};

const CaptionsInCompositeStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const containerProps = useMemo(() => {
    if (args.userId && args.token) {
      const containerProps = {
        userId: { communicationUserId: args.userId },
        displayName: args.displayName,
        token: args.token,
        locator: createGUID()
      };
      return containerProps;
    }
    return undefined;
  }, [args.userId, args.token, args.displayName]);

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();
  useEffect(() => {
    setStatefulCallClient(
      createStatefulCallClient({
        userId: { communicationUserId: containerProps?.userId.communicationUserId }
      })
    );
  }, [containerProps]);

  useEffect(() => {
    if (containerProps) {
      const tokenCredential = new AzureCommunicationTokenCredential(containerProps?.token);
      if (callAgent === undefined && statefulCallClient && containerProps?.displayName) {
        const createUserAgent = async (): Promise<void> => {
          setCallAgent(
            await statefulCallClient.createCallAgent(tokenCredential, {
              displayName: containerProps?.displayName
            })
          );
        };
        createUserAgent();
      }
    }
  }, [statefulCallClient, containerProps, callAgent]);

  useEffect(() => {
    if (callAgent !== undefined) {
      const groupId = containerProps?.locator;
      if (groupId) {
        setCall(callAgent.join({ groupId }));
      }
    }
  }, [callAgent, containerProps]);

  return (
    <>
      <FluentThemeProvider>
        {containerProps && (
          <>
            {statefulCallClient && (
              <CallClientProvider callClient={statefulCallClient}>
                {callAgent && (
                  <CallAgentProvider callAgent={callAgent}>
                    {call && (
                      <CallProvider call={call}>
                        <CallingComponents />
                      </CallProvider>
                    )}
                  </CallAgentProvider>
                )}
              </CallClientProvider>
            )}
          </>
        )}
      </FluentThemeProvider>
    </>
  );
};

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Call Composite with Captions</Title>
      <Description>This storybook page showcase how captions look within call composite</Description>
      <Stack>
        <img
          style={{ width: '100%', maxWidth: '100rem' }}
          src="images/CallCompositeWithCaptions.png"
          alt="Call composite with Captions"
        />
      </Stack>
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CaptionsInComposite = CaptionsInCompositeStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-CaptionsInComposite`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CaptionsInComposite/CaptionsInComposite`,
  component: CallingComponents,
  argTypes: {
    ...storyControls
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
