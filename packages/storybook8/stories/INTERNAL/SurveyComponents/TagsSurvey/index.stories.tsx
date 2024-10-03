// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { _TagsSurvey as TagsSurveyComponent } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../../controlsUtils';
import { TagsSurveyExample } from './snippets/TagsSurvey.snippet';
export { TagsSurvey } from './TagsSurvey.story';

export const TagsSurveyExampleDocsOnly = {
  render: TagsSurveyExample
};
export default {
  title: 'Components/Internal/Survey Components/Tags Survey',
  component: TagsSurveyComponent,
  argTypes: {
    callIssuesToTag: hiddenControl,
    categoryHeadings: hiddenControl,
    onConfirm: hiddenControl,
    strings: hiddenControl
  },
  parameters: {},
  args: {}
} as Meta;
