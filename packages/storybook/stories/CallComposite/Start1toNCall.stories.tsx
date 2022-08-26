// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, hiddenControl } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { ContosoCallContainer1toNInbound } from './snippets/Container1toNInbound.snippet';
import { ContosoCallContainer1toN } from './snippets/Container1toNOutbound.snippet';
import { ConfigStart1ToNHintBanner } from './snippets/Utils';

const Start1toNCallStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.userId && !!args.token && !!args.displayName && !!args.calleeUserId;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <div style={{ height: '100vh', display: 'flex', width: '100%' }}>
          <div style={!!args.calleeToken ? { width: '65%' } : { width: '100%' }}>
            <ContosoCallContainer1toN
              fluentTheme={context.theme}
              locator={[args.calleeUserId]}
              userId={{ communicationUserId: args.userId }}
              token={args.token}
              displayName={args.displayName}
              locale={compositeLocale(locale)}
              formFactor={args.formFactor}
            />
          </div>
          {!!args.calleeToken && !!args.calleeUserId && (
            <div style={{ width: '35%' }}>
              <ContosoCallContainer1toNInbound
                fluentTheme={context.theme}
                userId={{ communicationUserId: args.calleeUserId }}
                token={args.calleeToken}
                locale={compositeLocale(locale)}
                formFactor={args.formFactor}
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
    userId: controlsToAdd.userId,
    token: controlsToAdd.token,
    calleeUserId: controlsToAdd.calleeUserId,
    calleeToken: controlsToAdd.calleeToken,
    displayName: controlsToAdd.displayName,
    formFactor: controlsToAdd.formFactor,
    // Hiding auto-generated controls
    role: hiddenControl,
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    previewTabs: { 'storybook/docs/panel': { hidden: true } },
    viewMode: 'story'
  }
} as Meta;
