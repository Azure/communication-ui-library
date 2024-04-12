// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallState } from '@internal/calling-stateful-client';
import { useEffect } from 'react';
import {
  ROOM_NOT_FOUND_SUB_CODE,
  ROOM_NOT_VALID_SUB_CODE,
  NOT_INVITED_TO_ROOM_SUB_CODE,
  INVITE_TO_ROOM_REMOVED_SUB_CODE
} from './Utils';

/**
 * @private
 */
export const useEndedCallConsoleErrors = (endedCall?: CallState): void => {
  useEffect(() => {
    switch (endedCall?.callEndReason?.subCode) {
      case ROOM_NOT_FOUND_SUB_CODE:
        console.error('Call ended because the room id provided through the adapter locator could not be found');
        break;
      case ROOM_NOT_VALID_SUB_CODE:
        console.error('Call ended because this room is currently not valid.');
        break;
      case NOT_INVITED_TO_ROOM_SUB_CODE:
        console.error('Call ended because you are not invited to this room.');
        break;
      case INVITE_TO_ROOM_REMOVED_SUB_CODE:
        console.error('Call ended because your invite to this room has been removed.');
        break;
    }
  }, [endedCall?.callEndReason?.subCode]);
};
