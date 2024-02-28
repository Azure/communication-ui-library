// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';
/**
 * A memoized version of VideoTile for rendering the remote content sharing stream. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const RemoteContentSharing = React.memo(
  (props: { userId: string; displayName?: string; renderElement?: HTMLElement }) => {
    const { renderElement } = props;

    return (
      <VideoTile
        renderElement={
          renderElement ? <StreamMedia videoStreamElement={renderElement} loadingState="none" /> : undefined
        }
      />
    );
  }
);
