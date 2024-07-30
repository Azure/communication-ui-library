import { Meta } from '@storybook/react';
import { ComplianceBanner } from './ComplianceBanner.story';

export const ComplianceBannerDocsOnly = {
  render: ComplianceBanner
};

export default {
  title: 'Concepts/Teams Interop/Compliance Banner',
  component: ComplianceBanner,
  argTypes: {
    callRecordState: { control: 'boolean', defaultValue: false, name: 'Is recording on?' },
    callTranscribeState: { control: 'boolean', defaultValue: false, name: 'Is transcription on?' }
  }
} as Meta;
