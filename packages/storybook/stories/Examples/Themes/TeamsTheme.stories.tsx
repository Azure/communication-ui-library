// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Canvas, Description, Heading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { TeamsTheme } from './snippets/TeamsTheme.snippet';

const exampleTeamsTheme = require('!!raw-loader!./snippets/TeamsTheme.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Themes</Title>
      <Description>
        Below is an example of a [Microsoft Teams](http://teams.microsoft.com/) Theme being applied to UI Components. In
        this example a color palette that resembles Teams is provided to the FluentThemeProvider. The
        FluentThemeProvider in turn styles the UI Components.
      </Description>
      <Heading>Teams-Like Theme</Heading>
      <Canvas mdxSource={exampleTeamsTheme}>
        <TeamsTheme />
      </Canvas>
    </>
  );
};

const TeamsStory: () => JSX.Element = () => {
  return (
    <div style={{ width: '40rem' }}>
      <TeamsTheme />
    </div>
  );
};

export const Teams = TeamsStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-themes-teams`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Themes/Teams`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
