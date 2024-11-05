// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-ignore
import { AudioOutputDevice } from '@skype/waimea-media/audio_output_device';
//@ts-ignore
import { waitForAutoPlay } from '@skype/waimea-media/auto_play';
//@ts-ignore
import { DeviceMediaTrackProvider } from '@skype/waimea-media/device_media_track_provider';
//@ts-ignore
import { AudioTrack } from '@skype/waimea-media/media_track_provider';
//@ts-ignore
import { createFeedSession } from '@skype/waimea-session';
//@ts-ignore
import { IFeedView, IOutboundAudio, ISession, MediaReflectionMode } from '@skype/waimea-session/session';
//@ts-ignore
import { assertNotNull } from '@skype/waimea-util/asserts';
//@ts-ignore
import { createResolver, createTimeout } from '@skype/waimea-util/promise';

let audioContext: AudioContext | undefined;

const wbOrigin = 'https://alphasandbox.dev.waimeabae.com';
const audioInputDevice = DeviceMediaTrackProvider.createAudio();

let activeSession: ISession | undefined;
let feedView: IFeedView | undefined;
let activeSources = new Map<string, AbstractRenderer<HTMLElement>>();
let roomUpdating = false;
const sessionConfigs = new WeakMap<ISession, unknown>();
const REACTIVATE_PERIOD_MS = 60 * 60 * 1000; // 1hr, the sample server has a 24hr timeout;

