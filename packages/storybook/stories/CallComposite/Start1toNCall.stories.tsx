// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { ContosoCallContainer1toNInbound } from './snippets/Container1toNInbound.snippet';
import { ContosoCallContainer1toN } from './snippets/Container1toNOutbound.snippet';
import { ConfigStart1ToNHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  calleeUserId: controlsToAdd.calleeUserId,
  calleeToken: controlsToAdd.calleeToken,
  compositeFormFactor: controlsToAdd.formFactor
};

const Start1toNCallStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.userId && !!args.token && !!args.displayName && !!args.calleeUserId;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <div style={{ height: '100vh', display: 'flex', width: '100%' }}>
          <div style={args.calleeToken ? { width: '65%' } : { width: '100%' }}>
            <ContosoCallContainer1toN
              fluentTheme={context.theme}
              locator={[args.calleeUserId]}
              userId={{ communicationUserId: args.userId }}
              token={args.token}
              displayName={args.displayName}
              locale={compositeLocale(locale)}
              formFactor={args.compositeFormFactor}
            />
          </div>
          {!!args.calleeToken && !!args.calleeUserId && (
            <div style={{ width: '35%' }}>
              <ContosoCallContainer1toNInbound
                fluentTheme={context.theme}
                userId={{ communicationUserId: args.calleeUserId }}
                token={args.calleeToken}
                locale={compositeLocale(locale)}
                formFactor={args.compositeFormFactor}
              />
            </div>
          )}
        </div>
      ) : (
        <ConfigStart1ToNHintBanner />
      )}
    </Stack>
  );
};

export const Start1ToNCallExample = Start1toNCallStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-start1toncall`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/1:N Call/Start 1 To N Call Example`,
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
