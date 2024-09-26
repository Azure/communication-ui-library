import { Meta } from '@storybook/react/*';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { IncomingCallModal as IncomingCallModalStory } from './IncomingCallModal.story';

export const IncomingCallModal = {
  render: IncomingCallModalStory
};

export default {
  id: 'examples-incomingcallalerts-incomingcallmodal',
  title: 'examples/Incoming Call Alerts/Incoming Call Modal',
  component: IncomingCallModalStory,
  argTypes: {
    alertText: controlsToAdd.callModalAlertText,
    callerName: controlsToAdd.callerName,
    callerNameAlt: controlsToAdd.callerNameAlt,
    callerTitle: controlsToAdd.callerTitle,
    images: controlsToAdd.callerImages,
    localParticipantDisplayName: controlsToAdd.localParticipantDisplayName,
    localVideoStreamEnabled: controlsToAdd.localVideoStreamEnabled,
    localVideoInverted: controlsToAdd.localVideoInverted,
    // Hiding auto-generated controls
    avatar: hiddenControl,
    onClickAccept: hiddenControl,
    onClickReject: hiddenControl,
    localVideoStreamElement: hiddenControl,
    onClickVideoToggle: hiddenControl
  },
  args: {
    alertText: controlsToAdd.callModalAlertText.defaultValue,
    callerName: controlsToAdd.callerName.defaultValue,
    callerNameAlt: controlsToAdd.callerNameAlt.defaultValue,
    callerTitle: controlsToAdd.callerTitle.defaultValue,
    images: controlsToAdd.callerImages.defaultValue,
    localParticipantDisplayName: controlsToAdd.localParticipantDisplayName.defaultValue,
    localVideoStreamEnabled: controlsToAdd.localVideoStreamEnabled.defaultValue,
    localVideoInverted: controlsToAdd.localVideoInverted.defaultValue
  }
} as Meta;
