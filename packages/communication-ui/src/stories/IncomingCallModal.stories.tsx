// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { IncomingCallModal } from '../components/IncomingCallAlerts';
import { text, files, boolean } from '@storybook/addon-knobs';
import { getDocs } from './docs/IncomingCallModalDocs';
import { LocalVideoContainerOwnProps, VideoContainerProps } from '../consumers';
import { renderVideoStream } from './utils';

export const IncomingCallModalComponent: () => JSX.Element = () => {
  const alertText = text('Alert Text', 'Incoming Video Call');
  const callerName = text('Caller Name', 'Maximus Aurelius');
  const callerNameAlt = text('Caller Name Alt', '1st');
  const callerTitle = text('Caller Title', 'Emperor and Philosopher, Rome');
  const images = files('Avatar', '.jpeg, .jpg, .png', []);
  const localParticipantName = text('Local Participant Label', 'John Doe');
  const localVideoStreamEnabled = boolean('Turn Local Video On', true);
  const showLocalVideo = boolean('Show Local Video', true);
  const localVideoInverted = boolean('Invert Local Video', true);

  return (
    <IncomingCallModal
      callerName={callerName}
      callerNameAlt={callerNameAlt}
      callerTitle={callerTitle}
      alertText={alertText}
      avatar={images.length > 0 ? images[0] : undefined}
      onClickVideoToggle={() => null}
      onClickAccept={() => null}
      onClickReject={() => null}
      localParticipantName={localParticipantName}
      localVideoInverted={localVideoInverted}
      showLocalVideo={showLocalVideo}
      localVideoStream={undefined}
      connectLocalMediaGalleryTileWithData={(ownProps: LocalVideoContainerOwnProps): VideoContainerProps => {
        const localVideoStreamElement = localVideoStreamEnabled ? renderVideoStream(ownProps.scalingMode) : null;
        return {
          isVideoReady: localVideoStreamEnabled,
          videoStreamElement: localVideoStreamElement
        };
      }}
    />
  );
};

export default {
  title: 'ACS Components/IncomingCallModal',
  component: IncomingCallModalComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
