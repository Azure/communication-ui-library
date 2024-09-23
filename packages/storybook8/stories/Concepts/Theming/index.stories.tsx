// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { DarkControlBar as DarkControlBarSnippet } from './DarkControlBar.story';
import { DefaultTheme as DefaultThemeSnippet } from './DefaultTheme.story';
import { ThemedButton as ThemedButtonSnippet } from './ThemedButton.story';

export const DarkControlBarDocsOnly = {
  render: DarkControlBarSnippet
};

export const DefaultThemeDocsOnly = {
  render: DefaultThemeSnippet
};

export const ThemedButtonDocsOnly = {
  render: ThemedButtonSnippet
};

const meta: Meta = {
  title: 'Concepts/Theming',
  component: DefaultThemeSnippet,
  argTypes: {}
};

export default meta;
