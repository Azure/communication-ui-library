// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useRef, useState } from 'react';
import { RemoteVideoStream, VideoStreamRenderer, VideoStreamRendererView } from '@azure/communication-calling';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { fullScreenStyle, hiddenFullScreenStyle, loadingStyle } from './styles/MediaFullScreen.styles';

import { ParticipantStream } from '../../types/ParticipantStream';
import { getACSId } from '../../utils';

export interface MediaFullScreenProps {
  activeScreenShareStream: ParticipantStream;
}

export default (props: MediaFullScreenProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const fullScreenStreamMediaId = 'fullScreenStreamMediaId';
  const rendererViewRef: React.MutableRefObject<VideoStreamRendererView | null> = useRef(null);

  /**
   * Start stream after DOM has rendered
   */

  const activeScreenShareStream = props.activeScreenShareStream;

  useEffect(() => {
    (async () => {
      if (activeScreenShareStream && activeScreenShareStream.stream) {
        const stream: RemoteVideoStream = activeScreenShareStream.stream;
        const renderer: VideoStreamRenderer = new VideoStreamRenderer(stream);
        rendererViewRef.current = await renderer.createView({ scalingMode: 'Fit' });

        const container = document.getElementById(fullScreenStreamMediaId);
        if (container && container.childElementCount === 0) {
          setLoading(false);
          container.appendChild(rendererViewRef.current.target);
        }
      } else {
        if (rendererViewRef.current) {
          rendererViewRef.current.dispose();
        }
      }
    })();
  }, [activeScreenShareStream]);

  const displayName =
    props.activeScreenShareStream.user.displayName ?? getACSId(props.activeScreenShareStream.user.identifier);

  return (
    <>
      {loading && (
        <div className={loadingStyle}>
          <Spinner label={`Loading ${displayName}'s screen`} size={SpinnerSize.xSmall} />
        </div>
      )}
      <div id={fullScreenStreamMediaId} className={loading ? hiddenFullScreenStyle : fullScreenStyle}></div>
    </>
  );
};
