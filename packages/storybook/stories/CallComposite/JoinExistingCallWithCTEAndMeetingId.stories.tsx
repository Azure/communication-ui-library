// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { Docs } from './CallCompositeDocs';
import { ContosoCTECallContainer } from './snippets/CTEContainer.snippet';
import { ConfigJoinCallHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  teamsMeetingId: controlsToAdd.teamsMeetingId,
  teamsMeetingPasscode: controlsToAdd.teamsMeetingPasscode,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL
};

const JoinWithMeetingIdAsTeamsUserStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = args.teamsMeetingId && !!args.userId && !!args.token;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCTECallContainer
          fluentTheme={context.theme}
          rtl={context.globals.rtl === 'rtl'}
          meetingId={args.teamsMeetingId}
          meetingPasscode={args.teamsMeetingPasscode}
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

export const JoinCallWithMeetingIdAsTeamsUser = JoinWithMeetingIdAsTeamsUserStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-join-with-meetingid-asteamsuser`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Join Call With Meeting Id As Teams User`,
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      container: null,
      page: () => Docs()
    }
  }
} as Meta;
