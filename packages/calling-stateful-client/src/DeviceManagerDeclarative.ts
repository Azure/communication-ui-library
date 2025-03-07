// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioDeviceInfo, DeviceAccess, DeviceManager, VideoDeviceInfo } from '@azure/communication-calling';
import { InternalCallContext } from './InternalCallContext';

import { LocalVideoStream } from '@azure/communication-calling';

/**
 * Defines the additional methods added by the stateful on top of {@link @azure/communication-calling#DeviceManager}.
 *
 * @public
 */
export interface StatefulDeviceManager extends DeviceManager {
  /**
   * Sets the selectedCamera in the {@link DeviceManagerState}. This is completely developer driven and is not tied in
   * any way to {@link @azure/communication-calling#DeviceManager}. It is entirely contained in
   * {@link StatefulDeviceManager}. See also {@link DeviceManagerState.selectedCamera}.
   */
  selectCamera: (device: VideoDeviceInfo) => void;

  /**
   * Gets the list of unparented video streams. This is a list of video streams that have not been added to a
   * {@link @azure/communication-calling#Call}. This is useful for developers who want to interact with rendered
   * video streams before they have started a call. See also {@link @azure/communication-react#CallClient.createView}.
   *
   * @public
   */
  getUnparentedVideoStreams: () => LocalVideoStream[];
}

/** @private */
export interface IDeclarativeDeviceManagerContext {
  setDeviceManagerIsSpeakerSelectionAvailable: (isSpeakerSelectionAvailable: boolean) => void;
  setDeviceManagerSelectedMicrophone: (selectedMicrophone: AudioDeviceInfo | undefined) => void;
  setDeviceManagerSelectedSpeaker: (selectedSpeaker: AudioDeviceInfo | undefined) => void;
  setDeviceManagerCameras: (cameras: VideoDeviceInfo[]) => void;
  setDeviceManagerMicrophones: (microphones: AudioDeviceInfo[]) => void;
  setDeviceManagerSpeakers: (speakers: AudioDeviceInfo[]) => void;
  setDeviceManagerSelectedCamera: (selectedCamera: VideoDeviceInfo) => void;
  setDeviceManagerDeviceAccess: (deviceAccessState: DeviceAccess) => void;
  withAsyncErrorTeedToState<Args extends unknown[], R>(
    action: (...args: Args) => Promise<R>,
    target: unknown
  ): (...args: Args) => Promise<R>;
}

/**
 * ProxyDeviceManager proxies DeviceManager and subscribes to all events that affect device manager state. State updates
 * are set on the provided context. Also any queries for state are proxied and stored in state as well. Only one device
 * manager should exist for a given CallClient so if CallClient.getDeviceManager is called multiple times, either a
 * cached ProxyDeviceManager should be returned or the existing ProxyDeviceManager should be destructed via destructor()
 * and a new ProxyDeviceManager created.
 */
class ProxyDeviceManager implements ProxyHandler<DeviceManager> {
  private _deviceManager: DeviceManager;
  private _context: IDeclarativeDeviceManagerContext;

  constructor(deviceManager: DeviceManager, context: IDeclarativeDeviceManagerContext) {
    this._deviceManager = deviceManager;
    this._context = context;

    this.setDeviceManager();
    this.subscribe();
  }

  private setDeviceManager = (): void => {
    // isSpeakerSelectionAvailable, selectedMicrophone, and selectedSpeaker are properties on DeviceManager. Since they
    // are not functions we can't proxy them so we'll update whenever we think they may need updating such as at
    // construction time or when certain events happen.
    this._context.setDeviceManagerIsSpeakerSelectionAvailable(this._deviceManager.isSpeakerSelectionAvailable);
    this._context.setDeviceManagerSelectedMicrophone(this._deviceManager.selectedMicrophone);
    this._context.setDeviceManagerSelectedSpeaker(this._deviceManager.selectedSpeaker);
  };

