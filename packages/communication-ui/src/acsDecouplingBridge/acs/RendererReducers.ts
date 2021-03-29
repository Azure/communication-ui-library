// © Microsoft Corporation. All rights reserved.

import { Renderer, RendererView, ScalingMode } from '@azure/communication-calling';
import { CallingState } from '../CallingState';
import { CallingStateUpdate } from './ActionsCreator';

// we might need to keep track of ACS renderers for things like dispose()?
// maybe React takes care of that for us and we don't need DOM detach logic
// TODO FIX: here we're preventing multiple adapters from being used the app
let localRendererView: RendererView | null = null;

// todo simplify only support one local renderer at a time
export const disposeLocalVideo = (): void => {
  localRendererView?.dispose();
};

export const renderLocalVideo = async (
  state: Readonly<CallingState>,
  scalingMode?: ScalingMode,
  mirrored?: boolean
): Promise<CallingStateUpdate | undefined> => {
  const video = state.call.localVideoStream;

  if (!video) {
    return;
  }

  disposeLocalVideo();

  const renderer = new Renderer(video);
  const view = await renderer.createView({ scalingMode, mirrored });
  localRendererView = view;
  const rawStream = extractStream(view);
  return (draft) => {
    draft.call.rawLocalMediaStream = rawStream;
    draft.call.localVideoElement = view.target as any;
  };
};

// hack for fun and profit
const extractStream = (view: RendererView): MediaProvider | null => {
  const div = view.target as HTMLDivElement;
  const videoElement = div.firstElementChild as HTMLVideoElement;
  return videoElement.srcObject;
};
