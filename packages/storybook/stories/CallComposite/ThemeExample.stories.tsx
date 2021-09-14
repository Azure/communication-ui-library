// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { PartialTheme, Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, getControlledTheme } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { createUserAndGroup } from './snippets/Server.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const ThemeExampleStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState();

  useEffect(() => {
    const fetchContainerProps = async (): Promise<void> => {
      if (args.connectionString && args.displayName) {
        const newProps = await createUserAndGroup(args.connectionString);
        setContainerProps(newProps);
      } else {
        setContainerProps(undefined);
      }
    };
    fetchContainerProps();
  }, [args.connectionString, args.displayName]);

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
    connectionString: controlsToAdd.connectionString,
    displayName: controlsToAdd.displayName,
    theme: controlsToAdd.theme,
    font: controlsToAdd.font,
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
