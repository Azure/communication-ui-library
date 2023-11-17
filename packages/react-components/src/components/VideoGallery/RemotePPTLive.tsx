// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';
import { _formatString } from '@internal/acs-ui-common';

/**
 * A memoized version of VideoTile for rendering the remote screen share stream. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const RemotePPTLive = React.memo(
  (props: { userId: string; displayName?: string; renderElement?: HTMLElement }) => {
    const { displayName, renderElement } = props;

    return (
      <VideoTile
        displayName={displayName}
        renderElement={
          renderElement ? <StreamMedia videoStreamElement={renderElement} loadingState="none" /> : undefined
        }
      />
    );
  }
);
