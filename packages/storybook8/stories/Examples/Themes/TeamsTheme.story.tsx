// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { TeamsTheme as TeamsThemeComponent } from './snippets/TeamsTheme.snippet';

const TeamsStory: () => JSX.Element = () => {
  return (
    <div style={{ width: '40rem' }}>
      <TeamsThemeComponent />
    </div>
  );
};

export const TeamsTheme = TeamsStory.bind({});
