// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, DeviceManager, VideoDeviceInfo } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * DeclarativeDeviceManager type adds a destructor which should be called to unsubscribe the DeclarativeDeviceManager
 * from all events.
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

  constructor(context: CallContext, deviceManager: DeviceManager) {
    this._context = context;
    this._deviceManager = deviceManager;
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
        return () => {
          return target.getCameras().then((cameras: VideoDeviceInfo[]) => {
            this._context.setDeviceManagerCameras(cameras);
            return cameras;
          });
        };
      }
      case 'getMicrophones': {
        return () => {
          return target.getMicrophones().then((microphones: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerMicrophones(microphones);
            return microphones;
          });
        };
      }
      case 'getSpeakers': {
        return () => {
          return target.getSpeakers().then((speakers: AudioDeviceInfo[]) => {
            this._context.setDeviceManagerSpeakers(speakers);
            return speakers;
          });
        };
      }
      case 'selectMicrophone': {
        return async (...args: Parameters<DeviceManager['selectMicrophone']>) => {
          await target.selectMicrophone(...args);
          this._context.setDeviceManagerSelectedMicrophone(target.selectedMicrophone);
        };
      }
      case 'selectSpeaker': {
        return async (...args: Parameters<DeviceManager['selectSpeaker']>) => {
          await target.selectSpeaker(...args);
          this._context.setDeviceManagerSelectedSpeaker(target.selectedSpeaker);
        };
      }
      case 'askDevicePermission': {
        return async (...args: Parameters<DeviceManager['askDevicePermission']>) => {
          const deviceAccess = await target.askDevicePermission(...args);
          this._context.setDeviceManagerDeviceAccess(deviceAccess);
          return deviceAccess;
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
  const proxyDeviceManager = new ProxyDeviceManager(context, deviceManager);
  Object.defineProperty(deviceManager, 'destructor', {
    configurable: false,
    value: () => proxyDeviceManager.destructor()
  });
  return new Proxy(deviceManager, proxyDeviceManager) as DeclarativeDeviceManager;
};
