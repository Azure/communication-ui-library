// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Portal } from '@fluentui/react-portal';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useMemo } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  callLocator: controlsToAdd.callLocator
};

const ReactPortalsExampleStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllKnobsSet = !!args.callLocator && !!args.userId && !!args.token && !!args.displayName;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <NewWindow>
          <ContosoCallContainer
            fluentTheme={context.theme}
            locator={args.callLocator}
            userId={{ communicationUserId: args.userId }}
            token={args.token}
            displayName={args.displayName}
            locale={compositeLocale(locale)}
          />
        </NewWindow>
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

const NewWindow = (props: { children: React.ReactChild; close?: () => void }): JSX.Element => {
  const newWindow = useMemo(
    () =>
      window.open(
        'about:blank',
        'newWin',
        `width=400,height=300,left=${window.screen.availWidth / 2 - 200},top=${window.screen.availHeight / 2 - 150}`
      ),
    []
  );
  newWindow &&
    (newWindow.onbeforeunload = () => {
      props.close?.();
    });

  if (!newWindow || !props.children) {
    console.log('Could not render in new window', newWindow, props.children);
    return <>Err: Could not render in new window</>;
  }

  return <Portal>hello</Portal>;
};

export const ReactPortalsExample = ReactPortalsExampleStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-reactportalsexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/React Portals Example`,
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
