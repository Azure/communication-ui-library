// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, DeviceAccess, DeviceManager, VideoDeviceInfo } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * DeclarativeDeviceManager type adds a destructor which should be called to unsubscribe the DeclarativeDeviceManager
 * from all events so we can replace it with new DeclarativeDeviceManager.
 */
export interface DeclarativeDeviceManager extends DeviceManager {
  destructor: () => void;
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

    // isSpeakerSelectionAvailable, selectedMicrophone, and selectedSpeaker are properties on DeviceManager. Since they
    // are not functions we can't proxy them so we'll update them in the context when ProxyDeviceManager is created.
    // Then afterwards they should be updated via events or other function calls.
    this._context.setDeviceManagerIsSpeakerSelectionAvailable(deviceManager.isSpeakerSelectionAvailable);
    this._context.setDeviceManagerSelectedMicrophone(deviceManager.selectedMicrophone);
    this._context.setDeviceManagerSelectedSpeaker(deviceManager.selectedSpeaker);

    this.subscribe();
  }

  private subscribe = (): void => {
    this._deviceManager.on('videoDevicesUpdated', this.videoDevicesUpdated);
    this._deviceManager.on('audioDevicesUpdated', this.audioDevicesUpdated);
    this._deviceManager.on('selectedMicrophoneChanged', this.selectedMicrophoneChanged);
    this._deviceManager.on('selectedSpeakerChanged', this.selectedSpeakerChanged);
  };

  private unsubscribe = (): void => {
    this._deviceManager.off('videoDevicesUpdated', this.videoDevicesUpdated);
    this._deviceManager.off('audioDevicesUpdated', this.audioDevicesUpdated);
    this._deviceManager.off('selectedMicrophoneChanged', this.selectedMicrophoneChanged);
    this._deviceManager.off('selectedSpeakerChanged', this.selectedSpeakerChanged);
  };

  private videoDevicesUpdated = async (): Promise<void> => {
    this._context.setDeviceManagerCameras(await this._deviceManager.getCameras());
  };

  private audioDevicesUpdated = async (): Promise<void> => {
    this._context.setDeviceManagerMicrophones(await this._deviceManager.getMicrophones());
    this._context.setDeviceManagerSpeakers(await this._deviceManager.getSpeakers());
  };

  private selectedMicrophoneChanged = (): void => {
    this._context.setDeviceManagerSelectedMicrophone(this._deviceManager.selectedMicrophone);
  };

  private selectedSpeakerChanged = (): void => {
    this._context.setDeviceManagerSelectedSpeaker(this._deviceManager.selectedSpeaker);
  };

  public destructor = (): void => {
    this.unsubscribe();
  };

  public get<P extends keyof DeviceManager>(target: DeviceManager, prop: P): any {
    switch (prop) {
      case 'getCameras': {
        return (): Promise<VideoDeviceInfo[]> => {
          return target.getCameras().then((cameras: VideoDeviceInfo[]) => {
            this._context.setDeviceManagerCameras(cameras);
            return cameras;
          });
        };
      }
      case 'getMicrophones': {
        return (): Promise<AudioDeviceInfo[]> => {
          return target.getMicrophones().then((microphones: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerMicrophones(microphones);
            return microphones;
          });
        };
      }
      case 'getSpeakers': {
        return (): Promise<AudioDeviceInfo[]> => {
          return target.getSpeakers().then((speakers: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerSpeakers(speakers);
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
            return deviceAccess;
          });
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative DeviceManager by proxying DeviceManager with ProxyDeviceManager. The declarative DeviceManager
 * will put state updates in the given context.
 *
 * @param deviceManager
 * @param context
 */
export const deviceManagerDeclaratify = (
  deviceManager: DeviceManager,
  context: CallContext
): DeclarativeDeviceManager => {
  const proxyDeviceManager = new ProxyDeviceManager(deviceManager, context);
  Object.defineProperty(deviceManager, 'destructor', {
    configurable: false,
    value: () => proxyDeviceManager.destructor()
  });
  return new Proxy(deviceManager, proxyDeviceManager) as DeclarativeDeviceManager;
};
