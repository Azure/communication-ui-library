// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { getDocs } from './ThemesDocs';
import { EXAMPLES_FOLDER_PREFIX } from '../constants';

export const TeamsThemeComponent: () => JSX.Element = () => {
  return <div>Placeholder</div>;
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Themes`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
