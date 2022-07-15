// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TestCallingState } from '../TestCallingState';

export interface QueryArgs {
  // Defined only for hermetic tests.
  mockCallState?: TestCallingState;
  useFrLocale: boolean;
  showCallDescription: boolean;
  injectParticipantMenuItems: boolean;
  injectCustomButtons: boolean;

  // These are only set for live tests.
  // TODO: Separate the args out better.
  userId: string;
  groupId: string;
  token: string;
  displayName: string;
}

export function parseQueryArgs(): QueryArgs {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return {
    mockCallState: params.mockCallState ? JSON.parse(params.mockCallState) : undefined,
    useFrLocale: Boolean(params.useFrLocale),
    showCallDescription: Boolean(params.showCallDescription),
    injectParticipantMenuItems: Boolean(params.injectParticipantMenuItems),
    injectCustomButtons: Boolean(params.injectCustomButtons),
    userId: params.userId ?? '',
    groupId: params.groupId ?? '',
    token: params.token ?? '',
    displayName: params.displayName ?? ''
  };
}
