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
  return <CallCompositeContainer {...props} adapter={adapter} />;
};

type AzureCommunicationCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  useEffect(() => {
    //console.log('AzureCommunicationCallScreen:: useEffect in action...');
    async function startVideoStream() {
      //console.log('Starting video stream...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    startVideoStream();
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    async function analyzeFrame() {
      const imageUrl = await captureFrame();

      if (imageUrl && imageUrl.length > 10) {
        console.log('image url - ', imageBase64ToBlob(imageUrl));
        await detectHandGestures(imageUrl);
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
  }, []);

  async function captureFrame() {
    console.log('Capturing frame...');
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
  async function detectHandGestures1(imageBase64: string) {
    const CUSTOM_VISION_ENDPOINT = 'https://azureaiinsravan.cognitiveservices.azure.com';
    const CUSTOM_VISION_KEY = 'Ffnb7EK1Z65PWAn9o31l5dxMV8kP1C6rIMAn2vbPRzZ3EidaEKjvJQQJ99BBACYeBjFXJ3w3AAAFACOGXhO6';
    const PREDICTION_KEY = 'ebc77a8a52e04e9394125c19f2dc8a16';
    const PROJECT_ID = 'daaea539-0d1a-456b-a0fc-31e121039d56';
    const MODEL_NAME = 'FaceExpressionAndHandGestures';

    const response = await fetch(
      //`${CUSTOM_VISION_ENDPOINT}/customvision/v3.0/Prediction/${PROJECT_ID}/classify/iterations/${MODEL_NAME}/url`,
      `https://azureaiinsravan.cognitiveservices.azure.com/customvision/v3.0/Prediction/daaea539-0d1a-456b-a0fc-31e121039d56/detect/iterations/FaceExpressionAndHandGestures/url`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': CUSTOM_VISION_KEY,
          'Prediction-Key': PREDICTION_KEY,
          'Content-Type': 'application/json'
        },
        //body: imageBase64ToBlob(imageBase64)
        body: JSON.stringify({
          Url: 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/printed_text.jpg'
        })
      }
    );

    const data = await response.json();
    console.log('Gesture detected data - \n');
    console.log(data);
  }
  async function detectHandGestures(imageBase64: string) {
    const CUSTOM_VISION_ENDPOINT = 'https://azureaiinsravan.cognitiveservices.azure.com';
    const CUSTOM_VISION_KEY = 'Ffnb7EK1Z65PWAn9o31l5dxMV8kP1C6rIMAn2vbPRzZ3EidaEKjvJQQJ99BBACYeBjFXJ3w3AAAFACOGXhO6';
    const PREDICTION_KEY = 'ebc77a8a52e04e9394125c19f2dc8a16';
    const PROJECT_ID = 'daaea539-0d1a-456b-a0fc-31e121039d56';
    const MODEL_NAME = 'FaceExpressionAndHandGestures';

    const response = await fetch(
      //`${CUSTOM_VISION_ENDPOINT}/customvision/v3.0/Prediction/${PROJECT_ID}/classify/iterations/${MODEL_NAME}/url`,
      `https://azureaiinsravan.cognitiveservices.azure.com/customvision/v3.0/Prediction/daaea539-0d1a-456b-a0fc-31e121039d56/detect/iterations/FaceExpressionAndHandGestures/image`,
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
  // function imageBase64ToBlob(base64: string) {
  //   const base64Data = base64.split(',')[1];
  //   console.log('base64Data image - ', base64Data);
  //   if (!base64Data) {
  //     throw new Error('Invalid base64 string');
  //   }
  //   const byteCharacters = atob(base64Data);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   return new Blob([new Uint8Array(byteNumbers)], { type: 'image/jpeg' });
  // }

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

  detectHandGestures1('asdfa');
  return (
    <div>
      <video ref={videoRef} autoPlay style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
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

  useEffect(() => {
    async function startVideoStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    startVideoStream();
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    async function analyzeFrame() {
      const imageUrl = await captureFrame();
      if (imageUrl) {
        await detectHandGestures(imageUrl);
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
  }, []);

  async function captureFrame() {
    console.log('Capturing frame...');
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
    const CUSTOM_VISION_ENDPOINT = 'https://YOUR_CUSTOM_VISION_ENDPOINT/';
    const CUSTOM_VISION_KEY = 'YOUR_CUSTOM_VISION_KEY';
    const PROJECT_ID = 'YOUR_PROJECT_ID';
    const MODEL_NAME = 'YOUR_MODEL_NAME';

    const response = await fetch(
      `${CUSTOM_VISION_ENDPOINT}/customvision/v3.0/Prediction/${PROJECT_ID}/classify/iterations/${MODEL_NAME}/image`,
      {
        method: 'POST',
        headers: {
          'Prediction-Key': CUSTOM_VISION_KEY,
          'Content-Type': 'application/octet-stream'
        },
        body: imageBase64ToBlob(imageBase64)
      }
    );

    const data = await response.json();
    console.log('Gesture detected data - \n');
    console.log(data);
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
    <div>
      <video ref={videoRef} autoPlay style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <CallCompositeContainer {...props} adapter={adapter} />
    </div>
  );
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
