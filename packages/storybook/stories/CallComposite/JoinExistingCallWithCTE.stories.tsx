// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { ContosoCTECallContainer } from './snippets/CTEContainer.snippet';
import { ConfigJoinCallHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  callLocator: controlsToAdd.teamsMeetingLink,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL
};

const JoinExistingCallAsTeamsUserStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.callLocator && !!args.userId && !!args.token;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCTECallContainer
          fluentTheme={context.theme}
          locator={args.callLocator}
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

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-joinexistingcall-asteamsuser`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Join Existing Call As Teams User`,
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
