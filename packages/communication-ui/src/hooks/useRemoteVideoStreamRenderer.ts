// © Microsoft Corporation. All rights reserved.
import { RemoteVideoStream, Renderer, RendererOptions, RendererView } from '@azure/communication-calling';
import { useEffect, useState, useRef } from 'react';

export type UseRemoteVideoStreamType = {
  render: HTMLElement | null;
  isAvailable: boolean;
};

// Handles logic for how to creating an HTMLElement to represent the remote video stream.
// It also has an event handler to say when the stream is available or not since it can be difficult to tell from the returned HTMLElement.
export default (
  stream: RemoteVideoStream | undefined,
  options?: RendererOptions | undefined
): UseRemoteVideoStreamType => {
  const [render, setRender] = useState<HTMLElement | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const rendererViewRef: React.MutableRefObject<RendererView | null> = useRef(null);

  useEffect(() => {
    const renderStream = async (
      stream: RemoteVideoStream | undefined,
      renderViewRef: RendererView | null
    ): Promise<void> => {
      if (!stream) {
        setRender(null);
        setIsAvailable(false);
      }
      if (stream && stream.isAvailable) {
        if (render === null) {
          const renderer = new Renderer(stream);
          renderViewRef = await renderer.createView(options);
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
      renderStream(stream, rendererViewRef.current);
    }

    const onAvailabilityChanged = async (): Promise<void> => await renderStream(stream, rendererViewRef.current);
    stream?.on('availabilityChanged', onAvailabilityChanged);

    return () => {
      stream?.off('availabilityChanged', onAvailabilityChanged);
    };
  }, [stream, options, render, rendererViewRef]);

  return { render, isAvailable };
};
