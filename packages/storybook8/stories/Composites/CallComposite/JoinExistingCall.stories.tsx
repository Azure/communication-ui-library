// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigJoinCallHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  callLocator: controlsToAdd.callLocator,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL
};

const JoinExistingCallStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.callLocator && !!args.userId && !!args.token && !!args.displayName;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCallContainer
          fluentTheme={context.theme}
          rtl={context.globals.rtl === 'rtl'}
          locator={args.callLocator}
          userId={{ communicationUserId: args.userId }}
          token={args.token}
          displayName={args.displayName}
          callInvitationURL={args.callInvitationURL}
          locale={compositeLocale(locale)}
          formFactor={args.compositeFormFactor}
        />
      ) : (
        <ConfigJoinCallHintBanner />
      )}
    </Stack>
  );
};

export const JoinExistingCall = JoinExistingCallStory.bind({});

const meta: Meta = {
  title: 'Composites/CallComposite',
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  args: {
    userId: '',
    token: '',
    displayName: 'John Smith',
    callLocator: '',
    compositeFormFactor: 'desktop',
    callInvitationURL: ''
  }
};
export default meta;
