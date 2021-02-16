// © Microsoft Corporation. All rights reserved.
import { LocalVideoStream, Renderer, RendererOptions, RendererView } from '@azure/communication-calling';
import { useCallContext } from '../providers';
import { useEffect, useRef, useState } from 'react';

export type UseLocalVideoStreamType = {
  render: HTMLElement | null;
  isAvailable: boolean;
};

// Handles logic for how to creating an HTMLElement to represent the local video stream
// It also has an event handler to say when the stream is available or not since it can be difficult to tell from the returned HTMLElement.
export default (
  stream: LocalVideoStream | undefined,
  rendererOptions: RendererOptions | undefined
): UseLocalVideoStreamType => {
  const { setLocalVideoRendererBusy } = useCallContext();
  const [render, setRender] = useState<HTMLElement | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [options] = useState<RendererOptions | undefined>(rendererOptions);
  const rendererViewRef: React.MutableRefObject<RendererView | null> = useRef(null);

  const cleanUp = (): void => {
    if (rendererViewRef.current && rendererViewRef.current.dispose) {
      rendererViewRef.current.dispose();
      setRender(null);
    }
  };

  useEffect(() => {
    const renderStream = async (stream: LocalVideoStream): Promise<void> => {
      setLocalVideoRendererBusy(true);
      const renderer = new Renderer(stream);
      rendererViewRef.current = await renderer.createView(options);
      setRender(rendererViewRef.current.target);
      setIsAvailable(true);
      setLocalVideoRendererBusy(false);
    };

    if (stream) {
      renderStream(stream);
    } else {
      cleanUp();
      setIsAvailable(false);
    }

    return cleanUp;
  }, [stream, options, setLocalVideoRendererBusy]);

  return { render, isAvailable };
};
