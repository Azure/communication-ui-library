// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type ListParticipant = {
  key: string;
  displayName?: string;
  state: string;
  isScreenSharing: boolean;
  isMuted: boolean;
  onRemove?: () => void;
  onMute?: () => void;
};
