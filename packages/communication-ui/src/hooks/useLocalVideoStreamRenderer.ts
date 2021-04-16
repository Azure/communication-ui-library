// © Microsoft Corporation. All rights reserved.
import {
  LocalVideoStream,
  VideoStreamRenderer,
  CreateViewOptions,
  VideoStreamRendererView
} from '@azure/communication-calling';
import { useCallContext } from '../providers';
import { useEffect, useRef, useState } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useTriggerOnErrorCallback } from '../providers/ErrorProvider';
import { propagateError } from '../utils/SDKUtils';

export type UseLocalVideoStreamType = {
  render: HTMLElement | null;
  isAvailable: boolean;
};

// Handles logic for how to creating an HTMLElement to represent the local video stream
// It also has an event handler to say when the stream is available or not since it can be difficult to tell from the returned HTMLElement.
export default (
  stream: LocalVideoStream | undefined,
  rendererOptions: CreateViewOptions | undefined
): UseLocalVideoStreamType => {
  const onErrorCallback = useTriggerOnErrorCallback();
  const { setLocalVideoRendererBusy } = useCallContext();
  const [render, setRender] = useState<HTMLElement | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [options] = useState<CreateViewOptions | undefined>(rendererOptions);
  const rendererViewRef: React.MutableRefObject<VideoStreamRendererView | null> = useRef(null);

  const cleanUp = (): void => {
    if (rendererViewRef.current && rendererViewRef.current.dispose) {
      rendererViewRef.current.dispose();
      setRender(null);
    }
  };

  useEffect(() => {
    const renderStream = async (stream: LocalVideoStream): Promise<void> => {
      setLocalVideoRendererBusy(true);
      const renderer = new VideoStreamRenderer(stream);
      try {
        rendererViewRef.current = await renderer.createView(options);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error rendering remove video',
          code: CommunicationUiErrorCode.RENDER_LOCAL_VIDEO_ERROR,
          error: error
        });
      }
      setRender(rendererViewRef.current.target);
      setIsAvailable(true);
      setLocalVideoRendererBusy(false);
    };

    if (stream) {
      renderStream(stream).catch((error) => {
        propagateError(error, onErrorCallback);
      });
    } else {
      cleanUp();
      setIsAvailable(false);
    }

    return cleanUp;
  }, [stream, options, setLocalVideoRendererBusy, onErrorCallback]);

  return { render, isAvailable };
};
