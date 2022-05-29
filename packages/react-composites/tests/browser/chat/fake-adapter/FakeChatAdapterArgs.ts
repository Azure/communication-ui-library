// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FileMetadata } from '@internal/react-components';

export type FileUpload = FileMetadata & { uploadComplete?: boolean; error?: string; progress?: number };

export type FakeChatAdapterArgs = {
  localParticipant: string;
  remoteParticipants: string[];
  localParticipantPosition?: number;
  fileUploads?: FileUpload[];
  fileSharingEnabled?: boolean;
  failFileDownload?: boolean;
  sendRemoteFileSharingMessage?: boolean;
  frenchLocalEnabled?: boolean;
};
