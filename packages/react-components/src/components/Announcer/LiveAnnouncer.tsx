// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// Adapted from: https://github.com/AlmeroSteyn/react-aria-live/blob/master/src/modules/LiveAnnouncer.js

import React, { useCallback, useMemo } from 'react';
import Announcer, { AnnouncerMessageBag, EMPTY_MESSAGE } from './Announcer';
import AnnouncerContext from './AnnouncerContext';

/** @private */
const LiveAnnouncer = (props: { children: React.ReactChild }): JSX.Element => {
  const [politeMessage, setPoliteMessage] = React.useState<AnnouncerMessageBag>(EMPTY_MESSAGE);
  const [assertiveMessage, setAssertiveMessage] = React.useState<AnnouncerMessageBag>(EMPTY_MESSAGE);

  const announcePolite = useCallback((message: string, id: string) => {
    setPoliteMessage({ message, id });
  }, []);

  const announceAssertive = useCallback((message: string, id: string) => {
    setAssertiveMessage({ message, id });
  }, []);

  const updateFunctions = useMemo(
    () => ({
      announcePolite,
      announceAssertive
    }),
    [announceAssertive, announcePolite]
  );

  return (
    <AnnouncerContext.Provider value={updateFunctions}>
      {props.children}
      <Announcer assertive={assertiveMessage} polite={politeMessage} />
    </AnnouncerContext.Provider>
  );
};

export default LiveAnnouncer;
