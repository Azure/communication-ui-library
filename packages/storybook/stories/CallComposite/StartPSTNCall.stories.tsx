// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { ContosoCallContainerPSTN } from './snippets/ContainerPSTN.snippet';
import { ConfigStartPSTNHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  callLocator: controlsToAdd.callParticipantsLocator,
  alternateCallerId: controlsToAdd.alternateCallerId,
  compositeFormFactor: controlsToAdd.formFactor
};

const StartPSTNCallStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet =
    !!args.callLocator && !!args.userId && !!args.token && !!args.displayName && !!args.alternateCallerId;

  location.hash = '#pstn-and-1-n-calling';

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
          locale={compositeLocale(locale)}
          formFactor={args.compositeFormFactor}
        />
      ) : (
        <ConfigStartPSTNHintBanner />
      )}
    </Stack>
  );
};

export const StartPSTNCallExample = StartPSTNCallStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-startpstncall`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/PSTN Call/Start PSTN Call Example`,
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    previewTabs: { 'storybook/docs/panel': { hidden: true } },
    viewMode: 'story'
  }
} as Meta;
