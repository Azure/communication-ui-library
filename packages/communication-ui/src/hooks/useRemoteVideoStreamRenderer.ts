// © Microsoft Corporation. All rights reserved.
import {
  RemoteVideoStream,
  VideoStreamRenderer,
  CreateViewOptions,
  VideoStreamRendererView
} from '@azure/communication-calling';
import { useEffect, useState, useRef } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useTriggerOnErrorCallback } from '../providers/ErrorProvider';
import { propagateError } from '../utils/SDKUtils';

export type UseRemoteVideoStreamType = {
  render: HTMLElement | null;
  isAvailable: boolean;
};

// Handles logic for how to creating an HTMLElement to represent the remote video stream.
// It also has an event handler to say when the stream is available or not since it can be difficult to tell from the returned HTMLElement.
export default (
  stream: RemoteVideoStream | undefined,
  options?: CreateViewOptions | undefined
): UseRemoteVideoStreamType => {
  const onErrorCallback = useTriggerOnErrorCallback();
  const [render, setRender] = useState<HTMLElement | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const rendererViewRef: React.MutableRefObject<VideoStreamRendererView | null> = useRef(null);

  useEffect(() => {
    const renderStream = async (
      stream: RemoteVideoStream | undefined,
      renderViewRef: VideoStreamRendererView | null
    ): Promise<void> => {
      if (!stream) {
        setRender(null);
        setIsAvailable(false);
      }
      if (stream && stream.isAvailable) {
        if (render === null) {
          const renderer = new VideoStreamRenderer(stream);
          try {
            renderViewRef = await renderer.createView(options);
          } catch (error) {
            throw new CommunicationUiError({
              message: 'Error rendering remove video',
              code: CommunicationUiErrorCode.RENDER_REMOTE_VIDEO_ERROR,
              error
            });
          }
          setRender(renderViewRef.target);
        }
        setIsAvailable(true);
      } else {
        if (rendererViewRef.current) {
          rendererViewRef.current.dispose();
          setRender(null);
        }
        setIsAvailable(false);
      }
    };

    if (!stream) {
      setRender(null);
      setIsAvailable(false);
    }

    if (stream?.isAvailable) {
      renderStream(stream, rendererViewRef.current).catch((error) => {
        propagateError(error, onErrorCallback);
      });
    }

    const onAvailabilityChanged = async (): Promise<void> => {
      try {
        await renderStream(stream, rendererViewRef.current);
      } catch (error) {
        propagateError(error, onErrorCallback);
      }
    };
    stream?.on('isAvailableChanged', onAvailabilityChanged);

    return () => {
      stream?.off('isAvailableChanged', onAvailabilityChanged);
    };
  }, [stream, options, render, rendererViewRef, onErrorCallback]);

  return { render, isAvailable };
};
