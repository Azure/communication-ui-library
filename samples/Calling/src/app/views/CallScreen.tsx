// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier
} from '@azure/communication-common';
import {
  AzureCommunicationCallAdapterOptions,
  CallAdapter,
  CallAdapterLocator,
  CallAdapterState,
  CommonCallAdapter,
  onResolveDeepNoiseSuppressionDependencyLazy,
  onResolveVideoEffectDependencyLazy,
  TeamsCallAdapter,
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter,
  useTeamsCallAdapter
} from '@azure/communication-react';
import type { Profile, StartCallIdentifier, TeamsAdapterOptions } from '@azure/communication-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { CallCompositeContainer } from './CallCompositeContainer';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
  callLocator?: CallAdapterLocator;
  targetCallees?: StartCallIdentifier[];
  displayName: string;
  alternateCallerId?: string;
  isTeamsIdentityCall?: boolean;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, isTeamsIdentityCall } = props;
  const callIdRef = useRef<string>();

  const subscribeAdapterEvents = useCallback((adapter: CommonCallAdapter) => {
    adapter.on('error', (e) => {
      // Error is already acted upon by the Call composite, but the surrounding application could
      // add top-level error handling logic here (e.g. reporting telemetry).
      console.log('Adapter error event:', e);
    });
    adapter.onStateChange((state: CallAdapterState) => {
      const pageTitle = convertPageStateToString(state);
      document.title = `${pageTitle} - ${WEB_APP_TITLE}`;

      if (state?.call?.id && callIdRef.current !== state?.call?.id) {
        callIdRef.current = state?.call?.id;
        console.log(`Call Id: ${callIdRef.current}`);
      }
    });
    adapter.on('transferAccepted', (event) => {
      console.log('Call being transferred to: ' + event);
    });
    adapter.on('callEnded', (event) => {
      console.log('Call ended id: ' + event.callId + ' code: ' + event.code, 'subcode: ' + event.subCode);
    });
  }, []);

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const afterTeamsCallAdapterCreate = useCallback(
    async (adapter: TeamsCallAdapter): Promise<TeamsCallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const credential = useMemo(() => {
    if (isTeamsIdentityCall) {
      return new AzureCommunicationTokenCredential(token);
    }
    return createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);
  }, [token, userId, isTeamsIdentityCall]);

  if (isTeamsIdentityCall) {
    return <TeamsCallScreen afterCreate={afterTeamsCallAdapterCreate} credential={credential} {...props} />;
  }
  if (props.callLocator) {
    return <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />;
  } else {
    return (
      <AzureCommunicationOutboundCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />
    );
  }
};

type TeamsCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: TeamsCallAdapter) => Promise<TeamsCallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const TeamsCallScreen = (props: TeamsCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  var isCallConnected = 0;
  if (!(locator && 'meetingLink' in locator)) {
    throw new Error('A teams meeting locator must be provided for Teams Identity Call.');
  }

  if (!('microsoftTeamsUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const teamsAdapterOptions: TeamsAdapterOptions = useMemo(
    () => ({
      videoBackgroundOptions: {
        videoBackgroundImages
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      }
    }),
    []
  );

  const adapter = useTeamsCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      options: teamsAdapterOptions
    },
    afterCreate
  );

  useEffect(() => {
    const handleStateChange = (state: CallAdapterState) => {
      if (state.call?.state === 'Connected') {
        console.log('Call connected');
        isCallConnected = 1;
        // Perform any additional actions when the call gets connected
      } else {
        isCallConnected = 0;
        stopVideoStream();
      }

      if (state.cameraStatus === 'On') {
        if (isCallConnected === 1) {
          startVideoStream();
        }
      } else {
        stopVideoStream();
      }
    };

    adapter?.onStateChange(handleStateChange);

    async function startVideoStream() {
      console.log('Starting video stream...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    function stopVideoStream() {
      console.log('Stopping video stream...');
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      adapter?.offStateChange(handleStateChange);
      stopVideoStream();
    };
  }, [adapter]);

  useFrameAnalyzer(adapter, videoRef, canvasRef);

  return (
    <div style={{ height: '100%' }}>
      <video ref={videoRef} autoPlay style={{ display: 'none', height: 0 }} />
      <canvas ref={canvasRef} style={{ display: 'none', height: 0 }} />
      <CallCompositeContainer {...props} adapter={adapter} />
    </div>
  );
};

type AzureCommunicationCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  var isCallConnected = 0;

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        onResolveDependency: onResolveVideoEffectDependencyLazy
      },
      deepNoiseSuppressionOptions: {
        onResolveDependency: onResolveDeepNoiseSuppressionDependencyLazy,
        deepNoiseSuppressionOnByDefault: true
      },
      callingSounds: {
        callEnded: { url: 'assets/sounds/callEnded.mp3' },
        callRinging: { url: 'assets/sounds/callRinging.mp3' },
        callBusy: { url: 'assets/sounds/callBusy.mp3' }
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      },
      alternateCallerId: adapterArgs.alternateCallerId
    };
  }, [adapterArgs.alternateCallerId]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      options: callAdapterOptions
    },
    afterCreate
  );
  useEffect(() => {
    const handleStateChange = (state: CallAdapterState) => {
      if (state.call?.state === 'Connected') {
        console.log('Call connected');
        isCallConnected = 1;
        // Perform any additional actions when the call gets connected
      } else {
        isCallConnected = 0;
        stopVideoStream();
      }

      if (state.cameraStatus === 'On') {
        if (isCallConnected === 1) {
          startVideoStream();
        }
      } else {
        stopVideoStream();
      }
    };

    adapter?.onStateChange(handleStateChange);

    async function startVideoStream() {
      console.log('Starting video stream...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    function stopVideoStream() {
      console.log('Stopping video stream...');
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      adapter?.offStateChange(handleStateChange);
      stopVideoStream();
    };
  }, [adapter]);

  useFrameAnalyzer(adapter, videoRef, canvasRef);

  return (
    <div style={{ height: '100%' }}>
      <video ref={videoRef} autoPlay style={{ display: 'none', height: 0 }} />
      <canvas ref={canvasRef} style={{ display: 'none', height: 0 }} />
      <CallCompositeContainer {...props} adapter={adapter} />
    </div>
  );
};

const AzureCommunicationOutboundCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, targetCallees: targetCallees, userId, ...adapterArgs } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        onResolveDependency: onResolveVideoEffectDependencyLazy
      },
      callingSounds: {
        callEnded: { url: 'assets/sounds/callEnded.mp3' },
        callRinging: { url: 'assets/sounds/callRinging.mp3' },
        callBusy: { url: 'assets/sounds/callBusy.mp3' }
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      },

      onFetchProfile: async (userId: string, defaultProfile?: Profile): Promise<Profile | undefined> => {
        if (userId === '<28:orgid:Enter your teams app here>') {
          return { displayName: 'Teams app display name' };
        }
        return defaultProfile;
      },
      alternateCallerId: adapterArgs.alternateCallerId
    };
  }, [adapterArgs.alternateCallerId]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      targetCallees: targetCallees,
      options: callAdapterOptions
    },
    afterCreate
  );

  return (
    <div style={{ height: '100%' }}>
      <video ref={videoRef} autoPlay style={{ display: 'none', height: 0 }} />
      <canvas ref={canvasRef} style={{ display: 'none', height: 0 }} />
      <CallCompositeContainer {...props} adapter={adapter} />
    </div>
  );
};

