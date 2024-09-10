// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useMemo } from 'react';
import { v1 as createGUID } from 'uuid';
import { compositeExperienceContainerStyle } from '../../constants';
import { ArgsFrom, controlsToAdd, defaultCallCompositeHiddenControls, hiddenControl } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL,
  errorBar: controlsToAdd.showErrorBar
};

const BasicStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
  const {
    globals: { locale }
  } = context;

  const containerProps = useMemo(() => {
    if (args.userId && args.token) {
      const containerProps = {
        userId: { communicationUserId: args.userId },
        token: args.token,
        locator: createGUID()
      };
      return containerProps;
    }
    return undefined;
  }, [args.userId, args.token]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoCallContainer
          fluentTheme={context.theme}
          rtl={context.globals.rtl === 'rtl'}
          displayName={args.displayName}
          {...containerProps}
          callInvitationURL={args.callInvitationURL}
          locale={compositeLocale(locale)}
          formFactor={args.compositeFormFactor}
          options={{ errorBar: args.errorBar }}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const BasicExample = BasicStory.bind({});

const meta: Meta = {
  title: 'Composites/CallComposite/Basic Example',
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  args: {
    userId: '',
    token: '',
    displayName: 'John Smith',
    callInvitationURL: '',
    compositeFormFactor: 'desktop',
    errorBar: true
  }
};

export default meta;
