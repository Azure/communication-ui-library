// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React from 'react';
import { compositeExperienceContainerStyle } from '../../../constants';
import { compositeLocale } from '../../../localizationUtils';
import { ConfigStartPSTNHintBanner } from '../snippets/Utils';
import { ContosoCallContainerPSTN } from './snippets/ContainerPSTN.snippet';

const StartPSTNCallStory = (args: any, context: any): JSX.Element => {
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
