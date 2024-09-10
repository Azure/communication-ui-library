// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
import { PartialTheme, Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useMemo } from 'react';
import { v1 as createGUID } from 'uuid';
import { compositeExperienceContainerStyle } from '../../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, getControlledTheme, ArgsFrom } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  theme: controlsToAdd.theme,
  font: controlsToAdd.font,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL
};

const ThemeExampleStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
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

  const theme: PartialTheme = {
    ...getControlledTheme(args.theme),
    // The default themes exported by fluent samples, enforce Segoe UI using the `fonts` attribute in theme object.
    // To override it, we need to set the `fonts` attribute to `undefined` in the theme object.
    fonts: {},
    defaultFontStyle: { fontFamily: args.font ?? 'Segoe UI' }
  };

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoCallContainer
          displayName={args.displayName}
          fluentTheme={theme}
          rtl={context.globals.rtl === 'rtl'}
          {...containerProps}
          callInvitationURL={args.callInvitationURL}
          locale={compositeLocale(locale)}
          formFactor={args.compositeFormFactor}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const ThemeExample = ThemeExampleStory.bind({});

const meta: Meta = {
  title: 'Composites/CallComposite/Theme Example',
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
    theme: 'Default',
    font: 'Monaco, Menlo, Consolas',
    compositeFormFactor: 'desktop',
    callInvitationURL: ''
  }
};
export default meta;
