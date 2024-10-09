// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CreateVideoStreamViewResult } from './VideoGalleryParticipant';

/**
 * Interface representing the result of a Together Mode stream view.
 */
export interface TogetherModeStreamViewResult {
  mainVideoView?: CreateVideoStreamViewResult;
  panomaricVideoView?: CreateVideoStreamViewResult;
}
