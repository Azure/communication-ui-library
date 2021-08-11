// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Description, Heading, Source, Title } from '@storybook/addon-docs';
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
        Example Themes that can be leveraged by developers to provide color schemes to UI Components
      </Description>
      <Heading>Teams-Like Theme</Heading>
      <Source code={exampleTeamsTheme} />
    </>
  );
};

const TeamsStory: () => JSX.Element = () => {
  return <TeamsTheme />;
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