  private subscribe = (): void => {
    this._deviceManager.on('videoDevicesUpdated', this.videoDevicesUpdated);
    this._deviceManager.on('audioDevicesUpdated', this.audioDevicesUpdated);
    this._deviceManager.on('selectedMicrophoneChanged', this.selectedMicrophoneChanged);
    this._deviceManager.on('selectedSpeakerChanged', this.selectedSpeakerChanged);

    // Subscribe to browser camera permissions changes
    if (navigator.permissions) {
      try {
        navigator.permissions.query({ name: 'camera' as PermissionName }).then((cameraPermissions): void => {
          cameraPermissions.addEventListener('change', this.permissionsApiStateChangeHandler);
        });
      } catch (e) {
        console.info(
          'Could not subscribe to Permissions API Camera changed events, API is not supported by browser',
          e
        );
      }

      // Subscribe to browser microphone permissions changes
      try {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then((micPermissions): void => {
          micPermissions.addEventListener('change', this.permissionsApiStateChangeHandler);
        });
      } catch (e) {
        console.info(
          'Could not subscribe to Permissions API Microphone changed events, API is not supported by browser',
          e
        );
      }
    }
  };

  /**
   * This is used to unsubscribe DeclarativeDeviceManager from the DeviceManager events.
   */
  public unsubscribe = (): void => {
    this._deviceManager.off('videoDevicesUpdated', this.videoDevicesUpdated);
    this._deviceManager.off('audioDevicesUpdated', this.audioDevicesUpdated);
    this._deviceManager.off('selectedMicrophoneChanged', this.selectedMicrophoneChanged);
    this._deviceManager.off('selectedSpeakerChanged', this.selectedSpeakerChanged);

    if (navigator.permissions) {
      // Unsubscribe from browser camera permissions changes
      try {
        navigator.permissions.query({ name: 'camera' as PermissionName }).then((cameraPermissions): void => {
          cameraPermissions.removeEventListener('change', this.permissionsApiStateChangeHandler);
        });
      } catch (e) {
        console.info(
          'Could not Unsubscribe to Permissions API Camera changed events, API is not supported by browser',
          e
        );
      }

      // Unsubscribe from browser microphone permissions changes
      try {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then((micPermissions): void => {
          micPermissions.removeEventListener('change', this.permissionsApiStateChangeHandler);
        });
      } catch (e) {
        console.info(
          'Could not Unsubscribe to Permissions API Camera changed events, API is not supported by browser',
          e
        );
      }
    }
  };

  private permissionsApiStateChangeHandler = async (): Promise<void> => {
    await this.updateDevicePermissionState();
  };

  /**
   * Used to set a camera inside the proxy device manager.
   *
   * @param videoDeviceInfo VideoDeviceInfo
   */
  public selectCamera = (videoDeviceInfo: VideoDeviceInfo): void => {
    this._context.setDeviceManagerSelectedCamera(videoDeviceInfo);
  };

  private videoDevicesUpdated = async (): Promise<void> => {
    // Device Manager always has a camera with '' name if there are no real camera devices available.
    // We don't want to show that in the UI.
    const realCameras = (await this._deviceManager.getCameras()).filter((c) => !!c.name);
    this._context.setDeviceManagerCameras(dedupeById(realCameras));
  };

  private audioDevicesUpdated = async (): Promise<void> => {
    this._context.setDeviceManagerMicrophones(dedupeById(await this._deviceManager.getMicrophones()));
    if (this._deviceManager.isSpeakerSelectionAvailable) {
      this._context.setDeviceManagerSpeakers(dedupeById(await this._deviceManager.getSpeakers()));
    }
  };

  private selectedMicrophoneChanged = (): void => {
    this._context.setDeviceManagerSelectedMicrophone(this._deviceManager.selectedMicrophone);
  };

  private selectedSpeakerChanged = (): void => {
    this._context.setDeviceManagerSelectedSpeaker(this._deviceManager.selectedSpeaker);
  };

  private updateDevicePermissionState = async (sdkDeviceAccessState?: DeviceAccess): Promise<void> => {
    let hasCameraPermission = !!sdkDeviceAccessState?.video;
    let hasMicPermission = !!sdkDeviceAccessState?.audio;

    // Supplement the SDK values with values from the Permissions API to get a better understanding of the device
    // permission state. The SDK only uses the getUserMedia API to determine the device permission state. However,
    // this returns false if the camera is in use by another application. The Permissions API can provide more
    // information about the device permission state, but is not supported yet in Firefox or Android WebView.
    // Note: It also has the limitation where it cannot detect if the device is blocked by the Operating System
    // permissions.
    if (navigator.permissions) {
      try {
        const [cameraPermissions, micPermissions] = await Promise.all([
          navigator.permissions.query({ name: 'camera' as PermissionName }),
          navigator.permissions.query({ name: 'microphone' as PermissionName })
        ]);

        hasCameraPermission = cameraPermissions.state === 'granted';
        hasMicPermission = micPermissions.state === 'granted';
      } catch (e) {
        console.info('Permissions API is not supported by browser', e);
      }
    }

    this._context.setDeviceManagerDeviceAccess({
      video: hasCameraPermission,
      audio: hasMicPermission
    });
    this.setDeviceManager();
  };

