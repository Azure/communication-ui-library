// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { lightTheme, darkTheme } from '@azure/communication-react';
import { PartialTheme } from '@fluentui/react';

export const THEMES: Record<string, { name: string; theme: PartialTheme }> = {
  Light: {
    name: 'Light',
    theme: lightTheme
  },
  Dark: {
    name: 'Dark',
    theme: darkTheme
  }
};
