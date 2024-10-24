// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { useVideoStreams } from '../../../utils';
import { IncomingCallModal as IncomingCallModalComponent } from './snippets/exampleIncomingCallModal.snippet';

const IncomingCallModalStory = (args): JSX.Element => {
  const videoStreamElements = useVideoStreams(args.localVideoStreamEnabled ? 1 : 0);
  const videoStreamElement = videoStreamElements[0] ? videoStreamElements[0] : null;

  const [showLocalVideo, setShowLocalVideo] = useState<boolean>(false);

  return (
    <IncomingCallModalComponent
      callerName={args.callerName}
      callerNameAlt={args.callerNameAlt}
      callerTitle={args.callerTitle}
      alertText={args.alertText}
      avatar={args.images.length > 0 ? args.images[0] : undefined}
      onClickVideoToggle={() => setShowLocalVideo(!showLocalVideo)}
      onClickAccept={() => null}
      onClickReject={() => null}
      localParticipantDisplayName={args.localParticipantDisplayName}
      localVideoInverted={args.localVideoInverted}
      localVideoStreamElement={showLocalVideo ? videoStreamElement : null}
    />
  );
};

export const IncomingCallModal = IncomingCallModalStory.bind({});
