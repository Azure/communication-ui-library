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
import { ContosoCallContainerPSTN } from './snippets/ContainerPSTN.snippet';
import { ConfigJoinCallHintBanner } from './snippets/Utils';

const JoinPSTNCallStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.callLocator && !!args.userId && !!args.token && !!args.displayName;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCallContainerPSTN
          alternateCallerId={args.alternateCallerId}
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

export const JoinPSTNCall = JoinPSTNCallStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-joinpstncall`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Join PSTN Call`,
  component: CallComposite,
  argTypes: {
    userId: controlsToAdd.userId,
    token: controlsToAdd.token,
    displayName: controlsToAdd.displayName,
    callLocator: controlsToAdd.callParticipantsLocator,
    alternateCallerId: controlsToAdd.alternateCallerId,
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
