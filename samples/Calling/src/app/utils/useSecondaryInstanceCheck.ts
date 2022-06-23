// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useEffect, useState } from 'react';

/**
 * Use the BroadcastChannel to check if the App is already running in another browser tab.
 * @returns true if this instance is a secondary instance running
 */
export const useSecondaryInstanceCheck = (): boolean => {
  const [isSecondaryInstance, setIsSecondaryInstance] = useState(false);

  // Only allow one instance of the sample to be open at a time on mobile
  useEffect(() => {
    const channel = new BroadcastChannel('secondary-instance-check');
    let isOriginalInstance = true;

    channel.postMessage('new-instance-opened');

    // Listen for messages from the other instances. When a message is received, if this is original instance
    // it will send a message back to the other instances to inform them an instance is already open.
    channel.addEventListener('message', (msg) => {
      if (msg.data === 'new-instance-opened' && isOriginalInstance) {
        // Received a message from a secondary instance, respond to all new instances the app is already running in this tab
        channel.postMessage('instance-already-open');
      }
      if (msg.data === 'instance-already-open') {
        // Received a message from the original instance informing this App it is a secondary instance.
        isOriginalInstance = false;
        setIsSecondaryInstance(true);
      }
    });
  }, []);

  return isSecondaryInstance;
};
