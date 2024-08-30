import { Meta } from '@storybook/react';
import { ComplianceBanner as ComplianceBannerComponent } from './ComplianceBanner.story';

export const ComplianceBanner = {
  render: ComplianceBannerComponent
};

export default {
  title: 'Concepts/Teams Interop/Compliance Banner',
  component: ComplianceBannerComponent,
  argTypes: {
    callRecordState: { control: 'boolean', defaultValue: false, name: 'Is recording on?' },
    callTranscribeState: { control: 'boolean', defaultValue: false, name: 'Is transcription on?' }
  },
  args: {}
} as Meta;
