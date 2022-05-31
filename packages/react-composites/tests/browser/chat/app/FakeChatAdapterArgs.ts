// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { FileMetadata } from '@internal/react-components';

export type FileUpload = FileMetadata & { uploadComplete?: boolean; error?: string; progress?: number };

export type FakeChatAdapterArgs = {
  localParticipant: ChatParticipant;
  remoteParticipants: ChatParticipant[];
  localParticipantPosition?: number;
  fileUploads?: FileUpload[];
  fileSharingEnabled?: boolean;
  failFileDownload?: boolean;
  sendRemoteFileSharingMessage?: boolean;
  frenchLocalEnabled?: boolean;
};
