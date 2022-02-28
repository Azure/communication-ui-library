// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantsButtonStyles } from '@azure/communication-react';

/**
 * styles to make sure that the border on the participant menu isnt overriden buy the csutom styles example
 */
export const defaultBorderStyles: ParticipantsButtonStyles = {
  menuStyles: {
    participantListStyles: { root: { border: 'none' } }
  }
};
