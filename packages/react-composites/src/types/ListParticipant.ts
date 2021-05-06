// © Microsoft Corporation. All rights reserved.

export type ListParticipant = {
  key: string;
  displayName?: string;
  state: string;
  isScreenSharing: boolean;
  isMuted: boolean;
  onRemove?: () => void;
  onMute?: () => void;
};
