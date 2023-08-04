// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// Adapted from: https://github.com/AlmeroSteyn/react-aria-live/blob/master/src/modules/AnnouncerContext.js

import React from 'react';

/** @private */
export type AnnouncerContextType = {
  announceAssertive: (message: string, id: string) => void;
  announcePolite: (message: string, id: string) => void;
};

/** @private */
const AnnouncerContext = React.createContext<AnnouncerContextType>({
  announceAssertive: logContextWarning,
  announcePolite: logContextWarning
});

function logContextWarning(): void {
  console.warn('Announcement failed, LiveAnnouncer context is missing');
}

export default AnnouncerContext;
