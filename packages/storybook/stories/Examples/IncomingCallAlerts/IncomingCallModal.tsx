// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text, files, boolean } from '@storybook/addon-knobs';
import React from 'react';
import { IncomingCallModal as IncomingCallModalComponent } from 'react-composites';
import { renderVideoStream } from '../../utils';

export const IncomingCallModal: () => JSX.Element = () => {
  const alertText = text('Alert Text', 'Incoming Video Call');
  const callerName = text('Caller Name', 'Maximus Aurelius');
  const callerNameAlt = text('Caller Name Alt', '1st');
  const callerTitle = text('Caller Title', 'Emperor and Philosopher, Rome');
  const images = files('Avatar', '.jpeg, .jpg, .png', []);
  const localParticipantDisplayName = text('Local Participant displayName', 'John Doe');
  const localVideoStreamEnabled = boolean('Turn Local Video On', true);
  const showLocalVideo = boolean('Show Local Video', true);
  const localVideoInverted = boolean('Invert Local Video', true);

  const streamElement = localVideoStreamEnabled ? renderVideoStream() : null;

  return (
    <IncomingCallModalComponent
      callerName={callerName}
      callerNameAlt={callerNameAlt}
      callerTitle={callerTitle}
      alertText={alertText}
      avatar={images.length > 0 ? images[0] : undefined}
      onClickVideoToggle={() => null}
      onClickAccept={() => null}
      onClickReject={() => null}
      localParticipantDisplayName={localParticipantDisplayName}
      localVideoInverted={localVideoInverted}
      showLocalVideo={showLocalVideo}
      localVideoStreamElement={streamElement}
    />
  );
};
