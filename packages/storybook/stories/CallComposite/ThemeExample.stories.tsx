// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { PartialTheme, Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
import { v1 as createGUID } from 'uuid';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, getControlledTheme } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const ThemeExampleStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;

  const containerProps = useMemo(() => {
    if (args.userId && args.token) {
      const containerProps = {
        userId: args.userId,
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
          {...containerProps}
          callInvitationURL={args.callInvitationURL}
          locale={compositeLocale(locale)}
          formFactor={args.formFactor}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const ThemeExample = ThemeExampleStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-themeexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Theme Example`,
  component: CallComposite,
  argTypes: {
    userId: controlsToAdd.userId,
    token: controlsToAdd.token,
    displayName: controlsToAdd.displayName,
    theme: controlsToAdd.theme,
    font: controlsToAdd.font,
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
