import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';
import { Dialpad as DialpadComponent } from '@azure/communication-react';
import { CustomDialpadExample } from './snippets/CustomDialpad.snippet';
import { DialpadExample } from './snippets/Dialpad.snippet';
import { DialerExample } from './snippets/DialpadDialer.snippet';
export { Dialpad } from './Dialpad.story';

export const CustomDialpadExampleDocsOnly = {
  render: CustomDialpadExample
};

export const DialpadExampleDocsOnly = {
  render: DialpadExample
};

export const DialerExampleDocsOnly = {
  render: DialerExample
};

export default {
  title: 'Components/Dialpad',
  component: DialpadComponent,
  argTypes: {
    strings: hiddenControl,
    onSendDtmfTone: hiddenControl,
    onClickDialpadButton: hiddenControl,
    textFieldValue: hiddenControl,
    onChange: hiddenControl,
    longPressTrigger: hiddenControl,
    styles: hiddenControl,
    dtmfAudioContext: hiddenControl
  },
  args: {
    disableDtmfPlayback: false,
    dialpadMode: 'dtmf',
    showDeleteButton: true
  }
} as Meta;