const useFrameAnalyzer = (
  adapter: CommonCallAdapter | undefined,
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  useEffect(() => {
    let animationFrameId: number;
    async function analyzeFrame() {
      const imageUrl = await captureFrame();
      if (imageUrl && imageUrl.length > 10) {
        console.log('image url - ', imageBase64ToBlob(imageUrl));
        if (Date.now() % 5000 < 100) {
          await detectHandGestures(imageUrl);
        }
      }
      animationFrameId = requestAnimationFrame(analyzeFrame);
    }
    function startAnalyzing() {
      animationFrameId = requestAnimationFrame(analyzeFrame);
    }
    startAnalyzing();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [adapter]);
  async function captureFrame() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  }
  async function detectHandGestures(imageBase64: string) {
    const CUSTOM_VISION_ENDPOINT = 'CUSTOM_VISION_ENDPOINT';
    const CUSTOM_VISION_KEY = 'CUSTOM_VISION_KEY';
    const PREDICTION_KEY = 'PREDICTION_KEY';
    const PROJECT_ID = 'PROJECT_ID';
    const MODEL_NAME = 'MODEL_NAME';

    const response = await fetch(
      `${CUSTOM_VISION_ENDPOINT}/customvision/v3.0/Prediction/${PROJECT_ID}/detect/iterations/${MODEL_NAME}/image`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': CUSTOM_VISION_KEY,
          'Prediction-Key': PREDICTION_KEY,
          'Content-Type': 'application/octet-stream'
        },
        body: imageBase64ToBlob(imageBase64)
      }
    );

    const data = await response.json();
    console.log('Gesture detected data - \n');
    console.log(data);
    processHandGestureResults(data);
  }
  function processHandGestureResults(data: any) {
    if (!data || !data.predictions || data.predictions.length === 0) {
      console.log('⚠️ No gestures detected.');
      return;
    }

    // Get the most confident prediction
    const topGesture = data.predictions.reduce((prev: any, current: any) =>
      prev.probability > current.probability ? prev : current
    );

    console.log(`✋ Detected Gesture: ${topGesture.tagName} (${(topGesture.probability * 100).toFixed(2)}%)`);

    // Define thresholds for triggering actions
    if (topGesture.probability > 0.5) {
      switch (topGesture.tagName) {
        case 'Stop':
          //sendRealTimeAlert("🛑 'Stop' gesture detected! Action required.");
          adapter?.raiseHand();
          setTimeout(() => {
            adapter?.lowerHand();
          }, 5000);
          break;
        case 'thumbsup':
          adapter?.onReactionClick('like');
          console.log('👍 Positive gesture detected. No alert needed.');
          break;
        case 'Pointing':
          console.log('👉 Pointing gesture detected.');
          break;
        case 'happy':
          //adapter?.onReactionClick('laugh');
          break;
        case 'love':
          adapter?.onReactionClick('heart');
          break;
        default:
          console.log(`🤔 Unrecognized gesture: ${topGesture.tagName}`);
      }
    } else {
      console.log('🔍 Gesture detected but confidence is low. No action taken.');
    }
  }
  function imageBase64ToBlob(base64: string) {
    const base64Data = base64.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid base64 string');
    }
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: 'image/jpeg' });
  }
};

const convertPageStateToString = (state: CallAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'badRequest':
      return 'error';
    case 'leftCall':
      return 'end call';
    case 'removedFromCall':
      return 'end call';
    default:
      return `${state.page}`;
  }
};

const videoBackgroundImages = [
  {
    key: 'contoso',
    url: 'assets/backgrounds/contoso.png',
    tooltipText: 'Contoso Background'
  },
  {
    key: 'pastel',
    url: 'assets/backgrounds/abstract2.jpg',
    tooltipText: 'Pastel Background'
  },
  {
    key: 'rainbow',
    url: 'assets/backgrounds/abstract3.jpg',
    tooltipText: 'Rainbow Background'
  },
  {
    key: 'office',
    url: 'assets/backgrounds/room1.jpg',
    tooltipText: 'Office Background'
  },
  {
    key: 'plant',
    url: 'assets/backgrounds/room2.jpg',
    tooltipText: 'Plant Background'
  },
  {
    key: 'bedroom',
    url: 'assets/backgrounds/room3.jpg',
    tooltipText: 'Bedroom Background'
  },
  {
    key: 'livingroom',
    url: 'assets/backgrounds/room4.jpg',
    tooltipText: 'Living Room Background'
  }
];
