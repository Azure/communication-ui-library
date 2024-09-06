import { Meta } from '@storybook/react';
import { TeamsTheme as TeamsThemeExample } from './TeamsTheme.story';

export const TeamsTheme = {
  render: TeamsThemeExample
};

export default {
  id: 'examples-themes-teams',
  title: 'Examples/Themes/Teams',
  component: TeamsThemeExample,
  args: {}
} as Meta;
