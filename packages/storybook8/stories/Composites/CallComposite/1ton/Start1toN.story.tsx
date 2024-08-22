// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React from 'react';
import { compositeExperienceContainerStyle } from '../../../constants';
import { controlsToAdd, ArgsFrom } from '../../../controlsUtils';
import { compositeLocale } from '../../../localizationUtils';
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

const Start1toNCallStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
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
              rtl={context.globals.rtl === 'rtl'}
              targetCallees={[args.calleeUserId]}
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
                rtl={context.globals.rtl === 'rtl'}
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