  public get<P extends keyof DeviceManager>(target: DeviceManager, prop: P): any {
    switch (prop) {
      case 'getCameras': {
        return this._context.withAsyncErrorTeedToState((): Promise<VideoDeviceInfo[]> => {
          return target.getCameras().then((cameras: VideoDeviceInfo[]) => {
            // Device Manager always has a camera with '' name if there are no real camera devices available.
            // We don't want to show that in the UI.
            const realCameras = cameras.filter((c) => !!c.name);
            this._context.setDeviceManagerCameras(dedupeById(realCameras));
            return realCameras;
          });
        }, 'DeviceManager.getCameras');
      }
      case 'getMicrophones': {
        return this._context.withAsyncErrorTeedToState((): Promise<AudioDeviceInfo[]> => {
          return target.getMicrophones().then((microphones: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerMicrophones(dedupeById(microphones));
            return microphones;
          });
        }, 'DeviceManager.getMicrophones');
      }
      case 'getSpeakers': {
        return this._context.withAsyncErrorTeedToState((): Promise<AudioDeviceInfo[]> => {
          return target.getSpeakers().then((speakers: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerSpeakers(dedupeById(speakers));
            return speakers;
          });
        }, 'DeviceManager.getSpeakers');
      }
      case 'selectMicrophone': {
        return this._context.withAsyncErrorTeedToState(
          (...args: Parameters<DeviceManager['selectMicrophone']>): Promise<void> => {
            return target.selectMicrophone(...args).then(() => {
              this._context.setDeviceManagerSelectedMicrophone(target.selectedMicrophone);
            });
          },
          'DeviceManager.selectMicrophone'
        );
      }
      case 'selectSpeaker': {
        return this._context.withAsyncErrorTeedToState(
          (...args: Parameters<DeviceManager['selectSpeaker']>): Promise<void> => {
            return target.selectSpeaker(...args).then(() => {
              this._context.setDeviceManagerSelectedSpeaker(target.selectedSpeaker);
            });
          },
          'DeviceManager.selectSpeaker'
        );
      }
      case 'askDevicePermission': {
        return this._context.withAsyncErrorTeedToState(
          (...args: Parameters<DeviceManager['askDevicePermission']>): Promise<DeviceAccess> => {
            return target.askDevicePermission(...args).then(async (deviceAccess: DeviceAccess) => {
              await this.updateDevicePermissionState(deviceAccess);
              return deviceAccess;
            });
          },
          'DeviceManager.askDevicePermission'
        );
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

// TODO: Remove this when SDK no longer returns duplicate audio and video devices
/** Helper function to dedupe duplicate audio and video devices obtained from SDK */
const dedupeById = <T extends { id: string }>(devices: T[]): T[] => {
  const ids = new Set();
  const uniqueDevices: T[] = [];
  devices.forEach((device: T) => {
    if (!ids.has(device.id)) {
      uniqueDevices.push(device);
      ids.add(device.id);
    }
  });
  return uniqueDevices;
};

/**
 * Creates a declarative DeviceManager by proxying DeviceManager with ProxyDeviceManager. The declarative DeviceManager
 * will put state updates in the given context.
 *
 * @param deviceManager - DeviceManager from SDK
 * @param context - CallContext from StatefulCallClient
 *
 * @private
 */
export const deviceManagerDeclaratify = (
  deviceManager: DeviceManager,
  context: IDeclarativeDeviceManagerContext,
  internalContext: InternalCallContext
): DeviceManager => {
  const proxyDeviceManager = new ProxyDeviceManager(deviceManager, context);
  Object.defineProperty(deviceManager, 'unsubscribe', {
    configurable: false,
    value: () => proxyDeviceManager.unsubscribe()
  });
  Object.defineProperty(deviceManager, 'selectCamera', {
    configurable: false,
    value: (videoDeviceInfo: VideoDeviceInfo) => proxyDeviceManager.selectCamera(videoDeviceInfo)
  });

  Object.defineProperty(deviceManager, 'getUnparentedVideoStreams', {
    configurable: false,
    value: (): LocalVideoStream[] => internalContext.getUnparentedRenderInfos()
  });
  return new Proxy(deviceManager, proxyDeviceManager) as StatefulDeviceManager;
};
