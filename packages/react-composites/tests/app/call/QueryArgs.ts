// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ParticipantRole } from '@azure/communication-calling';
import { CallCompositeOptions } from '../../../src';
import { MockCallAdapterState } from '../../common';
import { jsonDateDeserializer } from '../lib/utils';

export interface QueryArgs {
  // Defined only for hermetic tests.
  mockCallAdapterState?: MockCallAdapterState;
  useFrLocale: boolean;
  showCallDescription: boolean;
  injectParticipantMenuItems: boolean;
  injectCustomButtons: boolean;
  newControlBarExperience?: boolean;
  role?: ParticipantRole;
  callInvitationUrl?: string;
  showParticipantItemIcon: boolean;
  customCallCompositeOptions?: CallCompositeOptions;
  useEnvironmentInfoTroubleshootingOptions?: boolean;
  usePermissionTroubleshootingActions?: boolean;
  rtl?: boolean;
  localVideoTilePosition?: false | ('grid' | 'floating');
  enableVideoEffect?: boolean;

  // These are only set for live tests.
  // TODO: Separate the args out better.
  userId: string;
  groupId: string;
  token: string;
  displayName: string;
  mockRemoteParticipantCount: number;
  enableVideoEffects?: boolean;
  galleryLayout?: string;
}

export function parseQueryArgs(): QueryArgs {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const localVideoTilePosition = !params.localVideoTilePosition
    ? undefined
    : params.localVideoTilePosition === 'false'
    ? false
    : params.localVideoTilePosition === 'floating'
    ? 'floating'
    : 'grid';

  return {
    mockCallAdapterState: params.mockCallAdapterState
      ? JSON.parse(params.mockCallAdapterState, jsonDateDeserializer) // json date deserializer is needed because Date objects are serialized as strings by JSON.stringify
      : undefined,
    useFrLocale: Boolean(params.useFrLocale),
    showCallDescription: Boolean(params.showCallDescription),
    injectParticipantMenuItems: Boolean(params.injectParticipantMenuItems),
    injectCustomButtons: Boolean(params.injectCustomButtons),
    newControlBarExperience: Boolean(params.newControlBarExperience),
    showParticipantItemIcon: Boolean(params.showParticipantItemIcon),
    useEnvironmentInfoTroubleshootingOptions: Boolean(params.useEnvironmentInfoTroubleshootingOptions),
    usePermissionTroubleshootingActions: Boolean(params.usePermissionTroubleshootingActions),
    userId: params.userId ?? '',
    groupId: params.groupId ?? '',
    token: params.token ?? '',
    displayName: params.displayName ?? '',
    role: (params.role as ParticipantRole) ?? undefined,
    rtl: Boolean(params.rtl),
    callInvitationUrl: params.callInvitationUrl,
    mockRemoteParticipantCount: Number(params.mockRemoteParticipantCount),
    customCallCompositeOptions: params.customCallCompositeOptions
      ? JSON.parse(params.customCallCompositeOptions)
      : undefined,
    localVideoTilePosition,
    enableVideoEffects: Boolean(params.enableVideoEffects),
    galleryLayout: params.galleryLayout ?? ''
  };
}
