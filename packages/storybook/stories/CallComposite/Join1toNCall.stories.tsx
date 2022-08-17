// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer1toN } from './snippets/Container1toN.snippet';
import { ConfigJoinCallHintBanner } from './snippets/Utils';

const Join1toNCallStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.callLocator && !!args.userId && !!args.token && !!args.displayName;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCallContainer1toN
          fluentTheme={context.theme}
          locator={args.callLocator}
          userId={{ communicationUserId: args.userId }}
          token={args.token}
          displayName={args.displayName}
          callInvitationURL={args.callInvitationURL}
          locale={compositeLocale(locale)}
          formFactor={args.formFactor}
        />
      ) : (
        <ConfigJoinCallHintBanner />
      )}
    </Stack>
  );
};

export const Join1toNCall = Join1toNCallStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-join1toncall`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Join 1 To N Call`,
  component: CallComposite,
  argTypes: {
    userId: controlsToAdd.userId,
    token: controlsToAdd.token,
    displayName: controlsToAdd.displayName,
    callLocator: controlsToAdd.callParticipantsLocator,
    formFactor: controlsToAdd.formFactor,
    callInvitationURL: controlsToAdd.callInvitationURL,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
