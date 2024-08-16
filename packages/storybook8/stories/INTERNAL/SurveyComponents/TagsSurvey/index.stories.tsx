import { _TagsSurvey as TagsSurveyComponent } from '@internal/react-components';
import { hiddenControl } from '../../../controlsUtils';
import { Meta } from '@storybook/react';
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
