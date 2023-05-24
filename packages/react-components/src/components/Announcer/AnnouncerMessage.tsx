// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// Adapted from: https://github.com/AlmeroSteyn/react-aria-live/blob/master/src/modules/AnnouncerMessage.js

import { useCallback, useEffect } from 'react';
import { v1 as createGUID } from 'uuid';

/** @private */
const AnnouncerMessage = (props: {
  message: string;
  ariaLive: string;
  clearOnUnmount?: boolean;
  announceAssertive: (message: string, id: string) => void;
  announcePolite: (message: string, id: string) => void;
}): null => {
  const { message, ariaLive, clearOnUnmount, announceAssertive, announcePolite } = props;

  const announce = useCallback(() => {
    if (ariaLive === 'assertive') {
      announceAssertive(message || '', createGUID());
    }
    if (ariaLive === 'polite') {
      announcePolite(message || '', createGUID());
    }
  }, [announceAssertive, announcePolite, ariaLive, message]);

  useEffect(() => {
    announce();
    return () => {
      if (clearOnUnmount) {
        announceAssertive('', createGUID());
        announcePolite('', createGUID());
      }
    };
  }, [message, clearOnUnmount, announce, announceAssertive, announcePolite]);

  return null;
};

export default AnnouncerMessage;