async function setActivationProfile(
  session: ISession,
  activationOrigin: string,
  profile = 'default',
  params: Record<string, string> = {}
): Promise<void> {
  await session.metadata.then(({ endpointId, secretToken }: any) => {
    const payload = {
      // Apply params first, so endpointId, secretToken and profile are not overwritten
      ...params,
      endpointId,
      secretToken,
      profile
    };
    sessionConfigs.set(session, payload);

    const initialFetchComplete = createResolver<void>();
    void (async function () {
      let disconnected = false;
      void session.onDisconnect.finally(() => {
        disconnected = true;
      });
      while (!disconnected && sessionConfigs.get(session) === payload) {
        await fetch(`${activationOrigin}/samples/app_server/activate`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        initialFetchComplete.resolve();
        await createTimeout(REACTIVATE_PERIOD_MS);
      }
    })();

    return initialFetchComplete.promise;
  });
}

let disconnectPromise: Promise<void> | undefined = undefined;

// Handles creating a session and monitoring for the session being ended.
function connect(): Promise<void> {
  if (activeSession) {
    try {
      (activeSession as any).dispose();
    } catch (e) {
      console.error('Could not call session.dipose', e);
    }
    activeSession = undefined;
    resetObjects();
  }
  const start = performance.now();
  const session = createFeedSession(wbOrigin);
  void setActivationProfile(session, wbOrigin, 'empty');
  feedView = session
    .createFeedView()
    .setFeedId('room')
    .setInboundAudioConfig({ maxStreams: 50, reflectionMode: MediaReflectionMode.LOCAL });

  activeSession = session;

  createAudioHandler(feedView, audioInputDevice);

  roomUpdated();
  const connectPromise = session.onConnect.then(() => {
    if (activeSession === session) {
      console.log(`Connected (${(performance.now() - start) | 0}ms)`);
    }
  });
  disconnectPromise = session.onDisconnect.finally(() => {
    if (activeSession === session) {
      activeSession = undefined;
      console.log('Not Connected');
      resetObjects();
    }
  });
  console.log('Connecting...');
  return connectPromise;
}

// Disconnects the session, most of the actual work is in the connect() function
// where it watches for onDisconnect to cleanup state.
function disconnect(): Promise<void> | undefined {
  if (activeSession) {
    try {
      (activeSession as any).dispose();
    } catch (e) {
      console.error('Could not call session.dipose', e);
    }
  }

  return disconnectPromise;
}

function resetObjects() {
  for (const source of activeSources.values()) {
    source.dispose();
  }
  activeSources = new Map();
}

// Triggers updating publications and subscriptions when the roomName is updated,
// with some primitive debouncing.
function roomUpdated() {
  if (!roomUpdating) {
    roomUpdating = true;
    setTimeout(() => {
      roomUpdating = false;
      if (activeSession) {
        const roomId = 'ai_test';
        void setActivationProfile(activeSession, wbOrigin, roomId ? 'videoconf' : 'empty', {
          roomId
        });
      }
    }, 500);
  }
}

// Creates and handles a media type for the session.
function createAudioHandler(feedView: IFeedView, device: DeviceMediaTrackProvider<AudioTrack>) {
  let outstream: IOutboundAudio | undefined;
  if (!outstream) {
    outstream = assertNotNull(activeSession).createOutboundAudio().setFeedIds('room').setMediaSource(device);
  } else if (outstream) {
    outstream.setMediaSource(device);
  }

  feedView.inboundAudio.getAllSourceMedia().firesAll((media: any) => {
    const { isLocal, endpointId } = media.metadata;
    if (!isLocal) {
      const audioOutputDevice = new AudioOutputDevice();
      audioOutputDevice.addMediaTrackProvider(media.provider);
    }
    const source = new AudioRenderer(endpointId, isLocal);
    const queue = media.provider.acquire();
    void (async () => {
      let entry = await queue;
      while (!entry.done) {
        await source.update(entry.value.track);
        entry = await entry.next;
      }
      queue.dispose();
      source.dispose();
    })();
  });
}

abstract class AbstractRenderer<T extends HTMLElement> {
  readonly root: HTMLDivElement;
  readonly label: HTMLDivElement;
  readonly media: T;
  protected track: MediaStreamTrack | undefined;

  constructor(
    readonly endpointId: string,
    isSelf: boolean
  ) {
    this.root = document.createElement('div');
    this.root.className = 'renderer';
    this.label = document.createElement('div');
    this.label.className = 'label';
    this.label.appendChild(document.createTextNode(`${isSelf ? 'You' : 'Remote'}(${this.endpointId})`));
    this.root.appendChild(this.label);

    this.media = this.createMediaSurface();
    this.root.appendChild(this.media);
    // renderersContainer.appendChild(this.root);
    activeSources.set(endpointId, this);
  }

  abstract createMediaSurface(): T;
  abstract onTrackUpdatedInternal(): void;

  async update(track: MediaStreamTrack | undefined) {
    if (this.track !== track) {
      if (this.track) {
        this.track.stop();
      }
      this.track = track;

      // Wait for autoplay.
      if (!audioContext) {
        await waitForAutoPlay();
        if (!audioContext) {
          audioContext = new AudioContext();
        }
      }
      this.onTrackUpdatedInternal();
    }
  }

  dispose() {
    const parent = this.root.parentNode;
    if (parent) {
      parent.removeChild(this.root);
    }
    activeSources.delete(this.endpointId);
  }
}

class AudioRenderer extends AbstractRenderer<HTMLCanvasElement> {
  private readonly color: string;
  private analyzer: AnalyserNode | undefined;

  constructor(endpointId: string, isSelf: boolean) {
    super(endpointId, isSelf);
    this.color = '#f0f';
  }

  createMediaSurface() {
    const canvas = document.createElement('canvas');
    canvas.height = 33;
    canvas.width = 320;
    return canvas;
  }

  override dispose() {
    super.dispose();
    if (this.analyzer) {
      this.analyzer.disconnect();
      this.analyzer = undefined;
    }
  }

  onTrackUpdatedInternal() {
    if (this.analyzer) {
      this.analyzer.disconnect();
      this.analyzer = undefined;
    }

    const analyzer = assertNotNull(audioContext).createAnalyser();
    analyzer.fftSize = 2048;
    if (this.track) {
      const source = assertNotNull(audioContext).createMediaStreamSource(new MediaStream([this.track]));
      source.connect(analyzer);
    }
    this.analyzer = analyzer;

    const scaleAmplitude = (amplitude: number) =>
      (amplitude < 0 ? -Math.pow(-amplitude, 0.5) : Math.pow(amplitude, 0.5)) * (this.media.height / 2);
    const updateVisualization = () => {
      if (analyzer !== this.analyzer) {
        return;
      }
      const dataArray = new Float32Array(this.media.width);
      analyzer.getFloatTimeDomainData(dataArray);
      const ctx = this.media.getContext('2d');
      if (ctx) {
        ctx.save();
        try {
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          ctx.fillRect(0, 0, this.media.width, this.media.height);
          ctx.translate(0, this.media.height / 2);
          ctx.strokeStyle = this.color;
          ctx.beginPath();
          ctx.moveTo(0, scaleAmplitude(dataArray[0] ?? 0));
          for (let n = 1; n < dataArray.length; n++) {
            ctx.lineTo(n, scaleAmplitude(dataArray[n] ?? 0));
          }
          ctx.stroke();
          ctx.closePath();
        } finally {
          ctx.restore();
        }
      }
      requestAnimationFrame(updateVisualization);
    };
    updateVisualization();
  }
}

(globalThis as Record<string, unknown>)['conf'] = {
  connect,
  disconnect,
  roomUpdated
};

(globalThis as Record<string, unknown>)['conf'] = {
  acsConnect: connect,
  acsDisconnect: disconnect
};

(window as any).connect = connect;
(window as any).disconnect = disconnect;

export { connect, disconnect };
