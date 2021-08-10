// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, DeviceAccess, DeviceManager, VideoDeviceInfo } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * Defines the additional methods added by the stateful on top of {@Link @azure/communication-calling#DeviceManager}.
 */
export interface StatefulDeviceManager extends DeviceManager {
  /**
   * Sets the selectedCamera in the {@Link DeviceManagerState}. This is completely developer driven and is not tied in
   * any way to {@Link @azure/communication-calling#DeviceManager}. It is entirely contained in
   * {@Link StatefulDeviceManager}. See also {@Link DeviceManagerState.selectedCamera}.
   */
  selectCamera: (VideoDeviceInfo) => void;
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
  private _context: CallContext;

  constructor(deviceManager: DeviceManager, context: CallContext) {
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
  };

  /**
   * This is used to unsubscribe DeclarativeDeviceManager from the DeviceManager events.
   */
  public unsubscribe = (): void => {
    this._deviceManager.off('videoDevicesUpdated', this.videoDevicesUpdated);
    this._deviceManager.off('audioDevicesUpdated', this.audioDevicesUpdated);
    this._deviceManager.off('selectedMicrophoneChanged', this.selectedMicrophoneChanged);
    this._deviceManager.off('selectedSpeakerChanged', this.selectedSpeakerChanged);
  };

  /**
   * Used to set a camera inside the proxy device manager.
   * @param videoDeviceInfo VideoDeviceInfo
   */
  public selectCamera = (videoDeviceInfo: VideoDeviceInfo): void => {
    this._context.setDeviceManagerSelectedCamera(videoDeviceInfo);
  };

  private videoDevicesUpdated = async (): Promise<void> => {
    this._context.setDeviceManagerCameras(dedupeById(await this._deviceManager.getCameras()));
  };

  private audioDevicesUpdated = async (): Promise<void> => {
    this._context.setDeviceManagerMicrophones(dedupeById(await this._deviceManager.getMicrophones()));
    this._context.setDeviceManagerSpeakers(dedupeById(await this._deviceManager.getSpeakers()));
  };

  private selectedMicrophoneChanged = (): void => {
    throw new Error('hia there');
    this._context.setDeviceManagerSelectedMicrophone(this._deviceManager.selectedMicrophone);
  };

  private selectedSpeakerChanged = (): void => {
    this._context.setDeviceManagerSelectedSpeaker(this._deviceManager.selectedSpeaker);
  };

  public get<P extends keyof DeviceManager>(target: DeviceManager, prop: P): any {
    switch (prop) {
      case 'getCameras': {
        return (): Promise<VideoDeviceInfo[]> => {
          return target.getCameras().then((cameras: VideoDeviceInfo[]) => {
            this._context.setDeviceManagerCameras(dedupeById(cameras));
            return cameras;
          });
        };
      }
      case 'getMicrophones': {
        return (): Promise<AudioDeviceInfo[]> => {
          return target.getMicrophones().then((microphones: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerMicrophones(dedupeById(microphones));
            return microphones;
          });
        };
      }
      case 'getSpeakers': {
        return (): Promise<AudioDeviceInfo[]> => {
          return target.getSpeakers().then((speakers: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerSpeakers(dedupeById(speakers));
            return speakers;
          });
        };
      }
      case 'selectMicrophone': {
        return (...args: Parameters<DeviceManager['selectMicrophone']>): Promise<void> => {
          return target.selectMicrophone(...args).then(() => {
            this._context.setDeviceManagerSelectedMicrophone(target.selectedMicrophone);
          });
        };
      }
      case 'selectSpeaker': {
        return (...args: Parameters<DeviceManager['selectSpeaker']>): Promise<void> => {
          return target.selectSpeaker(...args).then(() => {
            this._context.setDeviceManagerSelectedSpeaker(target.selectedSpeaker);
          });
        };
      }
      case 'askDevicePermission': {
        return (...args: Parameters<DeviceManager['askDevicePermission']>): Promise<DeviceAccess> => {
          return target.askDevicePermission(...args).then((deviceAccess: DeviceAccess) => {
            this._context.setDeviceManagerDeviceAccess(deviceAccess);
            this.setDeviceManager();
            return deviceAccess;
          });
        };
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
 */
export const deviceManagerDeclaratify = (deviceManager: DeviceManager, context: CallContext): DeviceManager => {
  const proxyDeviceManager = new ProxyDeviceManager(deviceManager, context);
  Object.defineProperty(deviceManager, 'unsubscribe', {
    configurable: false,
    value: () => proxyDeviceManager.unsubscribe()
  });
  Object.defineProperty(deviceManager, 'selectCamera', {
    configurable: false,
    value: (videoDeviceInfo: VideoDeviceInfo) => proxyDeviceManager.selectCamera(videoDeviceInfo)
  });
  return new Proxy(deviceManager, proxyDeviceManager) as StatefulDeviceManager;
};
