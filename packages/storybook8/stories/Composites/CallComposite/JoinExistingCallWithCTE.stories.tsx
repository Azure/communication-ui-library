// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoCTECallContainer } from './snippets/CTEContainer.snippet';
import { ConfigJoinCallHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  callLocator: controlsToAdd.teamsMeetingLink,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL
};

const JoinExistingCallAsTeamsUserStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.callLocator && !!args.userId && !!args.token;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCTECallContainer
          fluentTheme={context.theme}
          rtl={context.globals.rtl === 'rtl'}
          meetingLink={args.callLocator}
          userId={{ microsoftTeamsUserId: args.userId }}
          token={args.token}
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

export const JoinExistingCallAsTeamsUser = JoinExistingCallAsTeamsUserStory.bind({});

const meta: Meta = {
  title: 'Composites/CallComposite/Join Existing Call As Teams User',
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  args: {
    userId: '',
    token: '',
    callLocator: '',
    compositeFormFactor: 'desktop',
    callInvitationURL: ''
  }
};
export default meta;
