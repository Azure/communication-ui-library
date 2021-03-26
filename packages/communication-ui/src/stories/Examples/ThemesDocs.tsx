// © Microsoft Corporation. All rights reserved.

import { Description, Heading, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';

export const getDocs: () => JSX.Element = () => {
  const exampleTeamsTheme = `
    TEAMS THEME CODE`;

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
