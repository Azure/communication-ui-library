// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

import { AudioDeviceInfo, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';

export const getACSId = (
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind
): string => {
  switch (identifier.kind) {
    case 'communicationUser': {
      return identifier.communicationUserId;
    }
    case 'phoneNumber': {
      return identifier.phoneNumber;
    }
    case 'microsoftTeamsUser': {
      return identifier.microsoftTeamsUserId;
    }
    default: {
      return identifier.id;
    }
  }
};

export function isSelectedDeviceInList<T extends AudioDeviceInfo | VideoDeviceInfo>(device: T, list: T[]): boolean {
  return !!list.find((item) => item.name === device.name);
}

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

// Only support Desktop -- Chrome | Edge (Chromium) | Safari
export const isLocalScreenShareSupportedInBrowser = (): boolean => {
  return (
    !isMobileSession() &&
    (/chrome/i.test(navigator.userAgent.toLowerCase()) || /safari/i.test(navigator.userAgent.toLowerCase()))
  );
};
