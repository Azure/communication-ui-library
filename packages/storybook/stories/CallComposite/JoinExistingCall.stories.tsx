// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useRef } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigJoinCallHintBanner } from './snippets/Utils';

const JoinExistingCallStory: (args) => JSX.Element = (args) => {
  const controls = useRef({
    callLocator: args.callLocator,
    userId: args.userId,
    token: args.token,
    displayName: args.displayName,
    callInvitationURL: args.callInvitationURL
  });

  const areAllKnobsSet =
    !!controls.current.callLocator &&
    !!controls.current.userId &&
    !!controls.current.token &&
    !!controls.current.displayName;
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCallContainer
          locator={controls.current.callLocator}
          userId={{ communicationUserId: controls.current.userId }}
          token={controls.current.token}
          displayName={controls.current.displayName}
          callInvitationURL={controls.current.callInvitationURL}
        />
      ) : (
        <ConfigJoinCallHintBanner />
      )}
    </Stack>
  );
};

export const JoinExistingCall = JoinExistingCallStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-joinexistingcall`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Join Existing Call`,
  component: CallComposite,
  argTypes: {
    callLocator: { control: 'text', defaultValue: '', name: 'Call locator (ACS group ID or Teams meeting link)' },
    userId: { control: 'text', defaultValue: '', name: 'User identifier for user' },
    token: { control: 'text', defaultValue: '', name: 'Valid token for user' },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    callInvitationURL: {
      control: 'text',
      defaultValue: '',
      name: 'Optional URL to invite other participants to the call'
    },
    // Hiding auto-generated controls
    adapter: { control: false, table: { disable: true } },
    fluentTheme: { control: false, table: { disable: true } },
    onRenderAvatar: { control: false, table: { disable: true } },
    identifiers: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
