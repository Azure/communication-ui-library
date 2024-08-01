// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoCallContainerPSTN } from './snippets/ContainerPSTN.snippet';
import { ConfigStartPSTNHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  targetParticipants: controlsToAdd.targetParticipantsPSTN,
  alternateCallerId: controlsToAdd.alternateCallerId,
  compositeFormFactor: controlsToAdd.formFactor
};

const StartPSTNCallStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet =
    !!args.targetParticipants && !!args.userId && !!args.token && !!args.displayName && !!args.alternateCallerId;

  location.hash = '#pstn-and-1-n-calling';

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCallContainerPSTN
          alternateCallerId={args.alternateCallerId}
          fluentTheme={context.theme}
          rtl={context.globals.rtl === 'rtl'}
          targetCallees={args.targetParticipants}
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

const meta: Meta = {
  title: 'Composites/CallComposite/Start PSTN Call Example',
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  args: {
    userId: '',
    token: '',
    displayName: '',
    targetParticipants: '',
    alternateCallerId: '',
    compositeFormFactor: 'desktop'
  }
};
export default meta;
