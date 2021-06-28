// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapter } from '../../CallComposite/adapter/CallAdapter';
import { ChatAdapter } from '../../ChatComposite/adapter/ChatAdapter';

// NOT USED - Using separate chat and calling adapters for simplicity for now...
export interface MeetingAdapter extends CallAdapter, ChatAdapter {
  getState(): any;
  off(): any;
  on(): any;
  offStateChange(): any;
  onStateChange(): any;
}
